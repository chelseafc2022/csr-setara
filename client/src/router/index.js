import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'
import kegiatan_csr from '../views/1kegiatancsr/kegiatan_csr.vue'

Vue.use(VueRouter);


function loggedInRedirectDashboard(to, from, next) {
  const token = localStorage.token;
  const tipe = localStorage.tipe;

  if (token) {
    if (tipe === "1" || tipe === "5" ) {
      
      next('/dashboard-admin');
    } else if (tipe === "4") {
      
      next('/dashboard-perusahaan');
    } else {
      
      next('/dashboard-perusahaan');
    }
  } else {
    next();
  }
}


function isLoggedIn(to, from, next) {
  if (localStorage.token) {
    next()
  } else {
    next('/login');
  }
}


  const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/auth/login.vue'),
    beforeEnter: loggedInRedirectDashboard,
  },



  {
    path: '/dashboard-admin',
    name: 'DashboardAdmin',
    component: () => import('../views/DashboardAdmin.vue'),
    beforeEnter: isLoggedIn,
  },
  {
    path: '/dashboard-perusahaan',
    name: 'DashboardPerusahaan',
    component: () => import('../views/DashboardPerusahaan.vue'),
    beforeEnter: isLoggedIn,
  },
  {
    path: '/kegiatan_csr',
    name: 'Kegiatan CSR',
    component: kegiatan_csr,
    beforeEnter: isLoggedIn,
  },

  {
    path: '/forceMajeure',
    name: 'CSR Force Majeure',
    component: () => import('../views/1kegiatancsr/forceMajeure.vue'),
    beforeEnter: isLoggedIn,
  },
  {
    path: '/berita',
    name: 'CSR Force Majeure',
    component: () => import('../views/berita.vue'),
    beforeEnter: isLoggedIn,
  },
  {
    path: '/list_pengajuan',
    name: 'List Pengajuan Program',
    component: () => import('../views/1kegiatancsr/list_pengajuan.vue'),
    beforeEnter: isLoggedIn,
  },
  {
    path: '/list_pengajuan_force',
    name: 'List Pengajuan Program',
    component: () => import('../views/1kegiatancsr/list_pengajuan_force.vue'),
    beforeEnter: isLoggedIn,
  },


 
  {
    path: '/menuList',
    name: 'menuList',
    component: () => import('../views/dataMaster/menuList.vue'),
    beforeEnter: isLoggedIn,
  },
  {
    path: '/klpUsers',
    name: 'klpUsers',
    component: () => import('../views/dataMaster/klpUsers.vue'),
    beforeEnter: isLoggedIn,
  },
  {
    path: '/registrasi',
    name: 'registrasi',
    component: () => import('../views/dataMaster/registrasi.vue'),
    beforeEnter: isLoggedIn,
  },
  {
    path: '/regisMitra',
    name: 'regisMitra',
    component: () => import('../views/dataMaster/regisMitra.vue'),
    beforeEnter: isLoggedIn,
  },
  {
    path: '/bidcsr',
    name: 'bidcsr',
    component: () => import('../views/dataMaster/bidcsr.vue'),
    beforeEnter: isLoggedIn,
  },
  {
    path: '/subidcsr',
    name: 'subidcsr',
    component: () => import('../views/dataMaster/subidcsr.vue'),
    beforeEnter: isLoggedIn,
  },
  {
    path: '/kebencanaan',
    name: 'kebencanaan',
    component: () => import('../views/dataMaster/kebencanaan.vue'),
    beforeEnter: isLoggedIn,
  },
  {
    path: '/bid_usaha',
    name: 'bid_usaha',
    component: () => import('../views/dataMaster/bid_usaha.vue'),
    beforeEnter: isLoggedIn,
  },
  {
    path: '/dataPerusahaan',
    name: 'dataPerusahaan',
    component: () => import('../views/dataMaster/dataPerusahaan.vue'),
    beforeEnter: isLoggedIn,
  },
  

  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue'),
    beforeEnter: isLoggedIn,
  },


]

const router = new VueRouter({
  // mode: 'history',
  // base: process.env.BASE_URL,
  routes
})

export default router
