const express = require('express');
var db = require('../../../../db/MySql/umum');
const crypto = require('crypto');
const bcrypt = require('bcryptjs'); 
const { sendMail, escapeHtml } = require('../../../library/mailer'); 


const fs = require('fs');

var multer = require("multer");

var uniqid = require('uniqid');
const { log } = require('console');
const router = express.Router();

router.post('/view', (req, res) => {
  let data_batas = parseInt(req.body.page_limit) || 10;
  let data_ke = parseInt(req.body.data_ke) || 1;
  let data_star = (data_ke - 1) * data_batas;
  let cari = req.body.cari_value || "";
  let bidang = req.body.master_bidang_usaha || ""; 

  let where = "WHERE p.nama LIKE ?";
  let params = [`%${cari}%`];

  if (bidang) {
    where += " AND p.bidang_usaha_id = ?";
    params.push(bidang);
  }

  let jml_data = `
      SELECT COUNT(*) as total
      FROM db_csrkonsel.perusahaan p
      ${where}
    `;

  let view = `
      SELECT p.id, p.users_id, p.nama, p.email, p.hp, p.alamat, 
             m.uraian as bidang_usaha
      FROM db_csrkonsel.perusahaan p
      LEFT JOIN db_csrkonsel.master_bidang_usaha m 
             ON p.bidang_usaha_id = m.id
      ${where}
      ORDER BY p.nama ASC
      LIMIT ?, ?
    `;

  db.query(jml_data, params, (err, row) => {
    if (err) return res.json(err);

    let total = row[0].total;
    let halaman = Math.ceil(total / data_batas);
    if (halaman < 1) halaman = 1;

    db.query(view, [...params, data_star, data_batas], (err, result) => {
      if (err) return res.json(err);

      res.json({
        data: result,
        jml_data: halaman,
        total_data: total
      });
    });
  });
});


router.post('/viewBidang', (req, res) => {
  let sql = `
      SELECT id, uraian 
      FROM db_csrkonsel.master_bidang_usaha 
      ORDER BY uraian ASC
    `;

  db.query(sql, (err, result) => {
    if (err) {
      return res.json({ error: err });
    }
    res.json({ data: result });
  });
});



router.post('/viewPIC', (req, res) => {
  const { users_id } = req.body;

  const sql = `
      SELECT id, username, email, hp, nama, jabatan, foto, createdAt
      FROM db_csrkonsel.users
      WHERE id = ?
      LIMIT 1
    `;

  db.query(sql, [users_id], (err, result) => {
    if (err) {
      console.error("Error ambil PIC:", err);
      return res.status(500).json({ success: false, message: "Gagal ambil data PIC", error: err });
    }
    if (result.length === 0) {
      return res.json({ success: false, message: "PIC tidak ditemukan" });
    }
    return res.json({ success: true, data: result[0] });
  });
});

