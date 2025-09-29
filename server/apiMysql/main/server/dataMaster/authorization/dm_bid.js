const express = require('express');
var db = require('../../../../../db/MySql/umum');


const fs = require('fs');

var multer=require("multer");

var uniqid = require('uniqid');
const { log } = require('console');
const router = express.Router();



router.get('/', (req, res) => {

    let query = `
        SELECT
        direktori.*
        FROM direktori
       
    `
    db.query(query, (err, row)=>{
        if (err) {
            res.json(err)
        }else{
            res.json(row)
        }
    })
});


router.post('/view', (req, res) => {
    // Ambil data body dengan fallback default
    let data_batas = parseInt(req.body.page_limit) || 10; // default 10
    let data_ke = parseInt(req.body.data_ke) || 1;        // default halaman 1
    let data_star = (data_ke - 1) * data_batas;
    let cari = req.body.cari_value || "";
  
    // Hitung jumlah data
        let jml_data = `
        SELECT COUNT(*) as total
        FROM db_csrkonsel.master_bidang_csr
        WHERE uraian LIKE ?
        `;

        // Ambil data sesuai halaman
        let view = `
        SELECT *
        FROM db_csrkonsel.master_bidang_csr
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
  

  router.post('/viewSubid', (req, res) => {
    const data_batas = req.body.page_limit || 10;
    const data_star = ((req.body.data_ke || 1) - 1) * data_batas;
    const cari = req.body.cari_value || '';
    const master_bidang_csr_id = req.body.master_bidang_csr_id || '';

    let whereClause = `WHERE sub.uraian LIKE ?`;
    let params = [`%${cari}%`];

    if (master_bidang_csr_id) {
        whereClause += ` AND sub.master_bidang_csr_id = ?`;
        params.push(master_bidang_csr_id);
    }

    // Query total data
    let jml_data = `
      SELECT sub.*, bidang.uraian AS uraian_bidang
      FROM db_csrkonsel.master_bidang_sub_csr sub
      LEFT JOIN db_csrkonsel.master_bidang_csr bidang
        ON bidang.id = sub.master_bidang_csr_id
      ${whereClause}
      ORDER BY sub.id DESC
    `;

    // Query dengan LIMIT (paging)
    let view = jml_data + ` LIMIT ?, ?`;
    let paramsView = [...params, data_star, data_batas];

    db.query(jml_data, params, (err, rows) => {
        if (err) return res.json({ error: err });

        let halaman = Math.ceil(rows.length / data_batas);
        if (halaman < 1) halaman = 1;

        db.query(view, paramsView, (err, result) => {
            if (err) return res.json({ error: err });

            res.json({
                data: result,
                jml_data: halaman
            });
        });
    });
});

router.post('/viewBidang', (req, res) => {
    let sql = `
      SELECT id, uraian 
      FROM db_csrkonsel.master_bidang_csr 
      ORDER BY uraian ASC
    `;

    db.query(sql, (err, result) => {
        if (err) {
            return res.json({ error: err });
        }
        res.json({ data: result });
    });
});



router.post('/addData', (req,res)=>{

    var id = uniqid()
    var data = req.body



     let insert = `INSERT INTO master_bidang_csr (id, uraian)
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

router.post('/removeData', (req, res)=> {
    var query = `
        DELETE FROM master_bidang_csr WHERE id = '`+req.body.id+`';
    `;

    var subidx = `
        DELETE FROM master_bidang_sub_csr WHERE master_bidang_csr_id = '`+req.body.id+`';
    `;

    db.query(query, (err, row)=>{
        if(err){
            res.send(err);
        }else{
            db.query(subidx, (err, row)=>{
                if(err){
                    res.send(err);
                }else{
                    res.send(row);
                }
            });
        }
    });
})



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


// POST /master_csr/sub_bidang
router.post('/sub_bidang', (req, res) => {
    const { bidang_csr_id } = req.body;
  
    const query = `
      SELECT id, uraian
      FROM master_bidang_sub_csr
      WHERE master_bidang_csr_id = ?
      ORDER BY uraian ASC
    `;
    
    db.query(query, [bidang_csr_id], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(result);
    });
  });
  
  

  // GET /master_csr/bidang
router.get('/bidang', (req, res) => {
    const query = `
      SELECT id, uraian
      FROM master_bidang_csr
      ORDER BY uraian ASC
    `;
    
    db.query(query, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(result);
    });
  });


  router.get('/force', (req, res) => {
    const query = `
      SELECT id, uraian
      FROM master_force_majeure
      ORDER BY uraian ASC
    `;
    
    db.query(query, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(result);
    });
  });




function hapus_file(file){
    const path = 'uploads/'+file;

    fs.unlink(path, (err) => {
        if (err) {
          console.error(err)
          return
        }
    })

}

module.exports = router;