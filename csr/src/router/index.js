import { createRouter, createWebHashHistory } from 'vue-router'


import Home from "../views/Home.vue";
import Berita from "../views/Berita.vue";
import Beritaisi from "../views/Beritaisi.vue";



// ====================CSR==================

import Kegiatancsr from "../views/csr/Kegiatancsr.vue";
import Kegiatancsrisi from "../views/csr/Kegiatancsrisi.vue";
import forcemajeure from "../views/csr/forcemajeure.vue";
import registerMitracsr from "../views/csr/registerMitracsr.vue";



const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },

  // ====================CSR==================
  {
    path: '/Kegiatancsr',
    name: 'Kegiatan CSR',
    component: Kegiatancsr
  },
  {
    path: '/Kegiatancsrisi/:id',
    name: 'Isi Kegiatan CSR',
    component: Kegiatancsrisi
  },

  {
    path: '/forcemajeure',
    name: 'Program CSR - Force Majeure',
    component: forcemajeure
  },
  {
    path: '/registerMitracsr',
    name: 'Registrasi Perusahaan',
    component: registerMitracsr
  },

  // ====================CSR==================





  {
    path: '/Berita',
    name: 'Berita',
    component: Berita
  },
  {
    path: '/Beritaisi/:id',
    name: 'Beritaisi',
    component: Beritaisi
  },

 
]

const router = createRouter({
  // eslint-disable-next-line no-unused-vars
  scrollBehavior(to, from, savedPosition) {
    return {
      top: 0,
      behavior: 'smooth'
     }
  },
  history: createWebHashHistory(),
  routes,
})

export default router
