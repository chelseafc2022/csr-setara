const express = require('express');
const router = express.Router();
const db = require('../../db/MySql/umum');  
const upload = require('../../db/multer/pdf'); 
const { sendMail, escapeHtml } = require('../library/mailer'); 


router.post("/", upload.single('dokumen'), async (req, res) => {
  try {
    const {
      nama,  // PIC: nama
      jabatan,  // PIC: jabatan
      pic_email,  // PIC: email
      pic_hp,  // PIC: hp
      perusahaan_nama,  // Perusahaan: nama
      bidang_usaha_id,
      perusahaan_email,
      perusahaan_hp,
      alamat
    } = req.body;

    const dokumenFile = req.file; 

    if (!dokumenFile) {
      return res.status(400).json({ success: false, message: "Dokumen wajib diupload!" });
    }

    if (!nama || !jabatan || !pic_email || !pic_hp) {
      return res.status(400).json({ success: false, message: "Data PIC (nama, jabatan, email, HP) wajib diisi!" });
    }

    const fileName = dokumenFile.filename;

    const insertUserSql = `
      INSERT INTO db_csrkonsel.users (username, password, nama, jabatan, email, hp, db_csrkonsel)
      VALUES ( NULL, NULL, ?, ?, ?, ?, ?)
    `;
    db.query(insertUserSql, [nama, jabatan, pic_email, pic_hp, 4], (errUser, userResult) => {
      if (errUser) {
        console.error("Error insert user:", errUser);
        return res.status(500).json({ success: false, error: "Gagal buat akun PIC: " + errUser.message });
      }

      const newUserId = userResult.insertId;

      const sqlPending = `
        INSERT INTO perusahaan 
        (users_id, nama, bidang_usaha_id, email, hp, alamat, file_name, status, catatan_admin, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', 'Menunggu Verifikasi Admin', NOW())
      `;
      const params = [
        newUserId,
        perusahaan_nama,
        bidang_usaha_id,
        perusahaan_email,
        perusahaan_hp,
        alamat,
        fileName
      ];

      db.query(sqlPending, params, (err, result) => {
        if (err) {
          console.error("Error inserting perusahaan: ", err);
        
          db.query("DELETE FROM db_csrkonsel.users WHERE id = ?", [newUserId], () => {});
          return res.status(500).json({ success: false, error: "Gagal menyimpan data perusahaan: " + err.message });
        }

        const newPerusahaanId = result.insertId;
        console.log("Data berhasil disimpan, ID perusahaan:", newPerusahaanId);


        (async () => {
          try {
      
            const adminEmails = await new Promise((resolve, reject) => {
              const sqlAdmins = `SELECT email FROM egov.users WHERE db_csrkonsel = 5 AND email IS NOT NULL AND email <> ''`;
              db.query(sqlAdmins, (errA, rowsA) => {
                if (errA) return reject(errA);
                const emails = (rowsA || []).map(r => r.email).filter(Boolean);
                resolve(emails);
              });
            });

            if (!adminEmails || adminEmails.length === 0) {
              const fallback = process.env.NOTIF_TO || 'csrsetarakonsel@gmail.com';
              console.warn('notify: adminEmails kosong, pakai fallback:', fallback);
              adminEmails.push(fallback);
            }

            const pengajuanIdSafe = escapeHtml(String(newPerusahaanId || '—'));
            const namaPerusahaanSafe = escapeHtml(perusahaan_nama || 'Perusahaan');
            const mitraEmailSafe = escapeHtml(perusahaan_email || pic_email || '-');

            const adminBase = (process.env.ADMIN_URL || process.env.FRONTEND_URL || 'https://admin-csr.konaweselatankab.go.id').replace(/\/$/, '');
            const reviewLink = `${adminBase}/#/regisMitra`; 

            const subjectAdmin = `[CSR-SETARA] Pengajuan Registrasi Baru — ID ${pengajuanIdSafe}`;
            const htmlAdmin = `
              <!doctype html><html><body style="font-family: Inter, Arial, sans-serif; color:#222;">
                <table width="100%"><tr><td align="center" style="padding:20px;">
                  <table style="max-width:640px;border:1px solid #eee;border-radius:8px;overflow:hidden;">
                    <tr style="background:#0d6efd;color:#fff;"><td style="padding:14px 18px;">
                      <h3 style="margin:0;">Pengajuan Registrasi Baru</h3>
                      <p style="margin:4px 0 0;">Ada pengajuan registrasi baru, mohon verifikasi.</p>
                    </td></tr>
                    <tr><td style="padding:16px;">
                      <p>Yth. Admin,</p>
                      <table style="width:100%;font-size:14px;color:#333;">
                        <tr><td style="width:160px;padding:6px 0;"><strong>ID Pengajuan</strong></td><td style="padding:6px 0;">${pengajuanIdSafe}</td></tr>
                        <tr><td style="padding:6px 0;"><strong>Nama Perusahaan</strong></td><td style="padding:6px 0;">${namaPerusahaanSafe}</td></tr>
                        <tr><td style="padding:6px 0;"><strong>Email Pengajuan</strong></td><td style="padding:6px 0;">${mitraEmailSafe}</td></tr>
                      </table>
                      <p style="margin:16px 0;">
                        <a href="${reviewLink}" style="display:inline-block;padding:8px 12px;background:#2A9B37;color:#fff;text-decoration:none;border-radius:6px;">Buka Panel Registrasi</a>
                      </p>
                      <p style="font-size:12px;color:#666;margin-top:8px;">Email otomatis — tidak perlu membalas.</p>
                    </td></tr>
                    <tr><td style="padding:10px 18px;background:#fafafa;font-size:12px;color:#777;">CSR-SETARA — Kabupaten Konawe Selatan</td></tr>
                  </table>
                </td></tr></table>
              </body></html>
            `;

            await sendMail({ to: adminEmails, subject: subjectAdmin, html: htmlAdmin, replyTo: (pic_email || perusahaan_email) || undefined });
            console.log('✅ Notifikasi registrasi terkirim ke admin:', adminEmails.join(', '));
          } catch (notifyErr) {
            console.error('❌ Gagal kirim notifikasi registrasi ke admin:', notifyErr && notifyErr.message ? notifyErr.message : notifyErr);
          }
        })();
        res.json({ success: true, message: "Permohonan diterima dan akan diverifikasi.", id: newPerusahaanId });
      });
    });

  } catch (error) {
    console.error("🔥 Error registrasi:", error);
    res.status(500).json({ success: false, error: "Terjadi kesalahan server: " + error.message });
  }
});


module.exports = router;