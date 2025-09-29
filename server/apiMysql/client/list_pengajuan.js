const express = require('express');
var db = require('../../db/MySql/umum');
const { sendMail, escapeHtml } = require('../library/mailer');


const fs = require('fs');
const path = require("path");

var multer=require("multer");
var upload = require('../../db/multer/image');

var uniqid = require('uniqid');
const { log } = require('console');
const router = express.Router();


router.get('/kecamatan', (req, res) => {

    var query = `
    SELECT master_kecamatan.nama_kecamatan,
    master_kecamatan.kecamatan_id
        
        FROM master_kecamatan

        WHERE master_kecamatan.kabupaten_id = 7405 
   
    `;
     db.query(query, (err, row)=>{
        if(err) {
            res.send(err);
            console.log(err)
        }else{
            res.send(row);
        }
    })
});

router.post('/kecamatan', (req, res) => {

    var userx = req.user.profile

    
    var filter_akses = ''

    if (userx.menu_klp == 1) {
        filter_akses = ``
    } else {
        filter_akses = ` AND master_kecamatan.kecamatan_id = '`+userx.kecamatan_id+`'` ;
    }
    
    let view = ` 
        SELECT * FROM master_kecamatan
        WHERE master_kecamatan.kabupaten_id = 7405
        `+filter_akses+`
        ORDER BY nama_kecamatan
    `;

    db.query(view, (err, row)=>{
        if (err) {
            res.json(err)
        }else{
            res.json(row)
        }
    })
});

