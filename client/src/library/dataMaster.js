// import {store1} from '../store/index's

var DataStore = require('../store');
var store = DataStore.default

const fetchPOST = () => {
  return store.state.kamio
}



const getJenisKel = () => {
  fetch(store.state.url.URL_simpeg_simpeg_jenisKelamin + "list", {
      method : 'POST',
      headers : {
        "content-type": "application/json",
        authorization: "kikensbatara " + localStorage.token
      },
      body : JSON.stringify({
        unit_kerja : 'unit_kerja'

      })
  }).then((res) => res.json()).then((res_data) => {
    store.state.list_jenis_kelamin = res_data
    // console.log(res_data)
  })
}


const getPendidikanAkhir = () => {
  fetch(store.state.url.URL_simpeg_strata_ijazah + "list", {
      method : 'POST',
      headers : {
        "content-type": "application/json",
        authorization: "kikensbatara " + localStorage.token
      },
      body : JSON.stringify({
        unit_kerja : 'unit_kerja'
      })
    }).then((res) => res.json()).then((res_data) => {
      store.state.list_strata_ijazah = res_data
      // console.log(res_data)
    })
  }

const getJK = () => {
  fetch(store.state.url.URL_simpeg_simpeg_jenisKelamin + "list", {
      method : 'POST',
      headers : {
        "content-type": "application/json",
        authorization: "kikensbatara " + localStorage.token
      },
      body : JSON.stringify({
        unit_kerja : 'unit_kerja'

      })
  }).then((res) => res.json()).then((res_data) => {
    store.state.list_jenis_kelamin = res_data
    // console.log(res_data)
  })
}


const getStatusKeluarga = () => {
  fetch(store.state.url.URL_simpeg_simpeg_statusKeluarga + "list", {
      method : 'POST',
      headers : {
        "content-type": "application/json",
        authorization: "kikensbatara " + localStorage.token
      },
      body : JSON.stringify({
        unit_kerja : 'unit_kerja'

      })
  }).then((res) => res.json()).then((res_data) => {
    store.state.list_status_keluarga = res_data
    // console.log(res_data)
  })
}


const getAgama = () => {
  fetch(store.state.url.URL_simpeg_agama + "list", {
      method : 'POST',
      headers : {
        "content-type": "application/json",
        authorization: "kikensbatara " + localStorage.token
      },
      body : JSON.stringify({
        unit_kerja : 'unit_kerja'

      })
  }).then((res) => res.json()).then((res_data) => {
    store.state.list_agama = res_data
    // console.log(res_data)
  })
}

const getStrataIjazah = () => {
  fetch(store.state.url.URL_simpeg_strata_ijazah + "list", {
      method : 'POST',
      headers : {
        "content-type": "application/json",
        authorization: "kikensbatara " + localStorage.token
      },
      body : JSON.stringify({
        unit_kerja : 'unit_kerja'

      })
  }).then((res) => res.json()).then((res_data) => {
    store.state.list_strata_ijazah = res_data
    // console.log(res_data)
  })
}



const getInstansi = (kabupaten_id) => {
  // console.log(kecamatan)
  fetch(store.state.url.URL_simpeg_instansi + "list", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: "kikensbatara " + localStorage.token
    },
    body: JSON.stringify({
      kabupaten_id: 'kabupaten_id'
    })
  })
      .then(res => res.json())
      .then(res_data => {
      // console.log(res_data)
      store.state.list_instansi = res_data
  });
}


const getUnitKerja = (instansi) => {
  // console.log(kecamatan)
  fetch(store.state.url.URL_simpeg_unit_kerja + "list", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: "kikensbatara " + localStorage.token
    },
    body: JSON.stringify({
      instansi: instansi
    })
  })
      .then(res => res.json())
      .then(res_data => {
      store.state.list_unit_kerja = res_data
      // console.log(res_data)
  });
}

const getBiodata = (sub_unit_kerja) => {
  // console.log(kecamatan)
  fetch(store.state.url.URL_simpeg_biodata + "list", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: "kikensbatara " + localStorage.token
    },
    body: JSON.stringify({
      unit_kerja: sub_unit_kerja
    })
  })
      .then(res => res.json())
      .then(res_data => {
      store.state.list_biodata = res_data
      // console.log(res_data)
  });
}




module.exports = {
  fetchPOST: fetchPOST,
  getJK : getJK,
  getStatusKeluarga : getStatusKeluarga,
  getAgama : getAgama,
  getStrataIjazah : getStrataIjazah,
  getJenisKel : getJenisKel,
  getPendidikanAkhir : getPendidikanAkhir,

  getInstansi : getInstansi,
  getUnitKerja : getUnitKerja,
  getBiodata : getBiodata,

}