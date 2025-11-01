import { createStore } from 'vuex'
// var URL_APP = 'https://server-web.konaweselatankab.go.id/';
// var URL_APP = 'http://localhost:5052/'
var URL_APP = 'https://server-csr.konaweselatankab.go.id/'
var URL_APP_EGOV = 'https://server-egov.konaweselatankab.go.id/';

export default createStore({
  state: {
    egov: {
      UPLOADS: URL_APP_EGOV + 'uploads/',
    },
    BASE_URL: URL_APP,
    UPLOADS: URL_APP + 'uploads/',
    URL_API: 'https://server-web.konaweselatankab.go.id/api/v1/web_publish_berita/',
    URL_home: {
      listLink: URL_APP + '/api/v1/web_publish_berita/'

    },

    URL: {
      HOME: URL_APP + 'api/v1/publish/homeCSR/',
      berita: URL_APP + "api/v1/web_publish_berita/",
      publish_bidang_usaha: URL_APP + "api/v1/publish_bidang_usaha/",
      perusahaan: URL_APP + "api/v1/data_mitra/",
      registrasiMitra: URL_APP + 'api/v1/publish/registrasiMitra',
      KEGIATAN_CSR: URL_APP + 'api/v1/publish/kegiatanCSR/',
      KEGIATAN_FORCE: URL_APP + 'api/v1/publish/kegiatan_fmCSR/',
      BERITA_CSR: URL_APP + 'api/v1/publish/beritaCSR/',
    },
    isVisible: false,
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
