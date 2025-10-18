const express = require('express');
var db = require('../../../../db/MySql/umum');


const fs = require('fs');

var multer=require("multer");

var uniqid = require('uniqid');
const { log } = require('console');
const router = express.Router();

router.post('/view', (req, res) => {
    let data_batas = parseInt(req.body.page_limit) || 10;
    let data_ke = parseInt(req.body.data_ke) || 1;
    let data_star = (data_ke - 1) * data_batas;
    let cari = req.body.cari_value || "";
    let bidang = req.body.master_bidang_usaha || ""; // ambil dari filter
  
    let where = "WHERE p.nama LIKE ?";
    let params = [`%${cari}%`];
  
    if (bidang) {
      where += " AND p.bidang_usaha_id = ?";
      params.push(bidang);
    }
  
    // hitung jumlah data
    let jml_data = `
      SELECT COUNT(*) as total
      FROM db_csrkonsel.perusahaan p
      ${where}
    `;
  
    // ambil data sesuai halaman
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
  
      // tambahkan limit & offset
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

    // query insert untuk perusahaan
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



router.post('/editData', (req,res)=>{
    var data = req.body

    query = `

    UPDATE master_bidang_csr SET

    uraian = '`+data.uraian+`'

    WHERE id = '`+data.id+`'
    `;

    db.query(query, (err, row)=>{
        if(err) {
            console.log(err);
            res.send(err);
        }else{
            res.send(row);
        }
    })

})
router.post('/addSubid', (req,res)=>{
    var id = uniqid();
    var data = req.body.form;

    let insert = `
        INSERT INTO master_bidang_sub_csr (id, uraian, master_bidang_csr_id)
        VALUES (?, ?, ?)
    `;

    db.query(insert, [id, data.uraian, data.master_bidang_csr_id], (err, row)=>{
        if(err) {
            console.log('❌ Error Insert Subid:', err);
            return res.status(500).send(err);
        }else{
            console.log('✅ Insert Success:', row);
            res.send(row);
        }
    });
});



router.post('/editSubid', (req,res)=>{
    var data = req.body

    query = `

    UPDATE master_bidang_sub_csr SET

    uraian = '`+data.uraian+`'
    WHERE id = '`+data.id+`'
    `;

    db.query(query, (err, row)=>{
        if(err) {
            console.log(err);
            res.send(err);
        }else{
            res.send(row);
        }
    })

})

router.post('/removeSubid', (req, res)=> {
    // var file = req.body.file
    // hapus_file(file);

    var query = `
        DELETE FROM master_bidang_sub_csr WHERE id = '`+req.body.id+`';
    `;
    db.query(query, (err, row)=>{
        if(err){
            res.send(err);
        }else{
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
    // Ambil data body dengan fallback default
    let data_batas = parseInt(req.body.page_limit) || 10; // default 10
    let data_ke = parseInt(req.body.data_ke) || 1;        // default halaman 1
    let data_star = (data_ke - 1) * data_batas;
    let cari = req.body.cari_value || "";
  
    // Hitung jumlah data
        let jml_data = `
        SELECT COUNT(*) as total
        FROM db_csrkonsel.master_force_majeure
        WHERE uraian LIKE ?
        `;

        // Ambil data sesuai halaman
        let view = `
        SELECT *
        FROM db_csrkonsel.master_force_majeure
        WHERE uraian LIKE ?
        ORDER BY uraian ASC
        LIMIT ?, ?
        `;
  
    // Query count dulu
    db.query(jml_data, [`%${cari}%`], (err, row) => {
      if (err) {
        return res.json(err);
      }
  
      let total = row[0].total;
      let halaman = Math.ceil(total / data_batas);
      if (halaman < 1) halaman = 1;
  
      // Query data view
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


router.post('/addDataForce', (req,res)=>{

    var id = uniqid()
    var data = req.body



     let insert = `INSERT INTO master_force_majeure (id, uraian)
    VALUES (
        '`+id+`',
        '`+data.uraian+`'

        )
    `

    db.query(insert, (err, row)=>{
        if(err) {
            console.log('errrrooorrr');
            console.log(err);
            res.send(err);
        }else{
            console.log(row);
            res.send(row);
        }
    })
    // console.log(req.body);
});

router.post('/editDataForce', (req,res)=>{
    var data = req.body

    query = `

    UPDATE master_force_majeure SET

    uraian = '`+data.uraian+`'

    WHERE id = '`+data.id+`'
    `;

    db.query(query, (err, row)=>{
        if(err) {
            console.log(err);
            res.send(err);
        }else{
            res.send(row);
        }
    })

})


router.post('/removeDataForce', (req, res)=> {
    // var file = req.body.file
    // hapus_file(file);

    var query = `
        DELETE FROM master_force_majeure WHERE id = '`+req.body.id+`';
    `;
    db.query(query, (err, row)=>{
        if(err){
            res.send(err);
        }else{
            res.send(row);
        }
    });
})




router.post('/viewUsaha', (req, res) => {
    // Ambil data body dengan fallback default
    let data_batas = parseInt(req.body.page_limit) || 10; // default 10
    let data_ke = parseInt(req.body.data_ke) || 1;        // default halaman 1
    let data_star = (data_ke - 1) * data_batas;
    let cari = req.body.cari_value || "";
  
    // Hitung jumlah data
        let jml_data = `
        SELECT COUNT(*) as total
        FROM db_csrkonsel.master_bidang_usaha
        WHERE uraian LIKE ?
        `;

        // Ambil data sesuai halaman
        let view = `
        SELECT *
        FROM db_csrkonsel.master_bidang_usaha
        WHERE uraian LIKE ?
        ORDER BY uraian ASC
        LIMIT ?, ?
        `;
  
    // Query count dulu
    db.query(jml_data, [`%${cari}%`], (err, row) => {
      if (err) {
        return res.json(err);
      }
  
      let total = row[0].total;
      let halaman = Math.ceil(total / data_batas);
      if (halaman < 1) halaman = 1;
  
      // Query data view
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


router.post('/addDataUsaha', (req,res)=>{

    var id = uniqid()
    var data = req.body



     let insert = `INSERT INTO master_bidang_usaha (id, uraian)
    VALUES (
        '`+id+`',
        '`+data.uraian+`'

        )
    `

    db.query(insert, (err, row)=>{
        if(err) {
            console.log('errrrooorrr');
            console.log(err);
            res.send(err);
        }else{
            console.log(row);
            res.send(row);
        }
    })
    // console.log(req.body);
});

router.post('/editDataUsaha', (req,res)=>{
    var data = req.body

    query = `

    UPDATE master_bidang_usaha SET

    uraian = '`+data.uraian+`'

    WHERE id = '`+data.id+`'
    `;

    db.query(query, (err, row)=>{
        if(err) {
            console.log(err);
            res.send(err);
        }else{
            res.send(row);
        }
    })

})


router.post('/removeDataUsaha', (req, res)=> {
    // var file = req.body.file
    // hapus_file(file);

    var query = `
        DELETE FROM master_bidang_usaha WHERE id = '`+req.body.id+`';
    `;
    db.query(query, (err, row)=>{
        if(err){
            res.send(err);
        }else{
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

  // GET semua bidang usaha
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

  // ambil detail perusahaan berdasarkan users_id
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


function hapus_file(file){
    const path = 'uploads/'+file;

    fs.unlink(path, (err) => {
        if (err) {
          console.error(err)
          return
        }
    })

}




const bcrypt = require('bcryptjs'); 

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

        // ===== Update tabel perusahaan =====
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

  if(!users_id || !perusahaan_id){
    return res.status(400).json({ success: false, error: "ID PIC / Perusahaan dibutuhkan" });
  }

  // ===== Hapus perusahaan =====
  const sqlPerusahaan = `DELETE FROM perusahaan WHERE id = ? AND users_id = ?`;
  db.query(sqlPerusahaan, [perusahaan_id, users_id], (errPer, resultPer) => {
    if(errPer) {
      console.error("❌ Error hapus perusahaan:", errPer);
      return res.status(500).json({ success: false, error: errPer.message });
    }

    // ===== Hapus user/PIC =====
    const sqlUser = `DELETE FROM users WHERE id = ?`;
    db.query(sqlUser, [users_id], (errUser, resultUser) => {
      if(errUser){
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


module.exports = router;