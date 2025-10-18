const express = require('express');
const router = express.Router();
const db = require('../../db/MySql/umum');  // Pastikan koneksi database benar
const upload = require('../../db/multer/pdf');  // Impor Multer (pastikan path benar)

function generateId() {
  return 'usr_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 10);
}


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

    const dokumenFile = req.file;  // File dokumen yang diupload

    // Validasi: Pastikan file diupload
    if (!dokumenFile) {
      return res.status(400).json({ success: false, message: "Dokumen wajib diupload!" });
    }

    // Validasi tambahan: Pastikan data PIC lengkap
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

      // Simpan perusahaan dengan users_id yang baru dibuat
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
          // Jika gagal simpan perusahaan, hapus user yang sudah dibuat (rollback sederhana)
          db.query("DELETE FROM db_csrkonsel.users WHERE id = ?", [newUserId], () => {});
          return res.status(500).json({ success: false, error: "Gagal menyimpan data perusahaan: " + err.message });
        }
        console.log("Data berhasil disimpan, ID perusahaan:", result.insertId);
        res.json({ success: true, message: "Permohonan diterima dan akan diverifikasi.", id: result.insertId });
      });
    });

  } catch (error) {
    console.error("🔥 Error registrasi:", error);
    res.status(500).json({ success: false, error: "Terjadi kesalahan server: " + error.message });
  }
});

// ... kode asli Anda tetap sama di bawah ...

module.exports = router;