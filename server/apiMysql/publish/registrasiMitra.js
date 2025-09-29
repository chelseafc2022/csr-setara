const express = require('express');
const router = express.Router();
const db = require('../../db/MySql/umum');
const bcrypt = require('bcryptjs');  

router.post("/", async (req, res) => {
  try {
    const {
      username,
      password,
      nama,        
      jabatan,
      pic_email,
      pic_hp,
      perusahaan_nama,
      bidang_usaha_id,
      perusahaan_email,
      perusahaan_hp,
      alamat
    } = req.body;

    // console.log("📥 Data diterima:", req.body); 

  
    const hashedPassword = await bcrypt.hash(password.trim(), 12);


    const sqlUser = `
      INSERT INTO users (username, password, email, hp, nama, jabatan, db_csrkonsel, createdAt)
      VALUES (?, ?, ?, ?, ?, ?,?, NOW())
    `;

    db.query(
      sqlUser,
      [username, hashedPassword, pic_email, pic_hp, nama, jabatan, 4],
      (err, resultUser) => {
        if (err) {
          console.error("❌ Insert user error:", err);
          return res.status(500).json({ success: false, error: err.message });
        }

        const users_id = resultUser.insertId;

 
        const sqlPerusahaan = `
          INSERT INTO perusahaan (users_id, nama, bidang_usaha_id, email, hp, alamat)
          VALUES (?, ?, ?, ?, ?, ?)
        `;
        db.query(
          sqlPerusahaan,
          [users_id, perusahaan_nama, bidang_usaha_id, perusahaan_email, perusahaan_hp, alamat],
          (err2, resultPerusahaan) => {
            if (err2) {
              console.error("❌ Insert perusahaan error:", err2);
              return res.status(500).json({ success: false, error: err2.message });
            }

            res.json({
              success: true,
              message: "Registrasi berhasil 🎉",
              users_id,
              perusahaan_id: resultPerusahaan.insertId,
            });
          }
        );
      }
    );

  } catch (error) {
    console.error("🔥 Error registrasi:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
