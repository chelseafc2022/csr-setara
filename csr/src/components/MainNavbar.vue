<template>
  <header class="tg-header__style-five"
    :class="[{ 'transparent-header': isHome }, { 'mobile-menu-visible': isMobileMenuOpen }]">
    <div class="tg-header__top">
      <div class="container custom-container">
        <div class="row">
          <div class="col-lg-6">
            <ul class="tg-header__top-info left-side list-wrap">
              <li><i class="flaticon-phone-call"></i><a href="javascript:void(0);">0821-9327-8680</a></li>
              <li><i class="flaticon-pin"></i>Andoolo, Kabupaten Konawe Selatan</li>
            </ul>
          </div>
          <div class="col-lg-6">
            <ul class="tg-header__top-right list-wrap">
              <li><i class="flaticon-envelope"></i><a href="javascript:void(0);">csrkonsel@gmail.com</a></li>
              <li><i class="flaticon-time"></i>Mon-Fri: 08:00am - 15:30pm</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div id="sticky-header" class="tg-header__area">
      <div class="container custom-container">
        <div class="row">
          <div class="col-12">
            <div class="tgmenu__wrap">
              <nav class="tgmenu__nav">
                <div class="logo">
                  <router-link to="/">
                    <img src="/assets/img/logo/logox.png" alt="Logo" />
                  </router-link>
                </div>

                <div class="tgmenu__navbar-wrap tgmenu__main-menu d-none d-lg-flex">
                  <NavItems />
                </div>

                <div class="tgmenu__action tgmenu__action-five d-none d-md-block">
                  <ul class="list-wrap">
                    <li class="header-btn">
                      <!-- <a href="contact.html" class="btn">Free Trial</a> -->
                      <a class="btn" href="https://admin-csr.konaweselatankab.go.id" target="_blank">MASUK APP</a>
                    </li>

                  </ul>
                </div>

                <div class="mobile-nav-toggler mobile-nav-toggler-two" @click="openMobileMenu">
                  <!-- icon -->
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" fill="none">
                    <path
                      d="M0 2C0 0.895431 0.895431 0 2 0C3.10457 0 4 0.895431 4 2C4 3.10457 3.10457 4 2 4C0.895431 4 0 3.10457 0 2Z"
                      fill="currentcolor" />
                    <path
                      d="M0 9C0 7.89543 0.895431 7 2 7C3.10457 7 4 7.89543 4 9C4 10.1046 3.10457 11 2 11C0.895431 11 0 10.1046 0 9Z"
                      fill="currentcolor" />
                    <path
                      d="M0 16C0 14.8954 0.895431 14 2 14C3.10457 14 4 14.8954 4 16C4 17.1046 3.10457 18 2 18C0.895431 18 0 17.1046 0 16Z"
                      fill="currentcolor" />
                    <path
                      d="M7 2C7 0.895431 7.89543 0 9 0C10.1046 0 11 0.895431 11 2C11 3.10457 10.1046 4 9 4C7.89543 4 7 3.10457 7 2Z"
                      fill="currentcolor" />
                    <path
                      d="M7 9C7 7.89543 7.89543 7 9 7C10.1046 7 11 7.89543 11 9C11 10.1046 10.1046 11 9 11C7.89543 11 7 10.1046 7 9Z"
                      fill="currentcolor" />
                    <path
                      d="M7 16C7 14.8954 7.89543 14 9 14C10.1046 14 11 14.8954 11 16C11 17.1046 10.1046 18 9 18C7.89543 18 7 17.1046 7 16Z"
                      fill="currentcolor" />
                    <path
                      d="M14 2C14 0.895431 14.8954 0 16 0C17.1046 0 18 0.895431 18 2C18 3.10457 17.1046 4 16 4C14.8954 4 14 3.10457 14 2Z"
                      fill="currentcolor" />
                    <path
                      d="M14 9C14 7.89543 14.8954 7 16 7C17.1046 7 18 7.89543 18 9C18 10.1046 17.1046 11 16 11C14.8954 11 14 10.1046 14 9Z"
                      fill="currentcolor" />
                    <path
                      d="M14 16C14 14.8954 14.8954 14 16 14C17.1046 14 18 14.8954 18 16C18 17.1046 17.1046 18 16 18C14.8954 18 14 17.1046 14 16Z"
                      fill="currentcolor" />
                  </svg>
                </div>
              </nav>
            </div>
            <!-- <MobileMenu :is-open="isMobileMenuOpen" @close="toggleMobileMenu" /> -->

            <div class="tgmobile__menu" :class="{ 'visible': isMobileMenuVisible }">
              <div class="tgmobile__menu-box">
                <div class="close-btn" @click="closeMobileMenu">
                  <i class="fas fa-times"></i>
                </div>

                <div class="nav-logo">
                  <router-link to="/">
                    <img src="assets/img/logo/logox.png" alt="Logo" />
                  </router-link>
                </div>

                <div class="tgmobile__menu-outer">
                  <ul class="navigation">
                    <template v-for="(item, index) in menuData" :key="index">
                      <li :class="{
      'active': $route.path === item.path,
      'menu-item-has-children': item.children,
      'open': item.isOpen
    }">
                        <router-link v-if="item.path" :to="item.path" @click="closeMobileMenu">{{ item.title
                          }}</router-link>
                        <a v-else href="#" @click.prevent="toggleSubmenu(index)">{{ item.title }}</a>

                        <div v-if="item.children" class="dropdown-btn" @click.stop="toggleSubmenu(index)">
                          <span class="plus-line" :class="{ 'open': item.isOpen }"></span>
                        </div>





                        <transition name="slide">
                          <ul v-if="item.children && item.isOpen" class="sub-menu">
                            <li v-for="(child, childIndex) in item.children" :key="childIndex">
                              <!-- <router-link :to="child.path" @click="closeMobileMenu">{{ child.title }}</router-link> -->
                              <router-link v-if="!child.external" :to="child.path" @click="closeMobileMenu">{{
      child.title }}</router-link>
                              <a v-else :href="child.path" target="_blank" rel="noopener noreferrer">{{ child.title
                                }}</a>
                            </li>
                          </ul>
                        </transition>


                      </li>

                    </template>
                  </ul>
                </div>

                <div class="tgmenu__action tgmenu__action-five d-block d-md-none">
                  <ul class="list-wrap">
                    <li class="header-btn">
                      <a class="btn" href="https://admin-csr.konaweselatankab.go.id" target="_blank">MASUK APP</a>
                    </li>
                  </ul>
                </div>

                <div class="tgmobile__menu-bottom">
                  <div class="contact-info">
                    <ul class="list-wrap">
                      <li><a href="javascript:void(0);">csr@konaweselatankab.go.id</a></li>
                      <li><a href="javascript:void(0);">+123 888 9999</a></li>
                    </ul>
                  </div>
                  <div class="social-links">
                    <ul class="list-wrap">
                      <li><a href="javascript:void(0)"><i class="fab fa-facebook-f"></i></a></li>
                      <li><a href="javascript:void(0)"><i class="fab fa-twitter"></i></a></li>
                      <li><a href="javascript:void(0)"><i class="fab fa-instagram"></i></a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div class="tgmobile__menu-backdrop" :class="{ 'visible': isMobileMenuVisible }" @click="closeMobileMenu">
            </div>
            <!-- End Mobile Menu -->






          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