router.post('/desa', (req, res) => {

    var query = `
    SELECT master_des_kel.nama_des_kel,
    master_des_kel.des_kel_id
        
        FROM master_des_kel

        WHERE master_des_kel.kecamatan_id = '`+req.body.kecamatan_id+`' 
   
    `;
     db.query(query, (err, row)=>{
        if(err) {
            res.send(err);
            console.log(err)
        }else{
            res.send(row);
        }
    })
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


router.post("/view", (req, res) => {
  try {

    const {
      status_pengajuan,
      cari_value,
      data_ke,
      page_limit,
      tipe: tipeFromBody, 
      perusahaan_id,
      bidang_usaha_id,
      bidang_csr_id,
      bidang_sub_csr_id
    } = req.body;


    const viewerId =
      req.user?.id || req.user?._id || req.user?.users_id || null;
    const role =
      (req.user && req.user.profile && req.user.profile.menu_klp) != null
        ? parseInt(req.user.profile.menu_klp)
        : (tipeFromBody != null ? parseInt(tipeFromBody) : 1); // fallback

    let where = "WHERE 1=1";

    if (role === 4 && viewerId) {
      where += ` AND km.perusahaan_id = ${db.escape(viewerId)}`;
    }

 
    if (status_pengajuan !== undefined && status_pengajuan !== null && status_pengajuan !== "") {
      where += ` AND km.status_pengajuan = ${db.escape(parseInt(status_pengajuan))}`;
    }


    if (bidang_usaha_id !== undefined && bidang_usaha_id !== null && bidang_usaha_id !== "") {
      where += ` AND p.bidang_usaha_id = ${db.escape(parseInt(bidang_usaha_id))}`;
    }


    if (perusahaan_id !== undefined && perusahaan_id !== null && perusahaan_id !== "") {
      where += ` AND km.perusahaan_id = ${db.escape(perusahaan_id)}`;
    }


    if (bidang_csr_id) {
      where += ` AND kc.bidang_csr_id = ${db.escape(bidang_csr_id)} `;
    }

 
    if (bidang_sub_csr_id) {
      where += ` AND kc.bidang_sub_csr_id = ${db.escape(bidang_sub_csr_id)} `;
    }



    if (cari_value && String(cari_value).trim() !== "") {
      where += ` AND (kc.nama_csr LIKE ${db.escape('%' + cari_value + '%')}
                  OR p.nama LIKE ${db.escape('%' + cari_value + '%')})`;
    }

   
    const pageFirst = parseInt(data_ke) > 0 ? parseInt(data_ke) : 1;
    const pageLimit = parseInt(page_limit) > 0 ? parseInt(page_limit) : 10;
    const offset = (pageFirst - 1) * pageLimit;

    const baseFrom = `
      FROM kegiatan_mitra km
      LEFT JOIN kegiatan_csr kc ON km.kegiatan_id = kc.id
      LEFT JOIN master_bidang_csr b ON kc.bidang_csr_id = b.id
      LEFT JOIN master_bidang_sub_csr bs ON kc.bidang_sub_csr_id = bs.id
      LEFT JOIN master_kecamatan mkc ON kc.kecamatan_id = mkc.kecamatan_id
      LEFT JOIN master_des_kel md ON kc.desa_id = md.des_kel_id
      LEFT JOIN perusahaan p ON km.perusahaan_id = p.users_id
      LEFT JOIN master_bidang_usaha bu ON p.bidang_usaha_id = bu.id
      LEFT JOIN users u ON p.users_id = u.id
    `;

    const countSql = `
      SELECT COUNT(*) AS total
      ${baseFrom}
      ${where}
    `;

    const dataSql = `
      SELECT 
        km.id,
        km.status_pengajuan,
        km.jumlah_ambil,
        km.catatan_admin,
        km.createdAt AS tgl_pengajuan,

        -- Info Program
        kc.nama_csr AS nama_kegiatan,
        b.uraian AS uraian_bidang_csr,
        bs.uraian AS uraian_bidang_sub_csr,
        kc.jumlah,
        kc.jumlah_sisa,
        kc.satuan,
        kc.nilai,
        kc.tanggal_mulai,
        kc.tanggal_selesai,
        kc.alamat,
        kc.status AS status,
        kc.file_name AS file_name,
        mkc.nama_kecamatan,
        md.nama_des_kel AS nama_desa,

        -- Info Perusahaan
        p.nama AS nama_perusahaan,
        p.bidang_usaha_id,
        bu.uraian AS bidang_perusahaan,
        p.email AS email_perusahaan,
        p.hp AS telp_perusahaan,
        p.alamat AS alamat_perusahaan,

        -- Info Penanggung Jawab
        u.nama AS nama_pj,
        u.jabatan AS jabatan_pj,
        u.email AS email_pj,
        u.hp AS hp_pj,

        -- 🔹 Hitung jumlah eviden
        (SELECT COUNT(*) FROM bukti_dukung bd WHERE bd.kegiatan_mitra_id = km.id) AS jml_eviden
        

      ${baseFrom}
      ${where}
      ORDER BY km.createdAt DESC
      LIMIT ${offset}, ${pageLimit};
    `;


    db.query(countSql, (err, countRows) => {
      if (err) {
        console.error("❌ DB Error (count):", err.sqlMessage);
        return res.status(500).json({ success: false, message: "DB Error", error: err });
      }
      const total = countRows[0]?.total || 0;

      db.query(dataSql, (err2, rows) => {
        if (err2) {
          console.error("❌ DB Error (data):", err2.sqlMessage);
          return res.status(500).json({ success: false, message: "DB Error", error: err2 });
        }

        res.json({ success: true, data: rows, total });
      });
    });

  } catch (error) {
    console.error("❌ Server Error:", error);
    res.status(500).json({ success: false, message: "Server Error", error });
  }
});


router.post('/approvePengajuan', async (req, res) => {
  const { id } = req.body;
  const userId = req.user.id;

  if (!id) return res.json({ success: false, message: "ID pengajuan dibutuhkan" });

  try {
    // 1. Ambil pengajuan
    const [pengajuan] = await new Promise((resolve, reject) => {
      db.query(`SELECT * FROM kegiatan_mitra WHERE id = ?`, [id], (err, rows) => err ? reject(err) : resolve(rows));
    });
    if (!pengajuan) return res.json({ success: false, message: "Pengajuan tidak ditemukan" });

    // 2. Update status pengajuan -> disetujui
    await new Promise((resolve, reject) => {
      db.query(
        `UPDATE kegiatan_mitra SET status_pengajuan = 2, catatan_admin = 'Disetujui oleh admin', editedAt = NOW(), editedBy = ? WHERE id = ?`,
        [userId, id],
        (err, results) => (err ? reject(err) : resolve(results))
      );
    });

    // 3. Ambil program
    const [program] = await new Promise((resolve, reject) => {
      db.query(`SELECT id, nama_csr, jumlah, jumlah_sisa FROM kegiatan_csr WHERE id = ?`, [pengajuan.kegiatan_id], (err, rows) => err ? reject(err) : resolve(rows));
    });
    if (!program) return res.json({ success: false, message: "Program CSR tidak ditemukan" });

    // 4. Hitung jumlah sisa & update program
    const sisaBaru = program.jumlah_sisa - pengajuan.jumlah_ambil;
    let statusProgram;
    if (sisaBaru <= 0) statusProgram = 2;         // Dalam pengerjaan
    else if (sisaBaru < program.jumlah) statusProgram = 3; // Pengerjaan sebagian
    else statusProgram = 1;                        // Program CSR Baru

    await new Promise((resolve, reject) => {
      db.query(
        `UPDATE kegiatan_csr SET jumlah_sisa = ?, status = ? WHERE id = ?`,
        [sisaBaru, statusProgram, pengajuan.kegiatan_id],
        (err, results) => (err ? reject(err) : resolve(results))
      );
    });

    // 5. Ambil data mitra (email)
    const [mitraRows] = await new Promise((resolve, reject) => {
      db.query(`
        SELECT p.email AS email_perusahaan, u.email AS email_pj, p.nama AS nama_perusahaan, u.nama AS nama_pj
        FROM kegiatan_mitra km
        LEFT JOIN perusahaan p ON km.perusahaan_id = p.users_id
        LEFT JOIN users u ON p.users_id = u.id
        WHERE km.id = ?
        LIMIT 1
      `, [id], (e, r) => e ? reject(e) : resolve(r));
    });

    const mitra = mitraRows || {};
    const toEmail = mitra.email_perusahaan || mitra.email_pj || null;

    // 6. Kirim email ke mitra (UI/UX template)
    if (toEmail) {
      const safeNama = escapeHtml(mitra.nama_perusahaan);
      const safeProgram = escapeHtml(program.nama_csr || 'Program CSR');
      const safeJumlah = escapeHtml(String(pengajuan.jumlah_ambil || '-'));
      const safeSisa = escapeHtml(String(sisaBaru));
      const pengajuanId = escapeHtml(id);

      const adminBase = (process.env.ADMIN_URL || 'https://admin-csr.konaweselatankab.go.id').replace(/\/$/, '');
      const adminLink = `${adminBase}/#/list_pengajuan`;
      const adminEmails = process.env.NOTIF_TO || 'csrsetarakonsel@gmail.com';

      const subject = `Pengajuan Anda Disetujui — ${safeProgram}`;

      const htmlApprove = `
      <!doctype html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <title>Pengajuan Disetujui</title>
      </head>
      <body style="font-family:Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; margin:0; color:#222;">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
          <tr>
            <td align="center" style="padding:20px 12px;">
              <table width="640" cellpadding="0" cellspacing="0" role="presentation" style="max-width:640px; border-radius:10px; overflow:hidden; border:1px solid #e9eef5;">
                <tr style="background: #2A9B37; color:#fff;">
                  <td style="padding:18px 20px;">
                    <h1 style="margin:0; font-size:18px; font-weight:700;">Pengajuan Diterima</h1>
                    <p style="margin:6px 0 0; opacity:0.95; font-size:13px;">Pengajuan Anda telah disetujui oleh admin.</p>
                  </td>
                </tr>

                <tr>
                  <td style="padding:18px 20px; background:#ffffff;">
                    <p style="margin:0 0 12px;">Yth. <strong>${safeNama}</strong>,</p>

                    <table style="width:100%; border-collapse:collapse; font-size:14px; color:#333;">
                      <tr><td style="padding:8px 0; width:170px;"><strong>ID Pengajuan</strong></td><td style="padding:8px 0;">${pengajuanId}</td></tr>
                      <tr><td style="padding:8px 0;"><strong>Program</strong></td><td style="padding:8px 0;">${safeProgram}</td></tr>
                      <tr><td style="padding:8px 0;"><strong>Jumlah disetujui</strong></td><td style="padding:8px 0;">${safeJumlah}</td></tr>
                      <tr><td style="padding:8px 0;"><strong>Sisa Kuota</strong></td><td style="padding:8px 0;">${safeSisa}</td></tr>
                      <tr><td style="padding:8px 0;"><strong>Tanggal</strong></td><td style="padding:8px 0;">${escapeHtml(new Date().toLocaleString())}</td></tr>
                    </table>

                    <p style="margin:16px 0 0;">
                      <a href="${adminLink}" style="display:inline-block; padding:10px 14px; background:#2A9B37; color:#fff; text-decoration:none; border-radius:8px; font-weight:600;">Buka Panel Pengajuan</a>
                    </p>

                    <p style="margin:14px 0 0; color:#666; font-size:13px;">
                      Jika Anda butuh konfirmasi lebih lanjut, balas email ini atau hubungi admin di <a href="mailto:${escapeHtml(adminEmails)}">${escapeHtml(adminEmails)}</a>.
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="padding:12px 20px; background:#f8f9fb; font-size:12px; color:#777;">
                  CSR-SETARA — Kabupaten Konawe Selatan
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
      `;

      sendMail({ to: toEmail, subject, html: htmlApprove })
        .then(info => console.log('✅ Email approve sent', info.messageId || info.accepted || info))
        .catch(err => console.error('❌ Email approve failed', err && err.message ? err.message : err));
    } else {
      console.log('approvePengajuan: tidak menemukan email mitra untuk id', id);
    }

    // 7. Response ke client
    res.json({ success: true, message: "Pengajuan berhasil disetujui" });

  } catch (err) {
    console.error("❌ Error approvePengajuan:", err);
    res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
});



router.post('/tolakPengajuan', async (req, res) => {
  try {
    const { id, catatan_admin } = req.body;
    const userId = req.user.id;

    if (!id) return res.json({ success: false, message: "ID pengajuan dibutuhkan" });
    if (!catatan_admin) return res.json({ success: false, message: "Catatan admin harus diisi" });

    // 1) Update status pengajuan -> ditolak
    const query = `
      UPDATE kegiatan_mitra
      SET status_pengajuan = 3,
          catatan_admin = ?,
          editedAt = NOW(),
          editedBy = ?
      WHERE id = ?
    `;

    const result = await new Promise((resolve, reject) => {
      db.query(query, [catatan_admin, userId, id], (err, result) => (err ? reject(err) : resolve(result)));
    });

    if (!result || result.affectedRows === 0) {
      return res.json({ success: false, message: "Pengajuan tidak ditemukan" });
    }

    // 2) Ambil data mitra & program singkat untuk isi email
    const rows = await new Promise((resolve, reject) => {
      db.query(`
        SELECT km.id AS pengajuan_id,
               p.email AS email_perusahaan,
               u.email AS email_pj,
               p.nama AS nama_perusahaan,
               u.nama AS nama_pj,
               kc.nama_csr
        FROM kegiatan_mitra km
        LEFT JOIN perusahaan p ON km.perusahaan_id = p.users_id
        LEFT JOIN users u ON p.users_id = u.id
        LEFT JOIN kegiatan_csr kc ON km.kegiatan_id = kc.id
        WHERE km.id = ?
        LIMIT 1
      `, [id], (err2, rows2) => (err2 ? reject(err2) : resolve(rows2)));
    });

    const info = rows && rows[0] ? rows[0] : null;
    const toEmail = info ? (info.email_perusahaan || info.email_pj) : null;

    if (toEmail) {
      // sanitize values
      const safeNama = escapeHtml(info.nama_perusahaan);
      const safeProgram = escapeHtml(info.nama_csr || 'Program CSR');
      const safeCatatan = escapeHtml(catatan_admin || '-');
      const pengajuanId = escapeHtml(id);

      const adminBase = (process.env.ADMIN_URL || 'https://admin-csr.konaweselatankab.go.id').replace(/\/$/, '');
      const adminLink = `${adminBase}/#/list_pengajuan`;
      const adminEmails = process.env.NOTIF_TO || 'csrsetarakonsel@gmail.com';

      const subject = `Pengajuan Anda Ditolak — ${safeProgram}`;

      // UI/UX HTML template (Reject)
      const htmlReject = `
<!doctype html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Pengajuan Ditolak</title></head>
<body style="font-family:Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial; margin:0; color:#222;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding:20px;">
      <table style="max-width:640px; width:100%; border:1px solid #eee; border-radius:10px; overflow:hidden;">
        <tr style="background: linear-gradient(90deg,#e53935,#d32f2f); color:#fff;">
          <td style="padding:16px 20px;">
            <h2 style="margin:0; font-size:16px; color:#fff;">Pengajuan Ditolak</h2>
            <p style="margin:6px 0 0; color:#fff; font-size:13px;">Mohon periksa catatan penolakan untuk tindak lanjut.</p>
          </td>
        </tr>

        <tr>
          <td style="padding:18px 20px; background:#fff;">
            <p style="margin:0 0 12px;">Yth. <strong>${safeNama}</strong>,</p>

            <table style="width:100%; font-size:14px; color:#333;">
              <tr><td style="padding:8px 0; width:170px;"><strong>ID Pengajuan</strong></td><td style="padding:8px 0;">${pengajuanId}</td></tr>
              <tr><td style="padding:8px 0;"><strong>Program</strong></td><td style="padding:8px 0;">${safeProgram}</td></tr>
              <tr><td style="padding:8px 0;"><strong>Catatan Admin</strong></td><td style="padding:8px 0; color:#d32f2f;">${safeCatatan}</td></tr>
              <tr><td style="padding:8px 0;"><strong>Tanggal</strong></td><td style="padding:8px 0;">${escapeHtml(new Date().toLocaleString())}</td></tr>
            </table>

            <p style="margin:18px 0 0;">
              <a href="${adminLink}" style="display:inline-block; padding:10px 14px; background:#e53935; color:#fff; text-decoration:none; border-radius:8px;">Cek Detail Pengajuan</a>
            </p>

            <p style="margin:14px 0 0; font-size:13px; color:#666;">
              Jika Anda merasa penolakan kurang jelas, balas email ini untuk klarifikasi atau hubungi admin di <a href="mailto:${escapeHtml(adminEmails)}">${escapeHtml(adminEmails)}</a>.
            </p>
          </td>
        </tr>

        <tr><td style="padding:12px 20px; background:#fafafa; font-size:12px; color:#777;">CSR-SETARA — Kabupaten Konawe Selatan</td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
      `;

      // kirim email non-blocking (log hasil)
      sendMail({ to: toEmail, subject, html: htmlReject })
        .then(infoMail => console.log('✅ Email tolak to mitra sent', infoMail.messageId || infoMail.accepted || infoMail))
        .catch(errMail => console.error('❌ tolakPengajuan: gagal kirim email', errMail && errMail.message ? errMail.message : errMail));
    } else {
      console.log('tolakPengajuan: tidak menemukan email mitra untuk id', id);
    }

    // response sukses
    return res.json({ success: true, message: "Pengajuan berhasil ditolak" });

  } catch (err) {
    console.error("❌ Server Error tolakPengajuan:", err);
    return res.status(500).json({ success: false, message: "Server Error", error: err });
  }
});


// REPLACE existing router.post("/uploadEviden", upload.single("file"), (req, res) => { ... })
router.post("/uploadEviden", upload.single("file"), async (req, res) => {
  try {
    const { id, keterangan } = req.body;
    const file = req.file;

    if (!file) {
      return res.json({ success: false, message: "File tidak ditemukan" });
    }

    // 1) simpan bukti dukung
    const insertSql = `
      INSERT INTO bukti_dukung (kegiatan_mitra_id, file_name, keterangan, createdAt)
      VALUES (?, ?, ?, NOW())
    `;
    db.query(insertSql, [id, file.filename, keterangan], async (err, result) => {
      if (err) {
        console.error("❌ DB Error (insert bukti_dukung):", err);
        return res.status(500).json({ success: false, message: "DB error" });
      }

      // --- kirim notifikasi email (non-blocking)
      (async () => {
        try {
          // Ambil info pengajuan, mitra, dan program singkat
          const infoRows = await new Promise((resolve, reject) => {
            db.query(`
              SELECT km.id AS pengajuan_id, km.kegiatan_id, 
                     p.email AS email_perusahaan, u.email AS email_pj,
                     p.nama AS nama_perusahaan, u.nama AS nama_pj,
                     kc.nama_csr
              FROM kegiatan_mitra km
              LEFT JOIN perusahaan p ON km.perusahaan_id = p.users_id
              LEFT JOIN users u ON p.users_id = u.id
              LEFT JOIN kegiatan_csr kc ON km.kegiatan_id = kc.id
              WHERE km.id = ?
              LIMIT 1
            `, [id], (e, r) => e ? reject(e) : resolve(r));
          });

          const info = infoRows && infoRows[0] ? infoRows[0] : null;
          const adminEmails = process.env.NOTIF_TO || 'csrsetarakonsel@gmail.com';
          const mitraEmail = info ? (info.email_perusahaan || info.email_pj) : null;
          const namaMitra = info ? (info.nama_perusahaan || info.nama_pj || 'Mitra') : 'Mitra';
          const namaProgram = info ? (info.nama_csr || 'Program CSR') : 'Program CSR';
          const pengajuanIdSafe = escapeHtml(String(id));

          // Email ke admin — tampilkan info mitra + file, replyTo di-set ke email mitra (jika ada)
          const subjectAdmin = `[CSR-SETARA - BUKTI DUKUNG - EVIDEN] Bukti Dukung Baru — ${escapeHtml(namaProgram)} — ID ${pengajuanIdSafe}`;
          const adminLink = (process.env.ADMIN_URL || 'http://localhost:3000').replace(/\/$/, '') + '/#/list_pengajuan';
          const safeKeterangan = escapeHtml(keterangan || '-');

          const htmlAdmin = `
            <!doctype html>
            <html><body style="font-family: Arial, Helvetica, sans-serif; color:#222; margin:0;">
              <table width="100%" cellpadding="0"><tr><td align="center" style="padding:20px;">
                <table style="max-width:640px;border:1px solid #eee;border-radius:8px;overflow:hidden;">
                  <tr style="background:#0d6efd;color:#fff;"><td style="padding:14px 18px;">
                    <h3 style="margin:0;">Bukti Dukung Diupload</h3>
                    <p style="margin:4px 0 0;">Pengajuan ID ${pengajuanIdSafe} mengunggah bukti dukung.</p>
                  </td></tr>
                  <tr><td style="padding:16px;">
                    <p style="margin:0 0 8px;">Yth. Admin,</p>
                    <table style="width:100%;font-size:14px;color:#333;">
                      <tr><td style="width:160px;padding:6px 0;"><strong>ID Pengajuan</strong></td><td style="padding:6px 0;">${pengajuanIdSafe}</td></tr>
                      <tr><td style="padding:6px 0;"><strong>Program</strong></td><td style="padding:6px 0;">${escapeHtml(namaProgram)}</td></tr>
                      <tr><td style="padding:6px 0;"><strong>Pengunggah</strong></td><td style="padding:6px 0;">${escapeHtml(namaMitra)}</td></tr>
                      <tr><td style="padding:6px 0;"><strong>Email Pengunggah</strong></td><td style="padding:6px 0;">${mitraEmail ? `<a href="mailto:${escapeHtml(mitraEmail)}">${escapeHtml(mitraEmail)}</a>` : '-'}</td></tr>
                      <tr><td style="padding:6px 0;"><strong>Nama File</strong></td><td style="padding:6px 0;">${escapeHtml(file.filename)}</td></tr>
                      <tr><td style="padding:6px 0;"><strong>Keterangan</strong></td><td style="padding:6px 0;">${safeKeterangan}</td></tr>
                    </table>
                    <p style="margin:14px 0;"><a href="${adminLink}" style="display:inline-block;padding:10px 14px;background:#0d6efd;color:#fff;text-decoration:none;border-radius:6px;">Buka Panel Pengajuan</a></p>
                    <p style="margin:10px 0 0;font-size:12px;color:#666;">Reply ke email ini akan dikirim ke pengunggah jika tersedia.</p>
                  </td></tr>
                </table>
              </td></tr></table>
            </body></html>
          `;

          // kirim ke admin, set replyTo ke mitra jika ada (agar balasan menuju mitra)
          sendMail({ to: adminEmails, subject: subjectAdmin, html: htmlAdmin, replyTo: mitraEmail || undefined })
            .then(infoMail => console.log('✅ Notif bukti ke admin terkirim:', infoMail && (infoMail.messageId || infoMail.accepted) ))
            .catch(errMail => console.error('❌ Gagal kirim notif bukti ke admin:', errMail && errMail.message ? errMail.message : errMail));

          // Email konfirmasi ke mitra (opsional)
          if (mitraEmail) {
            const subjectMitra = `Bukti Dukung Diterima — ${escapeHtml(namaProgram)}`;
            const htmlMitra = `
              <!doctype html><html><body style="font-family:Arial;color:#222;margin:0;">
                <table width="100%"><tr><td align="center" style="padding:20px;">
                  <table style="max-width:640px;border:1px solid #eee;border-radius:8px;overflow:hidden;">
                    <tr style="background:#2A9B37;color:#fff;"><td style="padding:12px 18px;"><h3 style="margin:0;">Terima kasih — Bukti Dukung Diterima</h3></td></tr>
                    <tr><td style="padding:16px;">
                      <p>Yth. <strong>${escapeHtml(namaMitra)}</strong>,</p>
                      <p>Kami telah menerima bukti dukung untuk pengajuan ID <strong>${pengajuanIdSafe}</strong>.</p>
                      <ul>
                        <li>Nama file: ${escapeHtml(file.filename)}</li>
                        <li>Keterangan: ${safeKeterangan}</li>
                      </ul>
                      <p style="margin-top:12px;">Admin akan memeriksa bukti tersebut. Terima kasih.</p>
                    </td></tr>
                  </table>
                </td></tr></table>
              </body></html>
            `;
            sendMail({ to: mitraEmail, subject: subjectMitra, html: htmlMitra })
              .then(i => console.log('✅ Konfirmasi bukti ke mitra dikirim'))
              .catch(e => console.error('❌ Gagal kirim konfirmasi bukti ke mitra:', e && e.message ? e.message : e));
          }

        } catch (notifyErr) {
          console.error('❌ Error saat membuat/kirim email notif bukti:', notifyErr && notifyErr.message ? notifyErr.message : notifyErr);
        }
      })();

      // 2) response success ke client upload
      return res.json({
        success: true,
        message: "Upload berhasil",
        data: {
          kegiatan_mitra_id: id,
          file_name: file.filename,
          keterangan,
        }
      });

    });
  } catch (err) {
    console.error("❌ ERROR Upload:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// ================== GET ==================
router.get('/getEviden', (req, res) => {
  const { id } = req.query
  if (!id) return res.status(400).json({ success: false, message: "id tidak boleh kosong" })

  const sql = `SELECT * FROM bukti_dukung WHERE kegiatan_mitra_id = ? ORDER BY createdAt DESC`
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("❌ DB Error:", err)
      return res.status(500).json({ success: false, message: "DB Error" })
    }
    res.json(results)
  })
})

router.post("/removeEviden", (req, res) => {
  const { id } = req.body;
  if (!id) return res.json({ success: false, message: "id tidak boleh kosong" });

  // cari dulu data file
  const sqlSelect = "SELECT file_name FROM bukti_dukung WHERE id = ?";
  db.query(sqlSelect, [id], (err, results) => {
    if (err) return res.json({ success: false, message: "DB Error" });
    if (results.length === 0) return res.json({ success: false, message: "Data tidak ditemukan" });

    const filePath = path.join(__dirname, "../../uploads", results[0].file_name);

    // hapus file kalau ada
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }


    const sqlDelete = "DELETE FROM bukti_dukung WHERE id = ?";
    db.query(sqlDelete, [id], (err2) => {
      if (err2) return res.json({ success: false, message: "Gagal hapus data" });
      res.json({ success: true });
    });
  });
});

router.get('/lihatEviden/:id', async (req, res) => {
  const id = req.params.id;
  try {
      const [rows] = await db.query(
          `SELECT file_name, keterangan, createdAt FROM bukti_dukung WHERE kegiatan_mitra_id = ?`,
          [id]
      );
      res.json({ success: true, data: rows });
  } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});
router.post("/selesaikanProgram", (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ success: false, message: "id tidak boleh kosong" });

  // update status program (status = 4 = selesai)
  const sql = `
    UPDATE kegiatan_csr kc
    JOIN kegiatan_mitra km ON kc.id = km.kegiatan_id
    SET kc.status = 4
    WHERE km.id = ?
  `;

  db.query(sql, [id], async (err, result) => {
    if (err) {
      console.error("❌ DB Error (update status):", err);
      return res.status(500).json({ success: false, message: "DB Error" });
    }

    console.log('✅ Status program diupdate ke selesai');

    try {
      // Ambil semua mitra yang terkait program ini
      const rows = await new Promise((resolve, reject) => {
        db.query(`
          SELECT kc.id AS kegiatan_id, kc.nama_csr,
                 km.id AS pengajuan_id,
                 p.email AS email_perusahaan, u.email AS email_pj,
                 p.nama AS nama_perusahaan, u.nama AS nama_pj
          FROM kegiatan_mitra km
          LEFT JOIN kegiatan_csr kc ON km.kegiatan_id = kc.id
          LEFT JOIN perusahaan p ON km.perusahaan_id = p.users_id
          LEFT JOIN users u ON p.users_id = u.id
          WHERE kc.id = (
            SELECT kegiatan_id FROM kegiatan_mitra WHERE id = ?
          )
        `, [id], (e, r) => e ? reject(e) : resolve(r));
      });

      if (!rows || rows.length === 0) {
        console.warn('⚠️ Tidak ada mitra ditemukan untuk pengajuan id', id);
        return res.json({ success: true, message: "Program berhasil diselesaikan (tidak ada mitra terkait)" });
      }

      const namaProgram = rows[0].nama_csr || "Program CSR";
      const adminLink = (process.env.ADMIN_URL || 'http://localhost:3000').replace(/\/$/, '') + '/#/list_pengajuan';

      // Kirim email ke semua mitra yang punya alamat email
      for (const mitra of rows) {
        const mitraEmail = mitra.email_perusahaan || mitra.email_pj;
        if (!mitraEmail) {
          console.warn(`⚠️ Mitra ${mitra.nama_perusahaan || mitra.nama_pj} tidak punya email`);
          continue;
        }

        const namaMitra = mitra.nama_perusahaan || mitra.nama_pj || "Mitra";
        const pengajuanIdSafe = String(mitra.pengajuan_id);

        const subject = `Program Selesai — ${namaProgram}`;
        const html = `
          <!doctype html><html><body style="font-family:Arial;color:#222;margin:0;">
            <table width="100%"><tr><td align="center" style="padding:20px;">
              <table style="max-width:640px;border:1px solid #eee;border-radius:8px;overflow:hidden;">
                <tr style="background:#2A9B37;color:#fff;"><td style="padding:12px 18px;">
                  <h3 style="margin:0;">Program Telah Diselesaikan</h3>
                  <p style="margin:4px 0 0;">Terima kasih atas kerjasama Anda.</p>
                </td></tr>
                <tr><td style="padding:16px;">
                  <p>Yth. <strong>${escapeHtml(namaMitra)}</strong>,</p>
                  <p>Kami informasikan bahwa program <strong>${escapeHtml(namaProgram)}</strong> (Pengajuan ID: ${escapeHtml(pengajuanIdSafe)}) telah ditandai <strong>SELESAI</strong> oleh admin.</p>
                  <p>Terima kasih atas kontribusi Anda. Jika ada pertanyaan, silakan balas email ini atau buka panel admin.</p>
                  <p style="margin-top:12px;"><a href="${adminLink}" style="display:inline-block;padding:10px 14px;background:#2A9B37;color:#fff;text-decoration:none;border-radius:6px;">Buka Panel Pengajuan</a></p>
                </td></tr>
                <tr><td style="padding:10px 18px;background:#fafafa;font-size:12px;color:#777;">CSR-SETARA — Kabupaten Konawe Selatan</td></tr>
              </table>
            </td></tr></table>
          </body></html>
        `;

        try {
          await sendMail({ to: mitraEmail, subject, html });
          console.log(`✅ Email selesai program terkirim ke: ${mitraEmail}`);
        } catch (mailErr) {
          console.error(`❌ Gagal kirim email ke ${mitraEmail}:`, mailErr.message || mailErr);
        }
      }

      return res.json({ success: true, message: `Program berhasil diselesaikan, email dikirim ke ${rows.length} mitra` });

    } catch (notifErr) {
      console.error('❌ Error saat kirim notifikasi:', notifErr.message || notifErr);
      return res.json({ success: true, message: "Program berhasil diselesaikan (notifikasi gagal)" });
    }
  });
});



module.exports = router;