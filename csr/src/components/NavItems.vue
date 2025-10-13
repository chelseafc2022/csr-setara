<!-- File: NavItems.vue -->
<template>
  <ul class="navigation">
    <li><router-link to="/">Beranda</router-link></li>

    <!-- <li><router-link to="/berita">Berita</router-link></li> -->

    <li class="menu-item-has-children">
      <a href="javascript:void(0);">Informasi</a>
      <ul class="sub-menu">
        <li><router-link to="/Berita">Berita</router-link></li>
        <li>
          <a href="https://konaweselatankab.go.id/agenda_pengumuman/pengumuman/list" target="_blank"
            rel="noopener noreferrer">
            Pengumuman
          </a>
        </li>
      </ul>
    </li>

    <li><router-link to="/Kegiatancsr">Kegiatan CSR</router-link></li>
    <li><router-link to="/forcemajeure">Force Majeure</router-link></li>
   


    <li class="menu-item-has-children">
      <a href="#">Perusahaan/Mitra</a>
      <ul class="sub-menu">
        <!-- <li><router-link to="/">Data Mitra CSR</router-link></li> -->
        <li><router-link to="/registerMitracsr">Register Mitra CSR</router-link></li>
      </ul>
    </li>

    <!-- <li><router-link to="/forcemajeure">Data CSR</router-link></li> -->



  </ul>

  
</template>
