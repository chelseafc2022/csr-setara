const express = require('express');
var db = require('../../db//MySql/umum');

const { sendMail, escapeHtml } = require('../library/mailer');

const fs = require('fs');
const path = require('path');

var multer = require("multer");
var upload = require('../../db/multer/image');

var uniqid = require('uniqid');
const { log } = require('console');
const router = express.Router();
const cron = require('node-cron');

const uploadFields = upload.fields([
  { name: 'file', maxCount: 1 },      
  { name: 'file_spec', maxCount: 1 }   
]);


router.get('/kecamatan', (req, res) => {

  var query = `
    SELECT master_kecamatan.nama_kecamatan,
    master_kecamatan.kecamatan_id
        
        FROM master_kecamatan

        WHERE master_kecamatan.kabupaten_id = 7405 
   
    `;
  db.query(query, (err, row) => {
    if (err) {
      res.send(err);
      console.log(err)
    } else {
      res.send(row);
    }
  })
});

router.post('/kecamatan', (req, res) => {

  var userx = req.user.profile
  // console.log(userx); 
  console.log(userx.kecamatan_id);

  var filter_akses = ''

  if (userx.menu_klp == 1) {
    // console.log("BISA AKSES SEMUA");
    filter_akses = ``
  } else {
    // console.log("TIDAK BISA AKSES SEMUA");
    filter_akses = ` AND master_kecamatan.kecamatan_id = '` + userx.kecamatan_id + `'`;
  }

  // console.log(filter_akses);

  let view = ` 
        SELECT * FROM master_kecamatan
        WHERE master_kecamatan.kabupaten_id = 7405
        `+ filter_akses + `
        ORDER BY nama_kecamatan
    `;

  // console.log(view);

  db.query(view, (err, row) => {
    if (err) {
      res.json(err)
    } else {
      res.json(row)
    }
  })
});

router.post('/desa', (req, res) => {

  var query = `
    SELECT master_des_kel.nama_des_kel,
    master_des_kel.des_kel_id
        
        FROM master_des_kel

        WHERE master_des_kel.kecamatan_id = '`+ req.body.kecamatan_id + `' 
   
    `;
  db.query(query, (err, row) => {
    if (err) {
      res.send(err);
      console.log(err)
    } else {
      res.send(row);
    }
  })
});

router.post('/viewData', (req, res) => {
  try {
    const { status, kecamatan_id, desa_id, bidang_csr_id, bidang_sub_csr_id, cari_value } = req.body;
    let page_first = parseInt(req.body.page_first || req.body.data_ke || 1);
    let page_limit = parseInt(req.body.page_limit || 9);

    let where = "WHERE 1=1 ";

    if (status) where += ` AND k.status = ${db.escape(status)} `;
    if (kecamatan_id) where += ` AND k.kecamatan_id = ${db.escape(kecamatan_id)} `;
    if (desa_id) where += ` AND k.desa_id = ${db.escape(desa_id)} `;
    if (bidang_csr_id) where += ` AND k.bidang_csr_id = ${db.escape(bidang_csr_id)} `;
    if (bidang_sub_csr_id) where += ` AND k.bidang_sub_csr_id = ${db.escape(bidang_sub_csr_id)} `;
    if (cari_value) where += ` AND k.nama_csr LIKE ${db.escape('%' + cari_value + '%')} `;

    const offset = (parseInt(page_first) - 1) * parseInt(page_limit);


    const countSql = `SELECT COUNT(*) as total FROM kegiatan_csr k ${where}`;
    db.query(countSql, (err, countResult) => {
      if (err) return res.status(500).json({ success: false, message: "DB Error", error: err });
      const total = countResult[0].total;

      const sql = `
          SELECT 
            k.*,
            kc.nama_kecamatan,
            ds.nama_des_kel AS nama_desa,
            b.uraian AS uraian_bidang_csr,
            bs.uraian AS uraian_bidang_sub_csr
          FROM kegiatan_csr k
          LEFT JOIN master_kecamatan kc ON k.kecamatan_id = kc.kecamatan_id
          LEFT JOIN master_des_kel ds ON k.desa_id = ds.des_kel_id
          LEFT JOIN master_bidang_csr b ON k.bidang_csr_id = b.id
          LEFT JOIN master_bidang_sub_csr bs ON k.bidang_sub_csr_id = bs.id
          ${where}
          ORDER BY k.createdAt DESC
          LIMIT ${parseInt(offset)}, ${parseInt(page_limit)}
        `;

      db.query(sql, (err, rows) => {
        if (err) return res.status(500).json({ success: false, message: "DB Error", error: err });
        res.json({ data: rows, total });
      });
    });

  } catch (error) {
    console.error("❌ Server Error:", error);
    res.status(500).json({ success: false, message: "Server Error", error });
  }
});