// import { onMounted } from 'vue' // ✅ Tambahkan ini
// import { ref, watch } from 'vue'
// import MobileMenu from './MobileMenu.vue'
import NavItems from './NavItems.vue'

// const isMobileMenuOpen = ref(false)

// function toggleMobileMenu() {
//   isMobileMenuOpen.value = !isMobileMenuOpen.value
// }

// watch(isMobileMenuOpen, (val) => {
//   document.body.classList.toggle('mobile-menu-visible', val)
// })

export default {
  components: {
    NavItems
  },
  data() {

    return {
      isMobileMenuVisible: false,
      menuData: [
        { title: 'Beranda', path: '/' },
        {
          title: 'Informasi',
          isOpen: false,
          children: [
            { title: 'Berita', path: '/Berita' },
            {
              title: 'Pengumuman',
              external: true,
              path: 'https://konaweselatankab.go.id/agenda_pengumuman/pengumuman/list'
            }
          ]
        },
        { title: 'Kegiatan CSR', path: '/Kegiatancsr' },
        { title: 'Force Majeure', path: '/forcemajeure' },
        {
          title: 'Perusahaan/Mitra',
          isOpen: false,
          children: [
            // { title: 'Data Perusahaan/Mitra', path: '/' },
            { title: 'Registrasi Perusahaan/Mitra', path: '/registerMitracsr' },
          ]
        },
        // { title: 'Data CSR', path: '/dataCSR' },
        //   {
        //   title: 'MASUK APP',
        //   path: 'http://localhost:8080/#/login',
        //   external: true,
        //   isButton: true
        // }


      ].map(item => {
        if (item.children) {
          return { ...item, isOpen: false }
        }
        return item
      })
    }
  },
  watch: {
    $route() {
      this.closeMobileMenu();
    }
  },
  methods: {
    openMobileMenu() {
      this.isMobileMenuVisible = true
      document.body.classList.add('mobile-menu-visible')
    },
    closeMobileMenu() {
      this.isMobileMenuVisible = false;
      document.body.classList.remove('mobile-menu-visible');
      this.menuData.forEach(item => {
        if (item.isOpen) item.isOpen = false;
      });
    },
    toggleSubmenu(index) {
      this.menuData.forEach((item, i) => {
        if (i !== index && item.isOpen) {
          item.isOpen = false
        }
      })
      this.menuData[index].isOpen = !this.menuData[index].isOpen
    },
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    },
  },
  mounted() {
    this.menuData = this.menuData.map(item => ({
      ...item,
      isOpen: false
    }))

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isMobileMenuVisible) {
        this.closeMobileMenu()
      }
    })
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.closeMobileMenu)
  }
}
</script>