router.post('/addData', (req, res) => {
  const id = uniqid();
  const data = req.body;

  const insert = `
      INSERT INTO perusahaan 
      (id, nama, bidang_usaha_id, email, hp, alamat)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

  db.query(insert, [id, data.nama, data.bidang_usaha_id, data.email, data.hp, data.alamat], (err, row) => {
    if (err) {
      console.log('error saat insert perusahaan:', err);
      return res.status(500).send(err);
    } else {
      console.log('insert sukses:', row);
      return res.send({
        success: true,
        message: 'Data perusahaan berhasil ditambahkan',
        id: id
      });
    }
  });
});



router.post('/editData', (req, res) => {
  var data = req.body

  query = `

    UPDATE master_bidang_csr SET

    uraian = '`+ data.uraian + `'

    WHERE id = '`+ data.id + `'
    `;

  db.query(query, (err, row) => {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      res.send(row);
    }
  })

})
router.post('/addSubid', (req, res) => {
  var id = uniqid();
  var data = req.body.form;

  let insert = `
        INSERT INTO master_bidang_sub_csr (id, uraian, master_bidang_csr_id)
        VALUES (?, ?, ?)
    `;

  db.query(insert, [id, data.uraian, data.master_bidang_csr_id], (err, row) => {
    if (err) {
      console.log('❌ Error Insert Subid:', err);
      return res.status(500).send(err);
    } else {
      console.log('✅ Insert Success:', row);
      res.send(row);
    }
  });
});



router.post('/editSubid', (req, res) => {
  var data = req.body

  query = `

    UPDATE master_bidang_sub_csr SET

    uraian = '`+ data.uraian + `'
    WHERE id = '`+ data.id + `'
    `;

  db.query(query, (err, row) => {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      res.send(row);
    }
  })

})

router.post('/removeSubid', (req, res) => {
  var query = `
        DELETE FROM master_bidang_sub_csr WHERE id = '`+ req.body.id + `';
    `;
  db.query(query, (err, row) => {
    if (err) {
      res.send(err);
    } else {
      res.send(row);
    }
  });
})

router.post('/removeData', (req, res) => {
  const sql = `DELETE FROM berita WHERE id = ?`;
  db.query(sql, [req.body.id], (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});


router.post('/viewForce', (req, res) => {
  let data_batas = parseInt(req.body.page_limit) || 10;
  let data_ke = parseInt(req.body.data_ke) || 1;       
  let data_star = (data_ke - 1) * data_batas;
  let cari = req.body.cari_value || "";

  let jml_data = `
        SELECT COUNT(*) as total
        FROM db_csrkonsel.master_force_majeure
        WHERE uraian LIKE ?
        `;


  let view = `
        SELECT *
        FROM db_csrkonsel.master_force_majeure
        WHERE uraian LIKE ?
        ORDER BY uraian ASC
        LIMIT ?, ?
        `;


  db.query(jml_data, [`%${cari}%`], (err, row) => {
    if (err) {
      return res.json(err);
    }

    let total = row[0].total;
    let halaman = Math.ceil(total / data_batas);
    if (halaman < 1) halaman = 1;


    db.query(view, [`%${cari}%`, data_star, data_batas], (err, result) => {
      if (err) {
        return res.json(err);
      }
      res.json({
        data: result,
        jml_data: halaman,
        total_data: total
      });
    });
  });
});


router.post('/addDataForce', (req, res) => {

  var id = uniqid()
  var data = req.body



  let insert = `INSERT INTO master_force_majeure (id, uraian)
    VALUES (
        '`+ id + `',
        '`+ data.uraian + `'

        )
    `

  db.query(insert, (err, row) => {
    if (err) {
      console.log('errrrooorrr');
      console.log(err);
      res.send(err);
    } else {
      console.log(row);
      res.send(row);
    }
  })

});

router.post('/editDataForce', (req, res) => {
  var data = req.body

  query = `

    UPDATE master_force_majeure SET

    uraian = '`+ data.uraian + `'

    WHERE id = '`+ data.id + `'
    `;

  db.query(query, (err, row) => {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      res.send(row);
    }
  })

})


router.post('/removeDataForce', (req, res) => {

  var query = `
        DELETE FROM master_force_majeure WHERE id = '`+ req.body.id + `';
    `;
  db.query(query, (err, row) => {
    if (err) {
      res.send(err);
    } else {
      res.send(row);
    }
  });
})




router.post('/viewUsaha', (req, res) => {
 
  let data_batas = parseInt(req.body.page_limit) || 10; // default 10
  let data_ke = parseInt(req.body.data_ke) || 1;        // default halaman 1
  let data_star = (data_ke - 1) * data_batas;
  let cari = req.body.cari_value || "";

  let jml_data = `
        SELECT COUNT(*) as total
        FROM db_csrkonsel.master_bidang_usaha
        WHERE uraian LIKE ?
        `;

  let view = `
        SELECT *
        FROM db_csrkonsel.master_bidang_usaha
        WHERE uraian LIKE ?
        ORDER BY uraian ASC
        LIMIT ?, ?
        `;

  db.query(jml_data, [`%${cari}%`], (err, row) => {
    if (err) {
      return res.json(err);
    }

    let total = row[0].total;
    let halaman = Math.ceil(total / data_batas);
    if (halaman < 1) halaman = 1;

    db.query(view, [`%${cari}%`, data_star, data_batas], (err, result) => {
      if (err) {
        return res.json(err);
      }
      res.json({
        data: result,
        jml_data: halaman,
        total_data: total
      });
    });
  });
});


router.post('/addDataUsaha', (req, res) => {

  var id = uniqid()
  var data = req.body



  let insert = `INSERT INTO master_bidang_usaha (id, uraian)
    VALUES (
        '`+ id + `',
        '`+ data.uraian + `'

        )
    `

  db.query(insert, (err, row) => {
    if (err) {
      console.log('errrrooorrr');
      console.log(err);
      res.send(err);
    } else {
      console.log(row);
      res.send(row);
    }
  })

});

router.post('/editDataUsaha', (req, res) => {
  var data = req.body

  query = `

    UPDATE master_bidang_usaha SET

    uraian = '`+ data.uraian + `'

    WHERE id = '`+ data.id + `'
    `;

  db.query(query, (err, row) => {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      res.send(row);
    }
  })

})


router.post('/removeDataUsaha', (req, res) => {
  var query = `
        DELETE FROM master_bidang_usaha WHERE id = '`+ req.body.id + `';
    `;
  db.query(query, (err, row) => {
    if (err) {
      res.send(err);
    } else {
      res.send(row);
    }
  });
})


router.post("/byBidang", (req, res) => {
  const { bidang_usaha_id } = req.body
  const sql = `
      SELECT users_id, nama 
      FROM perusahaan 
      WHERE bidang_usaha_id = ?
    `
  db.query(sql, [bidang_usaha_id], (err, rows) => {
    if (err) return res.status(500).json({ success: false, error: err })
    res.json(rows)
  })
})


router.get("/bidang", (req, res) => {
  const sql = `SELECT id, uraian FROM master_bidang_usaha ORDER BY uraian ASC`;
  db.query(sql, (err, rows) => {
    if (err) {
      console.error("❌ DB Error bidang:", err.sqlMessage);
      return res.status(500).json({ success: false, error: err });
    }
    res.json(rows);
  });
});

router.post('/viewByUser', (req, res) => {
  const users_id = req.body.users_id;

  if (!users_id) {
    return res.status(400).json({ error: true, message: "users_id wajib dikirim" });
  }

  let sql = `
      SELECT 
        p.id, 
        p.users_id, 
        p.nama AS perusahaan_nama, 
        p.email AS perusahaan_email, 
        p.hp AS perusahaan_telp, 
        p.alamat AS perusahaan_alamat, 
        p.file_name AS perusahaan_logo,
        m.uraian AS bidang_usaha,
        u.nama AS pic_nama,
        u.email AS pic_email,
        u.hp AS pic_telp,
        u.jabatan AS pic_jabatan
      FROM db_csrkonsel.perusahaan p
      LEFT JOIN db_csrkonsel.master_bidang_usaha m 
        ON p.bidang_usaha_id = m.id
      LEFT JOIN db_csrkonsel.users u
        ON p.users_id = u.id
      WHERE p.users_id = ?
      LIMIT 1
    `;

  db.query(sql, [users_id], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.length === 0) {
      return res.json({ data: null, message: "Perusahaan tidak ditemukan" });
    }

    res.json({
      data: result[0]
    });
  });
});

router.post('/listRegis', (req, res) => {
  const { page_limit = 10, data_ke = 0, users_id, master_bidang_usaha } = req.body;
  const offset = data_ke;

  let query = `
  SELECT p.id, p.users_id, p.nama, b.uraian AS bidang_usaha, p.status, p.catatan_admin,
         p.email, p.hp, p.alamat, p.file_name,
         u.username, u.nama AS nama_pic, u.jabatan, u.email AS email_pic, u.hp AS hp_pic
  FROM perusahaan p
  LEFT JOIN users u ON u.id = p.users_id
  LEFT JOIN master_bidang_usaha b ON b.id = p.bidang_usaha_id
  WHERE 1=1
`;

  const params = [];

  if (master_bidang_usaha) {
    query += " AND p.bidang_usaha_id = ?";
    params.push(master_bidang_usaha);
  }

  if (users_id) {
    query += " AND p.users_id = ?";
    params.push(users_id);
  }

  query += " ORDER BY p.id ASC LIMIT ? OFFSET ?";
  params.push(parseInt(page_limit), parseInt(offset));

  db.query(query, params, (err, data) => {
    if (err) return res.status(500).json({ success: false, message: err.message });

    db.query('SELECT COUNT(*) as total FROM perusahaan', (err2, totalRes) => {
      if (err2) return res.status(500).json({ success: false, message: err2.message });

      res.json({
        success: true,
        data: data,
        jml_data: data.length,
        total_data: totalRes[0].total
      });
    });
  });
});


// router.post('/listRegis', (req, res) => {
//   const { page_limit = 10, data_ke = 0, users_id, master_bidang_usaha } = req.body;
//   const offset = data_ke;

//   let query = `
// SELECT p.id, p.users_id, p.nama, b.uraian AS bidang_usaha,
//        p.email, p.hp, p.alamat, p.status,  // Tambahkan p.status di sini
//        u.username, u.nama AS nama_pic, u.jabatan, u.email AS email_pic, u.hp AS hp_pic
// FROM perusahaan p
// LEFT JOIN users u ON u.id = p.users_id
// LEFT JOIN master_bidang_usaha b ON b.id = p.bidang_usaha_id
// WHERE 1=1
// `;

//   const params = [];

//   if (master_bidang_usaha) {
//     query += " AND p.bidang_usaha_id = ?";
//     params.push(master_bidang_usaha);
//   }

//   if (users_id) {
//     query += " AND p.users_id = ?";
//     params.push(users_id);
//   }

//   query += " ORDER BY p.id ASC LIMIT ? OFFSET ?";
//   params.push(parseInt(page_limit), parseInt(offset));

//   db.query(query, params, (err, data) => {
//     if (err) return res.status(500).json({ success: false, message: err.message });

//     db.query('SELECT COUNT(*) as total FROM perusahaan', (err2, totalRes) => {
//       if (err2) return res.status(500).json({ success: false, message: err2.message });

//       res.json({
//         success: true,
//         data: data,
//         jml_data: data.length,
//         total_data: totalRes[0].total
//       });
//     });
//   });
// });


function hapus_file(file) {
  const path = 'uploads/' + file;

  fs.unlink(path, (err) => {
    if (err) {
      console.error(err)
      return
    }
  })

}


router.post('/editPassword', async (req, res) => {
  const { users_id, password } = req.body;

  if (!users_id || !password) {
    return res.json({ success: false, message: "users_id dan password wajib dikirim" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `UPDATE db_csrkonsel.users SET password = ? WHERE id = ?`;

    db.query(sql, [hashedPassword, users_id], (err, result) => {
      if (err) {
        console.error(err);
        return res.json({ success: false, message: "Gagal mengubah password", error: err });
      }

      res.json({ success: true, message: "Password berhasil diubah" });
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Terjadi kesalahan server", error });
  }
});


router.post("/EditMitra", async (req, res) => {
  try {
    const {
      users_id,          // ID PIC
      perusahaan_id,     // ID perusahaan
      password,          // optional: jika kosong, password tidak diubah
      nama,              // nama PIC
      jabatan,
      pic_email,
      pic_hp,
      perusahaan_nama,
      bidang_usaha_id,
      perusahaan_email,
      perusahaan_hp,
      alamat
    } = req.body;

    // console.log("📥 Data edit diterima:", req.body);

    // ===== Update password jika ada =====
    let passwordQuery = '';
    let passwordParams = [];
    if (password && password.trim() !== '') {
      const hashedPassword = await bcrypt.hash(password.trim(), 12);
      passwordQuery = 'password = ?, ';
      passwordParams.push(hashedPassword);
    }

    // ===== Update tabel users (PIC) =====
    const sqlUser = `
      UPDATE users SET
        ${passwordQuery}
        nama = ?,
        jabatan = ?,
        email = ?,
        hp = ?
      WHERE id = ?
    `;
    db.query(
      sqlUser,
      [...passwordParams, nama, jabatan, pic_email, pic_hp, users_id],
      (errUser, resultUser) => {
        if (errUser) {
          console.error("❌ Error update users:", errUser);
          return res.status(500).json({ success: false, error: errUser.message });
        }

        const sqlPerusahaan = `
          UPDATE perusahaan SET
            nama = ?,
            bidang_usaha_id = ?,
            email = ?,
            hp = ?,
            alamat = ?
          WHERE id = ? AND users_id = ?
        `;
        db.query(
          sqlPerusahaan,
          [perusahaan_nama, bidang_usaha_id, perusahaan_email, perusahaan_hp, alamat, perusahaan_id, users_id],
          (errPerusahaan, resultPerusahaan) => {
            if (errPerusahaan) {
              console.error("❌ Error update perusahaan:", errPerusahaan);
              return res.status(500).json({ success: false, error: errPerusahaan.message });
            }

            res.json({
              success: true,
              message: "Data perusahaan dan PIC berhasil diperbarui 🎉",
              resultUser,
              resultPerusahaan
            });
          }
        );
      }
    );

  } catch (error) {
    console.error("🔥 Error edit perusahaan + PIC:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});


router.post("/hapusmitra", (req, res) => {
  const { users_id, perusahaan_id } = req.body;

  if (!users_id || !perusahaan_id) {
    return res.status(400).json({ success: false, error: "ID PIC / Perusahaan dibutuhkan" });
  }


  const sqlPerusahaan = `DELETE FROM perusahaan WHERE id = ? AND users_id = ?`;
  db.query(sqlPerusahaan, [perusahaan_id, users_id], (errPer, resultPer) => {
    if (errPer) {
      console.error("❌ Error hapus perusahaan:", errPer);
      return res.status(500).json({ success: false, error: errPer.message });
    }

    const sqlUser = `DELETE FROM users WHERE id = ?`;
    db.query(sqlUser, [users_id], (errUser, resultUser) => {
      if (errUser) {
        console.error("❌ Error hapus user:", errUser);
        return res.status(500).json({ success: false, error: errUser.message });
      }

      res.json({
        success: true,
        message: "Perusahaan dan PIC berhasil dihapus 🗑️"
      });
    });
  });
});

// router.post('/tolakRegistrasi', (req, res) => {
//   const { id, catatan_admin } = req.body; 
//   if (!id || !catatan_admin || catatan_admin.trim() === '') {
//     return res.status(400).json({ success: false, message: 'ID dan catatan admin diperlukan' });
//   }

//   const query = `
//     UPDATE db_csrkonsel.perusahaan 
//     SET status = 'ditolak', catatan_admin = ? 
//     WHERE id = ? AND status = 'pending'
//   `;
//   db.query(query, [catatan_admin.trim(), id], (err, result) => {
//     if (err) {
//       console.error('Error tolak registrasi:', err);
//       return res.status(500).json({ success: false, message: 'Gagal tolak registrasi', error: err.message });
//     }
//     if (result.affectedRows === 0) {
//       return res.status(404).json({ success: false, message: 'Registrasi tidak ditemukan atau sudah diproses' });
//     }
//     res.json({ success: true, message: 'Registrasi berhasil ditolak dan catatan disimpan' });
//   });
// });

router.post('/tolakRegistrasi', (req, res) => {
  const { id, catatan_admin } = req.body; 
  if (!id || !catatan_admin || catatan_admin.trim() === '') {
    return res.status(400).json({ success: false, message: 'ID dan catatan admin diperlukan' });
  }

  // 1) ambil data perusahaan dulu (nama, email, users_id)
  const getPerusahaanSql = `SELECT id, users_id, nama, email AS email_perusahaan FROM db_csrkonsel.perusahaan WHERE id = ? LIMIT 1`;
  db.query(getPerusahaanSql, [id], (errGet, rowsGet) => {
    if (errGet) {
      console.error('Error ambil perusahaan sebelum tolak:', errGet);
      return res.status(500).json({ success: false, message: 'Gagal ambil data perusahaan', error: errGet.message });
    }
    if (!rowsGet || rowsGet.length === 0) {
      return res.status(404).json({ success: false, message: 'Perusahaan tidak ditemukan' });
    }

    const perusahaan = rowsGet[0];

    // 2) update status jadi ditolak dan simpan catatan_admin (hanya jika status pending)
    const query = `
      UPDATE db_csrkonsel.perusahaan 
      SET status = 'ditolak', catatan_admin = ? 
      WHERE id = ? AND status = 'pending'
    `;
    db.query(query, [catatan_admin.trim(), id], (err, result) => {
      if (err) {
        console.error('Error tolak registrasi (update):', err);
        return res.status(500).json({ success: false, message: 'Gagal tolak registrasi', error: err.message });
      }
      if (result.affectedRows === 0) {
        // Bisa jadi sudah diproses sebelumnya
        return res.status(404).json({ success: false, message: 'Registrasi tidak ditemukan atau sudah diproses' });
      }

      // 3) prepare response ke client (kirim sekarang) — mail dikirim asinkron
      res.json({ success: true, message: 'Registrasi berhasil ditolak dan catatan disimpan' });

      // 4) ambil data PIC (opsional) untuk email (tidak blocking)
      (async () => {
        try {
          const usersId = perusahaan.users_id;

          let pic = null;
          if (usersId) {
            const picRows = await new Promise((resolve, reject) => {
              const sql = `SELECT nama AS nama_pic, email AS email_pic FROM db_csrkonsel.users WHERE id = ? LIMIT 1`;
              db.query(sql, [usersId], (e, r) => e ? reject(e) : resolve(r));
            });
            pic = (picRows && picRows[0]) ? picRows[0] : null;
          }

          // 5) susun daftar email tujuan (perusahaan + PIC jika berbeda)
          const toEmails = [];
          if (perusahaan.email_perusahaan) toEmails.push(perusahaan.email_perusahaan);
          if (pic && pic.email_pic && pic.email_pic !== perusahaan.email_perusahaan) toEmails.push(pic.email_pic);

          if (toEmails.length === 0) {
            console.warn('tolakRegistrasi: tidak ada email perusahaan/PIC untuk dikirimi notifikasi', id);
            return;
          }

          // 6) siapkan email (HTML)
          const safeNama = escapeHtml(perusahaan.nama || 'Mitra');
          const safeCatatan = escapeHtml(catatan_admin.trim());
          const frontendBase = (process.env.FRONTEND_URL || process.env.ADMIN_URL || 'https://admin-csr.konaweselatankab.go.id').replace(/\/$/, '');
          const helpUrl = `${frontendBase}/#/kontak`; // ubah bila perlu ke halaman bantuan/contact
          const subject = `Registrasi Anda Ditolak — ${safeNama}`;
          const html = `
            <!doctype html><html><body style="font-family: Inter, Arial, sans-serif; color:#222;">
              <div style="max-width:640px;margin:16px auto;padding:18px;border:1px solid #eee;border-radius:8px;">
                <h3 style="margin-top:0;color:#c0392b;">Permohonan Registrasi Ditolak</h3>
                <p>Yth. <strong>${safeNama}</strong>,</p>
                <p>Terima kasih atas pengajuan registrasi Anda. Mohon maaf, pengajuan <strong>tidak dapat kami setujui</strong> dengan alasan:</p>
                <blockquote style="background:#f8f9fa;border-left:4px solid #e74c3c;padding:10px 12px;color:#333;margin:12px 0;">${safeCatatan}</blockquote>
                <p>Silakan periksa kembali dokumen atau data pengajuan Anda dan ajukan kembali apabila sudah diperbaiki.</p>
                <p style="margin-top:12px;">Jika ada pertanyaan, silakan hubungi admin dengan cara membalas Email ini.</p>
                <hr style="border:none;border-top:1px solid #eee;margin:12px 0;">
                <div style="font-size:12px;color:#888;">CSR-SETARA — Pemerintah Kabupaten Konawe Selatan</div>
              </div>
            </body></html>
          `;

          // 7) kirim email (non-blocking)
          try {
            const infoMail = await sendMail({ to: toEmails, subject, html, replyTo: (process.env.NOTIF_TO || undefined) });
            console.log('Notif tolakRegistrasi terkirim ke:', toEmails.join(', '), 'info:', infoMail && infoMail.messageId ? infoMail.messageId : '(no messageId)');
          } catch (errMail) {
            console.error('Gagal kirim notifikasi tolakRegistrasi:', errMail && errMail.message ? errMail.message : errMail);
          }
        } catch (errOverall) {
          console.error('Error proses notifikasi tolakRegistrasi (internal):', errOverall && errOverall.message ? errOverall.message : errOverall);
        }
      })();

    });
  });
});



// router.post('/approveRegistrasi', async (req, res) => {
//   const { id, username, password } = req.body;

//   // Validasi input
//   if (!id || !username || !password) {
//     return res.status(400).json({ success: false, message: 'ID perusahaan, username, dan password wajib dikirim' });
//   }

//   if (username.trim() === '' || password.trim() === '') {
//     return res.status(400).json({ success: false, message: 'Username dan password tidak boleh kosong' });
//   }

//   try {
//     const checkUsernameSql = `
//   SELECT username FROM (
//     SELECT username FROM db_csrkonsel.users
//     UNION
//     SELECT username FROM egov.users
//   ) AS all_users
//   WHERE username = ? LIMIT 1
// `;


//     db.query(checkUsernameSql, [username.trim()], async (err, result) => {
//       if (err) {
//         console.error('Error cek username:', err);
//         return res.status(500).json({ success: false, message: 'Gagal cek username', error: err.message });
//       }

//       if (result.length > 0) {
//         return res.status(400).json({ success: false, message: 'Username sudah digunakan, pilih username lain' });
//       }

//       const getUsersIdSql = `SELECT users_id FROM db_csrkonsel.perusahaan WHERE id = ? AND status = 'pending' LIMIT 1`;
//       db.query(getUsersIdSql, [id], async (err2, perusahaanResult) => {
//         if (err2) {
//           console.error('Error ambil users_id:', err2);
//           return res.status(500).json({ success: false, message: 'Gagal ambil data perusahaan', error: err2.message });
//         }

//         if (perusahaanResult.length === 0) {
//           return res.status(404).json({ success: false, message: 'Perusahaan tidak ditemukan atau sudah diproses' });
//         }

//         const usersId = perusahaanResult[0].users_id;

//         const hashedPassword = await bcrypt.hash(password.trim(), 12);

//         const updateUserSql = `
//           UPDATE db_csrkonsel.users
//           SET username = ?, password = ?
//           WHERE id = ?
//         `;
//         db.query(updateUserSql, [username.trim(), hashedPassword, usersId], (err3, userResult) => {
//           if (err3) {
//             console.error('Error update user:', err3);
//             return res.status(500).json({ success: false, message: 'Gagal update akun user', error: err3.message });
//           }

//           const updatePerusahaanSql = `
//             UPDATE db_csrkonsel.perusahaan
//             SET status = 'terima',
//             catatan_admin = 'Mitra/Perusahaan Telah disetujui'
//             WHERE id = ? AND status = 'pending'
//           `;
//           db.query(updatePerusahaanSql, [id], (err4, perusahaanResult) => {
//             if (err4) {
//               console.error('Error update perusahaan:', err4);
//               return res.status(500).json({ success: false, message: 'Gagal update status perusahaan', error: err4.message });
//             }

//             if (perusahaanResult.affectedRows === 0) {
//               return res.status(404).json({ success: false, message: 'Perusahaan tidak ditemukan atau sudah diproses' });
//             }

//             res.json({ success: true, message: 'Registrasi disetujui dan akun diaktifkan' });
//           });
//         });
//       });
//     });
//   } catch (error) {
//     console.error('Error approve registrasi:', error);
//     res.status(500).json({ success: false, message: 'Terjadi kesalahan server', error: error.message });
//   }
// });

router.post('/approveRegistrasi', async (req, res) => {
  const { id, username, password } = req.body;

  // Validasi sederhana
  if (!id || !username || !password) {
    return res.status(400).json({ success: false, message: 'ID, username, dan password wajib diisi' });
  }

  try {
    // 1) cek username di dua tabel (db_csrkonsel.users + egov.users)
    const checkUsernameSql = `
      SELECT username FROM (
        SELECT username FROM db_csrkonsel.users
        UNION
        SELECT username FROM egov.users
      ) AS all_users
      WHERE username = ? LIMIT 1
    `;
    const usernameExists = await new Promise((resolve, reject) => {
      db.query(checkUsernameSql, [username.trim()], (err, rows) => err ? reject(err) : resolve(rows && rows.length > 0));
    });

    if (usernameExists) {
      return res.status(400).json({ success: false, message: 'Username sudah digunakan, silakan pilih username lain' });
    }

    // 2) ambil users_id perusahaan (cukup memastikan ada dan status pending)
    const getPerusahaanSql = `SELECT users_id, nama, email AS email_perusahaan FROM db_csrkonsel.perusahaan WHERE id = ? LIMIT 1`;
    const perusahaanRows = await new Promise((resolve, reject) => {
      db.query(getPerusahaanSql, [id], (err, rows) => err ? reject(err) : resolve(rows));
    });

    if (!perusahaanRows || perusahaanRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Perusahaan tidak ditemukan' });
    }
    const perusahaan = perusahaanRows[0];
    const usersId = perusahaan.users_id;

    // 3) hash password & update users table (simpan hash)
    const hashedPassword = await bcrypt.hash(password.trim(), 12);
    await new Promise((resolve, reject) => {
      const updateUserSql = `UPDATE db_csrkonsel.users SET username = ?, password = ? WHERE id = ?`;
      db.query(updateUserSql, [username.trim(), hashedPassword, usersId], (err, result) => (err ? reject(err) : resolve(result)));
    });

    // 4) update status perusahaan -> terima
    await new Promise((resolve, reject) => {
      const updatePerusahaanSql = `
        UPDATE db_csrkonsel.perusahaan
        SET status = 'terima', catatan_admin = 'Mitra/Perusahaan telah disetujui oleh admin'
        WHERE id = ?`;
      db.query(updatePerusahaanSql, [id], (err, result) => (err ? reject(err) : resolve(result)));
    });

    // 5) ambil info PIC jika tersedia di users (opsional)
    const picRows = await new Promise((resolve, reject) => {
      const sql = `SELECT nama AS nama_pic, email AS email_pic FROM db_csrkonsel.users WHERE id = ? LIMIT 1`;
      db.query(sql, [usersId], (err, rows) => (err ? reject(err) : resolve(rows)));
    });
    const pic = (picRows && picRows[0]) ? picRows[0] : null;

    // 6) susun daftar email tujuan (perusahaan + PIC jika berbeda)
    const toEmails = [];
    if (perusahaan.email_perusahaan) toEmails.push(perusahaan.email_perusahaan);
    if (pic && pic.email_pic && pic.email_pic !== perusahaan.email_perusahaan) toEmails.push(pic.email_pic);

    // 7) siapkan konten email (mengirim password plain sesuai permintaan)
    if (toEmails.length > 0) {
      const safeNama = escapeHtml(perusahaan.nama || 'Mitra');
      const safeUsername = escapeHtml(username.trim());
      const safePassword = escapeHtml(password.trim()); // akan dikirim plain dalam email
      const frontendBase = (process.env.FRONTEND_URL || process.env.ADMIN_URL || 'https://admin-csr.konaweselatankab.go.id').replace(/\/$/, '');
      const loginUrl = `${frontendBase}/#/login`;

      const subject = `Akun Anda Telah Diaktifkan — ${safeNama}`;
      const html = `
        <!doctype html><html><body style="font-family: Inter, Arial, sans-serif; color:#222;">
          <div style="max-width:640px;margin:16px auto;padding:18px;border:1px solid #eee;border-radius:8px;">
            <h3 style="margin-top:0;">Akun Anda Telah Diaktifkan</h3>
            <p>Yth. <strong>${safeNama}</strong>,</p>
            <p>Akun Anda pada sistem CSR-SETARA telah diaktifkan oleh Administrator. Silakan gunakan data berikut untuk masuk:</p>
            <table style="width:100%;font-size:14px;">
              <tr><td style="padding:6px 0;width:140px;"><strong>Username</strong></td><td style="padding:6px 0;">${safeUsername}</td></tr>
              <tr><td style="padding:6px 0;"><strong>Password</strong></td><td style="padding:6px 0;">${safePassword}</td></tr>
            </table>
            <p style="margin-top:12px;">Masuk ke <a href="${loginUrl}">${loginUrl}</a>. Setelah masuk, kami sarankan segera mengganti kata sandi Anda.</p>
            <p style="font-size:13px;color:#666;margin-top:12px;">Jika Anda tidak mengharapkan email ini, segera hubungi administrator.</p>
            <hr style="border:none;border-top:1px solid #eee;margin:12px 0;">
            <div style="font-size:12px;color:#888;">CSR-SETARA — Pemerintah Kabupaten Konawe Selatan</div>
          </div>
        </body></html>
      `;

      // Kirim email (asynchronous). Jangan log password plain.
      sendMail({ to: toEmails, subject, html })
        .then(infoMail => {
          console.log('Email notifikasi aktivasi terkirim ke', toEmails.join(', '));
        })
        .catch(errMail => {
          // catat error, tapi jangan sertakan password
          console.error('Gagal mengirim email aktivasi:', errMail && errMail.message ? errMail.message : errMail);
        });
    } else {
      console.warn('approveRegistrasi: tidak ada alamat email tujuan untuk pengiriman notifikasi', id);
    }

    // 8) respon ke client
    return res.json({ success: true, message: 'Registrasi disetujui, username & password telah dikirim melalui email (jika ada alamat email).' });

  } catch (err) {
    console.error('Error approveRegistrasi:', err && err.message ? err.message : err);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});




module.exports = router;