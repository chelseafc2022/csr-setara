import Vue from 'vue'
import Vuex from 'vuex'

import { Loading,  QSpinnerFacebook,  } from 'quasar'
import { Notify } from 'quasar'

Vue.use(Vuex)

// var URL = 'http://localhost:5052/'
var URL = 'https://server-csr.konaweselatankab.go.id/'
// var URL = 'http://192.168.1.8:5028/'
// var URL = 'https://server.absensi.konaweselatankab.go.id/'

export default new Vuex.Store({
  state: {
    coordinat : {
      lat:-4.034694, 
      lng: 122.484263
    },
    btn : {
      add : false,
      edit : false,
      remove : false,
    },
    url : {
      URL_APP : URL,

      URL_simpeg_biodata : URL+'api/v1/dm_biodata/',
      URL_simpeg_unit_kerja: URL+'api/v1/dm_unitKerja/',
      URL_simpeg_instansi : URL+'api/v1/dm_instansi/',

      URL_DM_REGISTER : URL+'api/v1/dm_registrasi/',
      URL_DM_MENU : URL+'api/v1/dm_menuList/',
      URL_DM_KLP_USERS : URL+'api/v1/dm_kelompokUsers/',
      checkAuth : URL + 'api/v1/checkAuth/',


      
      DASHBOARD : URL + 'api/v1/dashboard/',
      URL_DM_BID : URL + 'api/v1/dm_bid/',
      DATA_MITRA : URL + 'api/v1/data_mitra/',
      KEGIATAN_CSR : URL + 'api/v1/kegiatan_csr/',
      LIST_PENGAJUAN : URL + 'api/v1/list_pengajuan/',
      LIST_PENGAJUAN_FORCE : URL + 'api/v1/list_pengajuan_force/',
      FORCEMAJEURE : URL + 'api/v1/forceMajeure/',
      BERITA : URL + 'api/v1/berita/',
      
    },

    // ====================================== CONTOH AUTOCOMPLETE ====================================
    list_contoh_autocomplete : [],
    list_unit_kerja: [],
    list_instansi: [],
    // ====================================== CONTOH AUTOCOMPLETE ====================================

    list_menu : null,
    aksesMenu : {},

    page_first: 1,
    page_last: 0,
    cari_value: "",
    cek_load_data : true,

    type : [
      {id : 0, uraian : 'Single Menu'},
      {id : 1, uraian : 'Multy Menu'}
    ],

    
  },
  mutations: {
    listJeniskategorilokasi(state){

      fetch(state.url.URL_MasterKategoriLokasi, {
        method: "GET",
        headers: {
          "content-type": "application/json",
          authorization: "kikensbatara " + localStorage.token
        }
      })
        .then(res => res.json())
        .then(res_data => {
          state.list_MasterKategoriLokasi = res_data;
      });

    },

    listApelJenis(state){

      fetch(state.url.URL_apelJenis, {
        method: "GET",
        headers: {
          "content-type": "application/json",
          authorization: "kikensbatara " + localStorage.token
        }
      })
        .then(res => res.json())
        .then(res_data => {
          // console.log(res_data)
          state.list_ApleJenis = res_data;
      });

    },

    getStorage(state){
      var get_profile = JSON.parse(localStorage.profile);
      state.unit_kerja = get_profile.profile.unit_kerja; 
    },
    shoWLoading(){
      const spinner = typeof QSpinnerFacebook !== 'undefined'
        ? QSpinnerFacebook // Non-UMD, imported above
        : Quasar.components.QSpinnerFacebook // eslint-disable-line


      Loading.show({
        spinner,
        spinnerColor: 'blue',
        spinnerSize: 140,
        backgroundColor: 'grey',
        // message: 'Loading... Tunggu beberapa saat, system sedang menyesuaikan akun anda..!',
        // messageColor: 'blue'
      })
    },
    hideLoading(){
      Loading.hide()
    },
    shoWNotify(state, message, color, icon){
      Notify.create({
        message: message,
        color: color,
        position : 'top-right',
        icon:icon
      })
    },
  },
  actions: {
  },
  modules: {
  }
})