// ====================== ADD DATA ======================
router.post('/addData', uploadFields, (req, res) => {
  try {
    const id = uniqid();
    const imageFile = req.files?.file?.[0]?.filename || null;
    const specFile = req.files?.file_spec?.[0]?.filename || null;

    const sql = `
      INSERT INTO kegiatan_csr (
        id, bidang_csr_id, bidang_sub_csr_id, nama_csr, deskripsi,
        jumlah, jumlah_sisa, satuan, nilai, tanggal_mulai, tanggal_selesai,
        kecamatan_id, desa_id, alamat,
        file_name, file_spec,
        status, createdBy, createdAt, editedBy, editedAt
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,1,?,NOW(),?,NOW())
    `;

    const params = [
      id,
      req.body.bidang_csr_id,
      req.body.bidang_sub_csr_id,
      req.body.nama_csr,
      req.body.deskripsi,
      req.body.jumlah,
      req.body.jumlah,
      req.body.satuan,
      req.body.nilai,
      req.body.tanggal_mulai,
      req.body.tanggal_selesai,
      req.body.kecamatan_id,
      req.body.desa_id,
      req.body.alamat,
      imageFile,                  
      specFile,
      req.user._id,
      req.user._id
    ];

    db.query(sql, params, (err) => {
      if (err) return res.status(500).json({ success: false, message: 'DB Error', error: err });
      res.json({ success: true, message: 'Data berhasil disimpan', id, file: imageFile, file_spec: specFile });
    });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Server Error', error: e });
  }
});

// ====================== EDIT DATA ======================
router.post('/editData', uploadFields, (req, res) => {
  try {
    const id = req.body.id;
    if (!id) {
      return res.status(400).json({ success: false, message: 'ID tidak ditemukan' });
    }

    const toNullable = (v) => {
      if (v === undefined || v === null) return null;
      const s = String(v).trim().toLowerCase();
      return (s === '' || s === 'null') ? null : v;
    };


    db.query('SELECT file_name, file_spec FROM kegiatan_csr WHERE id = ? LIMIT 1', [id], (err, rows) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'DB Error', error: err.message });
      }

      const oldImage = rows?.[0]?.file_name || null;
      const oldSpec = rows?.[0]?.file_spec || null;

      const newImage = req.files?.file?.[0]?.filename || oldImage;
      const newSpec = req.files?.file_spec?.[0]?.filename || oldSpec;
      const sql = `
        UPDATE kegiatan_csr SET
          bidang_csr_id=?, bidang_sub_csr_id=?, nama_csr=?, deskripsi=?,
          jumlah=?, jumlah_sisa=?, satuan=?, nilai=?, tanggal_mulai=?, tanggal_selesai=?,
          kecamatan_id=?, desa_id=?, alamat=?, file_name=?, file_spec=?,
          editedBy=?, editedAt=NOW()
        WHERE id=?
      `;

      const params = [
        req.body.bidang_csr_id || null,
        req.body.bidang_sub_csr_id || null,
        req.body.nama_csr || '',
        req.body.deskripsi || '',
        req.body.jumlah ?? null,
        req.body.jumlah ?? null, 
        req.body.satuan || '',
        req.body.nilai ?? null,
        req.body.tanggal_mulai || null,
        req.body.tanggal_selesai || null,
        toNullable(req.body.kecamatan_id),
        toNullable(req.body.desa_id),
        toNullable(req.body.alamat),
        newImage,
        newSpec,
        req.user?._id || null,
        id
      ];

      db.query(sql, params, (err2, result) => {
        if (err2) {
          return res.status(500).json({ success: false, message: 'DB Error', error: err2.message });
        }



        const uploadDir = upload?.dest || 'uploads';
        if (req.files?.file && oldImage && oldImage !== newImage) {
          fs.unlink(`${uploadDir}/${oldImage}`, (unlinkErr) => {
            if (unlinkErr) console.error('Error deleting old image:', unlinkErr);
          });
        }
        if (req.files?.file_spec && oldSpec && oldSpec !== newSpec) {
          console.log('Deleting old spec file:', oldSpec);
          fs.unlink(`${uploadDir}/${oldSpec}`, (unlinkErr) => {
            if (unlinkErr) console.error('Error deleting old spec:', unlinkErr);
          });
        }

        res.json({
          success: true,
          message: 'Data berhasil diubah',
          affectedRows: result.affectedRows,
          file: newImage,
          file_spec: newSpec
        });
      });
    });
  } catch (error) {

    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
});