<style>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
  padding-top: 0;
  padding-bottom: 0;
}

.slide-enter-to,
.slide-leave-from {
  max-height: 500px;
  opacity: 1;
  padding-top: 10px;
  padding-bottom: 10px;
}

.dropdown-btn .plus-line {
  position: relative;
  display: inline-block;
  width: 12px;
  height: 12px;
  transition: transform 0.3s ease;
}

.dropdown-btn .plus-line:before,
.dropdown-btn .plus-line:after {
  content: '';
  position: absolute;
  background-color: currentColor;
  transition: all 0.3s ease;
}

.dropdown-btn .plus-line:before {
  width: 100%;
  height: 2px;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
}

.dropdown-btn .plus-line:after {
  width: 2px;
  height: 100%;
  left: 50%;
  top: 0;
  transform: translateX(-50%);
}

.dropdown-btn .plus-line.open:after {
  transform: translateX(-50%) rotate(90deg);
  opacity: 0;
}

.sub-menu {
  display: block !important;
  padding-left: 15px;
  will-change: max-height, opacity, padding;
}

.tgmobile__menu-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  visibility: hidden;
}

.tgmobile__menu-wrapper.visible {
  visibility: visible;
}

.tgmobile__menu {
  position: fixed;
  top: 0;
  right: 0;
  width: 300px;
  height: 100vh;
  transform: translateX(100%);
  transition: transform 0.3s ease;
  z-index: 10000;
}

.tgmobile__menu-wrapper.visible .tgmobile__menu {
  transform: translateX(0);
}

.tgmobile__menu-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9998;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.tgmobile__menu-wrapper.visible .tgmobile__menu-backdrop {
  opacity: 1;
  pointer-events: all;
}

body.mobile-menu-visible {
  overflow: hidden;
}
</style>