router.post('/removeData', (req, res) => {
  const id = req.body.id;
  if (!id) return res.status(400).json({ success: false, message: 'ID diperlukan' });

  const uploadDir = upload?.dest || 'uploads';
  const safeUnlink = (fname) => {
    if (!fname) return Promise.resolve();
    const fp = path.join(uploadDir, fname);
    return fs.promises.unlink(fp).catch(() => { });
  };

  const q = (sql, params = []) => new Promise((resolve, reject) => {
    db.query(sql, params, (err, rows) => err ? reject(err) : resolve(rows));
  });

  (async () => {
    try {
      const kegRows = await q('SELECT status, file_name, file_spec FROM kegiatan_csr WHERE id=? LIMIT 1', [id]);
      if (!kegRows.length) return res.status(404).json({ success: false, message: 'Data kegiatan tidak ditemukan' });

      const { status, file_name: fileImg, file_spec: fileSpec } = kegRows[0];
      if (Number(status) !== 1) {
        return res.status(409).json({ success: false, message: `Tidak dapat menghapus. Status=${status}. Hanya status 1.` });
      }

      await q('DELETE FROM kegiatan_mitra WHERE kegiatan_id=?', [id]);
      const delKeg = await q('DELETE FROM kegiatan_csr WHERE id=?', [id]);
      if (delKeg.affectedRows === 0) return res.status(500).json({ success: false, message: 'Gagal menghapus kegiatan' });

      Promise.allSettled([safeUnlink(fileImg), safeUnlink(fileSpec)]).then(() => {
        res.json({
          success: true,
          message: 'Kegiatan Program CSR berhasil dihapus',
          removedFiles: { file_name: fileImg, file_spec: fileSpec }
        });
      });
    } catch (err) {
      console.error('RemoveData ERROR:', err);
      res.status(500).json({ success: false, message: 'Gagal menghapus', error: err.message });
    }
  })();
});





router.get('/mitra/:user_id', (req, res) => {
  const userId = req.params.user_id;

  const sql = `
    SELECT 
      u.id AS user_id, 
      u.username, 
      u.nama AS nama_pj, 
      u.jabatan, 
      u.email AS email_pj, 
      u.hp AS hp_pj,
      p.nama AS nama_perusahaan, 
      p.email AS email_perusahaan, 
      p.hp AS telp_perusahaan, 
      p.alamat AS alamat_perusahaan
    FROM users u
    LEFT JOIN perusahaan p ON u.id = p.users_id
    WHERE u.id = ?
  `;

  db.query(sql, [userId], (err, rows) => {
    if (err) {
      console.error("❌ DB Error:", err.sqlMessage);
      return res.status(500).json({ success: false, message: "DB Error", error: err });
    }

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Mitra tidak ditemukan" });
    }

    res.json({ success: true, data: rows[0] });
  });
});

router.post("/addPengajuan", (req, res) => {
  try {
    const id = uniqid();
    const { kegiatan_id, perusahaan_id, jumlah_ambil, catatan_mitra } = req.body;


    if (!kegiatan_id || !perusahaan_id || !jumlah_ambil) {
      return res.status(400).json({ success: false, message: "Data tidak lengkap" });
    }

    let insert = `
      INSERT INTO kegiatan_mitra 
      (id, kegiatan_id, perusahaan_id, jumlah_ambil, catatan_mitra, status_pengajuan, catatan_admin, createdBy, createdAt, editedBy, editedAt)
      VALUES (
        '${id}',
        '${kegiatan_id}',
        '${perusahaan_id}',
        '${jumlah_ambil}',
        ${catatan_mitra ? `'${catatan_mitra}'` : "NULL"},
        1,
        'Menunggu persetujuan admin',
        '${req.user._id}',
        NOW(),
        '${req.user._id}',
        NOW()
      )
    `;

    db.query(insert, async (err) => {
      if (err) {
        console.error("❌ DB Insert Error:", err.sqlMessage);
        return res.status(500).json({ success: false, message: "DB Error", error: err });
      }
      try {
        const progRows = await new Promise((resolve, reject) => {
          db.query('SELECT id, nama_csr FROM kegiatan_csr WHERE id = ?', [kegiatan_id], (e, r) => e ? reject(e) : resolve(r));
        });
        const program = progRows[0] || { nama_csr: 'Program CSR' };

        const mitraRows = await new Promise((resolve, reject) => {
          db.query(`
      SELECT u.nama AS nama_pj, u.email AS email_pj, p.nama AS nama_perusahaan, p.email AS email_perusahaan
      FROM users u
      LEFT JOIN perusahaan p ON u.id = p.users_id
      WHERE p.id = ? OR u.id = ?
      LIMIT 1
    `, [perusahaan_id, perusahaan_id], (e, r) => e ? reject(e) : resolve(r));
        });
        const mitra = mitraRows[0] || {};

        const emailMitra = mitra.email_perusahaan || mitra.email_pj || null;
        const adminEmails = process.env.NOTIF_TO || 'csrsetarakonsel@gmail.com';
        const pengajuanId = id;
        const tgl = new Date().toLocaleString();

        const adminBase = (process.env.ADMIN_URL).replace(/\/$/, '');
        const adminLink = `${adminBase}/#/list_pengajuan`;


        const safeProgram = escapeHtml(program.nama_csr || '');
        const safePerusahaan = escapeHtml(mitra.nama_perusahaan || '-');
        const safeNamaPJ = escapeHtml(mitra.nama_pj || '-');
        const safeEmailPJ = escapeHtml(mitra.email_perusahaan || '-');
        const safeJumlah = escapeHtml(String(jumlah_ambil));
        const safeCatatan = escapeHtml(catatan_mitra ?? '-');

        const subjectAdmin = `[CSR-SETARA] Pengajuan Baru - ${safeProgram} - ID ${pengajuanId}`;
        const htmlAdmin = `
  <!doctype html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Notifikasi Pengajuan</title>
  </head>
  <body style="font-family: Arial, Helvetica, sans-serif; margin:0; padding:0; color:#222;">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td align="center" style="padding:20px;">
          <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="border:1px solid #e6e6e6; border-radius:8px; overflow:hidden;">
            <tr style="background:#0d6efd; color:white;">
              <td style="padding:18px 24px;">
                <h2 style="margin:0; font-size:18px;">CSR-SETARA KONSEL — Notifikasi Pengajuan</h2>
                <p style="margin:6px 0 0; font-size:13px; opacity:0.95;">Ada pengajuan baru yang menunggu verifikasi</p>
              </td>
            </tr>
  
            <tr>
              <td style="padding:20px;">
                <p style="margin:0 0 12px;">Halo Admin,</p>
  
                <table cellpadding="0" cellspacing="0" role="presentation" style="width:100%; margin-bottom:14px;">
                  <tr><td style="padding:6px 0;"><strong>ID:</strong></td><td style="padding:6px 0;">${escapeHtml(pengajuanId)}</td></tr>
                  <tr><td style="padding:6px 0;"><strong>Program:</strong></td><td style="padding:6px 0;">${safeProgram}</td></tr>
                  <tr><td style="padding:6px 0;"><strong>Perusahaan:</strong></td><td style="padding:6px 0;">${safePerusahaan}</td></tr>
                  <tr><td style="padding:6px 0;"><strong>Penanggung Jawab:</strong></td><td style="padding:6px 0;">${safeNamaPJ}</td></tr>
                  <tr><td style="padding:6px 0;"><strong>Email PJ:</strong></td><td style="padding:6px 0;"><a href="mailto:${safeEmailPJ}">${safeEmailPJ}</a></td></tr>
                  <tr><td style="padding:6px 0;"><strong>Jumlah:</strong></td><td style="padding:6px 0;">${safeJumlah}</td></tr>
                  <tr><td style="padding:6px 0;"><strong>Catatan:</strong></td><td style="padding:6px 0;">${safeCatatan}</td></tr>
                  <tr><td style="padding:6px 0;"><strong>Tanggal:</strong></td><td style="padding:6px 0;">${escapeHtml(tgl)}</td></tr>
                </table>
  
                <p style="margin:18px 0;">
                  <a href="${adminLink}" style="display:inline-block; padding:10px 16px; background:#0d6efd; color:white; text-decoration:none; border-radius:6px; font-weight:600;">Buka Panel Pengajuan</a>
                </p>
  
                <hr style="border:none; border-top:1px solid #eee; margin:18px 0;">
  
                <p style="margin:0; color:#666; font-size:13px;">
                  Jika Anda ingin membalas langsung ke mitra, klik <em>Reply</em> — reply akan menuju ke ${safeEmailPJ}.
                </p>
              </td>
            </tr>
  
            <tr>
              <td style="background:#f8f9fb; padding:12px 20px; font-size:12px; color:#666;">
                CSR-SETARA • Kabupaten Konawe Selatan
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;

        // kirim tanpa await — log result/err
        sendMail({ to: adminEmails, subject: subjectAdmin, html: htmlAdmin, replyTo: emailMitra || undefined })
          .then(info => console.log('✅ Email notifikasi ke admin terkirim:', info.messageId || info.accepted || 'ok'))
          .catch(err => console.error('❌ Gagal kirim email ke admin:', err && err.message ? err.message : err));

        // Email konfirmasi ke mitra (jika ada) — juga non-blocking
        if (emailMitra) {
          const subjectMitra = `Konfirmasi Pengajuan - ${safeProgram} - ID ${pengajuanId}`;
          const htmlMitra = `
<!doctype html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family: Arial, Helvetica, sans-serif; margin:0; padding:0; color:#222;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
      <td align="center" style="padding:20px;">
        <table width="560" cellpadding="0" cellspacing="0" role="presentation" style="border:1px solid #eee; border-radius:8px;">
          <tr style="background:#f5f7fa;"><td style="padding:16px 20px;">
            <h3 style="margin:0; font-size:16px;">Terima kasih — Pengajuan Anda telah diterima</h3>
          </td></tr>

          <tr><td style="padding:18px 20px;">
            <p style="margin:0 0 12px;">Halo ${safeNamaPJ},</p>
            <p style="margin:0 0 14px;">Kami telah menerima pengajuan Anda. Berikut ringkasan pengajuan:</p>

            <ul style="margin:0 0 14px; padding-left:18px; color:#333;">
              <li><strong>ID:</strong> ${escapeHtml(pengajuanId)}</li>
              <li><strong>Program:</strong> ${safeProgram}</li>
              <li><strong>Jumlah:</strong> ${safeJumlah}</li>
              <li><strong>Status:</strong> Menunggu verifikasi admin</li>
            </ul>

            <p style="margin:0 0 14px; color:#555;">Estimasi proses: 1–3 hari kerja. Jika perlu info lebih lanjut, balas email ini atau hubungi admin di <a href="mailto:${escapeHtml(adminEmails)}">${escapeHtml(adminEmails)}</a>.</p>

            <p style="margin:18px 0;">
              <a href="${adminLink}" style="display:inline-block; padding:10px 14px; background:#0d6efd; color:#fff; text-decoration:none; border-radius:6px;">Lihat Status Pengajuan</a>
            </p>

            <p style="margin:18px 0 0; font-size:12px; color:#999;">Catatan: Email ini hanya konfirmasi penerimaan pengajuan. Admin akan menghubungi Anda jika diperlukan.</p>
          </td></tr>

          <tr><td style="padding:10px 18px; background:#fafafa; font-size:12px; color:#777;">CSR-SETARA KONSEL</td></tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

          sendMail({ to: emailMitra, subject: subjectMitra, html: htmlMitra })
            .then(info => console.log('✅ Email konfirmasi ke mitra terkirim:', info.messageId || info.accepted || 'ok'))
            .catch(err => console.error('❌ Gagal kirim email ke mitra:', err && err.message ? err.message : err));
        } else {
          console.log('⚠️ Mitra tidak memiliki email, melewatkan konfirmasi ke mitra.');
        }

      } catch (fetchErr) {
        console.error('❌ Gagal ambil data untuk email:', fetchErr && fetchErr.message ? fetchErr.message : fetchErr);
      }


      res.json({ success: true, message: "Pengajuan berhasil dikirim, menunggu persetujuan admin", id });
    });
  } catch (error) {
    console.error("❌ Server Error:", error);
    res.status(500).json({ success: false, message: "Server Error", error });
  }
});



// Cron job setiap hari jam 00:00
cron.schedule('0 0 * * *', () => {
  const sql = `
    UPDATE kegiatan_csr
    SET status = 4
    WHERE tanggal_selesai < NOW()
      AND status != 4
  `;
  db.query(sql, (err, result) => {
    if (err) {
      console.error("❌ Error update status selesai:", err);
    } else {
      console.log(`✅ Cron update status selesai: ${result.affectedRows} program`);
    }
  });
});


module.exports = router;