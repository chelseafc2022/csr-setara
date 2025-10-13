<template>
        <header>
            <div id="header-fixed-height"></div>
 
            <div id="sticky-header" class="tg-header__area">
                <div class="container custom-container">
                    <div class="row">
                        <div class="col-12">
                            <div class="tgmenu__wrap">
                                <nav class="tgmenu__nav">
                                    <div class="logo">
                                        <a href="index.html"><img src="assets/img/logo/logox.png" alt="Logo" /></a>
                                    </div>
                                    <div class="tgmenu__navbar-wrap tgmenu__main-menu d-none d-lg-flex">
                                        <ul class="navigation"> 
                                            <li><router-link to="/">Beranda</router-link></li>
                                            <li><router-link to="/Berita">Berita</router-link></li>
                                            <li><router-link to="/Kegiatancsr">Kegiatan CSR</router-link></li>
                                            <li><router-link to="/forcemajeure">Force Majeure</router-link></li>

                                            <li class="menu-item-has-children">
                                                <a href="#">Perusahaan</a>
                                                <ul class="sub-menu">
                                                    <li><router-link to="/">Data Mitra CSR</router-link></li>
                                                    <li><router-link to="/registerMitracsr">Register Mitra CSR</router-link></li> 
                                                </ul>
                                            </li>

                                            <li><router-link to="/Berita">Data CSR</router-link></li>
                                            <li><router-link to="/Berita">Pengaduan</router-link></li>
                                            <!-- <li><router-link to="/Berita">Pedoman</router-link></li> -->
                                            <li><a href="https://jigyasa.iirs.gov.in/Upload_Record/pdf/blank.pdf">Pedoman</a></li>

 

                                        </ul>
                                    </div>
                                    <div class="tgmenu__action d-none d-md-block">
                                        <ul class="list-wrap">
                                             
                                             
                                            <li class="offCanvas-menu" @click="toggleMenu">
                                                <a href="javascript:void(0)" class="menu-tigger">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" fill="none">
                                                        <path d="M0 2C0 0.895431 0.895431 0 2 0C3.10457 0 4 0.895431 4 2C4 3.10457 3.10457 4 2 4C0.895431 4 0 3.10457 0 2Z" fill="currentcolor" />
                                                        <path d="M0 9C0 7.89543 0.895431 7 2 7C3.10457 7 4 7.89543 4 9C4 10.1046 3.10457 11 2 11C0.895431 11 0 10.1046 0 9Z" fill="currentcolor" />
                                                        <path d="M0 16C0 14.8954 0.895431 14 2 14C3.10457 14 4 14.8954 4 16C4 17.1046 3.10457 18 2 18C0.895431 18 0 17.1046 0 16Z" fill="currentcolor" />
                                                        <path d="M7 2C7 0.895431 7.89543 0 9 0C10.1046 0 11 0.895431 11 2C11 3.10457 10.1046 4 9 4C7.89543 4 7 3.10457 7 2Z" fill="currentcolor" />
                                                        <path d="M7 9C7 7.89543 7.89543 7 9 7C10.1046 7 11 7.89543 11 9C11 10.1046 10.1046 11 9 11C7.89543 11 7 10.1046 7 9Z" fill="currentcolor" />
                                                        <path d="M7 16C7 14.8954 7.89543 14 9 14C10.1046 14 11 14.8954 11 16C11 17.1046 10.1046 18 9 18C7.89543 18 7 17.1046 7 16Z" fill="currentcolor" />
                                                        <path d="M14 2C14 0.895431 14.8954 0 16 0C17.1046 0 18 0.895431 18 2C18 3.10457 17.1046 4 16 4C14.8954 4 14 3.10457 14 2Z" fill="currentcolor" />
                                                        <path d="M14 9C14 7.89543 14.8954 7 16 7C17.1046 7 18 7.89543 18 9C18 10.1046 17.1046 11 16 11C14.8954 11 14 10.1046 14 9Z" fill="currentcolor" />
                                                        <path d="M14 16C14 14.8954 14.8954 14 16 14C17.1046 14 18 14.8954 18 16C18 17.1046 17.1046 18 16 18C14.8954 18 14 17.1046 14 16Z" fill="currentcolor" />
                                                    </svg>
                                                </a>
                                            </li>
                                            
                                        </ul>
                                    </div>
                                    <div class="mobile-nav-toggler" @click="toggleMenu">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" fill="none">
                                            <path d="M0 2C0 0.895431 0.895431 0 2 0C3.10457 0 4 0.895431 4 2C4 3.10457 3.10457 4 2 4C0.895431 4 0 3.10457 0 2Z" fill="currentcolor" />
                                            <path d="M0 9C0 7.89543 0.895431 7 2 7C3.10457 7 4 7.89543 4 9C4 10.1046 3.10457 11 2 11C0.895431 11 0 10.1046 0 9Z" fill="currentcolor" />
                                            <path d="M0 16C0 14.8954 0.895431 14 2 14C3.10457 14 4 14.8954 4 16C4 17.1046 3.10457 18 2 18C0.895431 18 0 17.1046 0 16Z" fill="currentcolor" />
                                            <path d="M7 2C7 0.895431 7.89543 0 9 0C10.1046 0 11 0.895431 11 2C11 3.10457 10.1046 4 9 4C7.89543 4 7 3.10457 7 2Z" fill="currentcolor" />
                                            <path d="M7 9C7 7.89543 7.89543 7 9 7C10.1046 7 11 7.89543 11 9C11 10.1046 10.1046 11 9 11C7.89543 11 7 10.1046 7 9Z" fill="currentcolor" />
                                            <path d="M7 16C7 14.8954 7.89543 14 9 14C10.1046 14 11 14.8954 11 16C11 17.1046 10.1046 18 9 18C7.89543 18 7 17.1046 7 16Z" fill="currentcolor" />
                                            <path d="M14 2C14 0.895431 14.8954 0 16 0C17.1046 0 18 0.895431 18 2C18 3.10457 17.1046 4 16 4C14.8954 4 14 3.10457 14 2Z" fill="currentcolor" />
                                            <path d="M14 9C14 7.89543 14.8954 7 16 7C17.1046 7 18 7.89543 18 9C18 10.1046 17.1046 11 16 11C14.8954 11 14 10.1046 14 9Z" fill="currentcolor" />
                                            <path d="M14 16C14 14.8954 14.8954 14 16 14C17.1046 14 18 14.8954 18 16C18 17.1046 17.1046 18 16 18C14.8954 18 14 17.1046 14 16Z" fill="currentcolor" />
                                        </svg>
                                    </div>
                                </nav>
                            </div>
                             
                            <div class="tgmobile__menu">
                                <nav class="tgmobile__menu-box">
                                    <div class="close-btn" @click="toggleMenu"><i class="fas fa-times"></i></div>
                                    <div class="nav-logo">
                                        <a href="index.html"><img src="assets/img/logo/logo.png" alt="Logo" /></a>
                                    </div>
                                    <div class="tgmobile__search">
                                        <form action="#">
                                            <input type="text" placeholder="Search here..." />
                                            <button><i class="fas fa-search"></i></button>
                                        </form>
                                    </div>
                                    <div class="tgmobile__menu-outer">
<ul class="navigation"> 
                                            <li><router-link to="/">Beranda</router-link></li>
                                            <li><router-link to="/Berita">Berita</router-link></li>

                                            <li class="menu-item-has-children">
                                                <a href="#">Profil</a>
                                                <ul class="sub-menu">
                                                    <li><router-link to="/data_pegawai">Data Pegawai</router-link></li>
                                                    <li><router-link to="/tentang">Tentang / Sejarah BKAD</router-link></li>
                                                    <li><router-link to="/tugas_pokok">Tugas Pokok</router-link></li>
                                                    <li><router-link to="/struktur_organisasi">Struktur Organisasi</router-link></li>
                                                    <li><router-link to="/visi_misi">Visi Misi</router-link></li> 
                                                </ul>
                                            </li>
                                            <li class="menu-item-has-children">
                                                <a href="#">Unit Kerja</a>
                                                <ul class="sub-menu" >
                                                    <li><router-link to="/sekretariat">Sekretariat</router-link></li>
                                                    <li><router-link to="/bid_akutansi">Bidang Akutansi</router-link></li>
                                                    <li><router-link to="/bid_anggaran">Bidang Anggaran</router-link></li>
                                                    <li><router-link to="/bid_aset">Bidang Aset</router-link></li>
                                                    <li><router-link to="/bid_bud">Bidang BUD</router-link></li> 
                                                </ul>
                                            </li> 

                                            <li class="menu-item-has-children">
                                                <a href="#">Peraturan</a>
                                                <ul class="sub-menu" >
                                                    <li><router-link to="/perpres">Peraturan Presiden</router-link></li>
                                                    <li><router-link to="/permen">Peraturan Mentri</router-link></li>
                                                    <li><router-link to="/perbup">Peraturan Bupati</router-link></li>
                                                    <li><router-link to="/perda">Peraturan Daerah</router-link></li> 
                                                </ul>
                                            </li>
                                            <li class="menu-item-has-children">
                                                <a href="#">Data & Dokumen</a>
                                                <ul class="sub-menu" >
                                                    <li><router-link to="/pengelolaan_hbo">Pengolahan Hibah Dan Bansos</router-link></li>
                                                    <li><router-link to="/sop">Standar Operasional Prosedur</router-link></li>
                                                    <li><router-link to="/transparansi_anggaran">Transparansi Anggaran Daerah</router-link></li>
                                                    <!-- <li><router-link to="/dokumen_opd">Dokumen Lainnya</router-link></li>  -->
                                                        
                                                </ul>
                                            </li>

                                                

                                            <li class="menu-item-has-children">
                                                <a href="#">Galeri</a>
                                                <ul class="sub-menu">
                                                    <li><router-link to="/gallery_foto">Foto</router-link></li>
                                                    <li><router-link to="/gallery_video">Video</router-link></li> 
                                                </ul>
                                            </li>

                                                                                            <li class="menu-item-has-children">
                                                <a href="#">Sipola - Konsel</a>
                                                <ul class="sub-menu">
                                                    <li class="menu-item-has-children">
                                                        <a href="#">Realisasi Belanja OPD</a>
                                                        <ul class="sub-menu">
                                                            <li><router-link to="/realisasi_anggaran_2024">2024</router-link></li> 
                                                            <li><router-link to="/realisasi_anggaran_2025">2025</router-link></li>  
                                                        </ul>
                                                    </li>
                                                    <li class="menu-item-has-children">
                                                        <a href="#">Realisasi PAD</a>
                                                        <ul class="sub-menu">
                                                            <li><router-link to="/realisasi_pad_2024">2024</router-link></li> 
                                                            <li><router-link to="/realisasi_pad_2025">2025</router-link></li>  
                                                        </ul>
                                                    </li>  
                                                </ul>
                                            </li>

                                        </ul>
                                         
                                    </div>
                                    <div class="tgmobile__menu-bottom">
                                        <div class="contact-info">
                                            <ul class="list-wrap">
                                                <li><a href="/">.</a></li>
                                            </ul>
                                        </div>
 
                                    </div>
                                </nav>
                            </div>
                            <div class="tgmobile__menu-backdrop"></div>
                             
                        </div>
                    </div>
                </div>
            </div>
          
            
            
        </header>
        
        


        <!-- <header class="tg-header__style-two">
            <div class="tg-header__inner-wrap">
                <div class="tg-header__logo-wrap">
                    <div class="logo">
                        <a href="index.html"><img src="assets/img/logo/logox.png" alt="Logo" /></a>
                    </div>
                </div>
                <div class="tg-header__right-side">


                    <div id="sticky-header" class="tg-header__area tg-header__area-two">
                        <div class="row">
                            <div class="col-12">
                                <div class="tgmenu__wrap">
                                    <nav class="tgmenu__nav">
                                        <div class="logo d-none">
                                            <a href="index.html"><img src="assets/img/logo/logox.png" alt="Logo" /></a>
                                        </div>
                                        <div class="tgmenu__navbar-wrap tgmenu__main-menu d-none d-lg-flex"
                                            ref="desktopMenu">
                                            <ul class="navigation"> 
                                                <li><router-link to="/">Beranda</router-link></li>
                                                <li><router-link to="/Berita">Berita</router-link></li>

                                                <li class="active menu-item-has-children">
                                                    <a href="#">Profil</a>
                                                    <ul class="sub-menu">
                                                        <li><router-link to="/data_pegawai">Data Pegawai</router-link></li>
                                                        <li><router-link to="/tentang">Tentang / Sejarah BKAD</router-link></li>
                                                        <li><router-link to="/tugas_pokok">Tugas Pokok</router-link></li>
                                                        <li><router-link to="/struktur_organisasi">Struktur Organisasi</router-link></li>
                                                        <li><router-link to="/visi_misi">Visi Misi</router-link></li> 
                                                    </ul>
                                                </li>
                                                <li class="menu-item-has-children">
                                                    <a href="#">Unit Kerja</a>
                                                    <ul class="sub-menu" >
                                                        <li><router-link to="/sekretariat">Sekretariat</router-link></li>
                                                        <li><router-link to="/bid_akutansi">Bidang Akutansi</router-link></li>
                                                        <li><router-link to="/bid_anggaran">Bidang Anggaran</router-link></li>
                                                        <li><router-link to="/bid_aset">Bidang Aset</router-link></li>
                                                        <li><router-link to="/bid_bud">Bidang BUD</router-link></li> 
                                                    </ul>
                                                </li> 

                                                <li class="menu-item-has-children">
                                                    <a href="#">Peraturan</a>
                                                    <ul class="sub-menu" >
                                                        <li><router-link to="/perpres">Peraturan Presiden</router-link></li>
                                                        <li><router-link to="/permen">Peraturan Mentri</router-link></li>
                                                        <li><router-link to="/perbup">Peraturan Bupati</router-link></li>
                                                        <li><router-link to="/perda">Peraturan Daerah</router-link></li> 
                                                    </ul>
                                                </li>
                                                <li class="menu-item-has-children">
                                                    <a href="#">Data & Dokumen</a>
                                                    <ul class="sub-menu" >
                                                        <li><router-link to="/pengelolaan_hbo">Pengolahan Hibah Dan Bansos</router-link></li>
                                                        <li><router-link to="/sop">Standar Operasional Prosedur</router-link></li>
                                                        <li><router-link to="/transparansi_anggaran">Transparansi Anggaran Daerah</router-link></li>
                                                        <li><router-link to="/dokumen_opd">Dokumen Lainnya</router-link></li> 
                                                         
                                                    </ul>
                                                </li>

                                                 

                                                <li class="menu-item-has-children">
                                                    <a href="#">Galeri</a>
                                                    <ul class="sub-menu">
                                                        <li><router-link to="/gallery_foto">Foto</router-link></li>
                                                        <li><router-link to="/gallery_video">Video</router-link></li> 
                                                    </ul>
                                                </li>

                                                                                                <li class="menu-item-has-children">
                                                    <a href="#">Sipola - Konsel</a>
                                                    <ul class="sub-menu">
                                                        <li class="menu-item-has-children">
                                                            <a href="#">Realisasi Belanja OPD</a>
                                                            <ul class="sub-menu">
                                                                <li><router-link to="/realisasi_anggaran_2024">2024</router-link></li> 
                                                                <li><router-link to="/realisasi_anggaran_2025">2025</router-link></li>  
                                                            </ul>
                                                        </li>
                                                        <li class="menu-item-has-children">
                                                            <a href="#">Realisasi PAD</a>
                                                            <ul class="sub-menu">
                                                                <li><router-link to="/realisasi_pad_2024">2024</router-link></li> 
                                                                <li><router-link to="/realisasi_pad_2025">2025</router-link></li>  
                                                            </ul>
                                                        </li>  
                                                    </ul>
                                                </li>

                                            </ul>
                                        </div>
                                        <div class="tgmenu__action tgmenu__action-two d-none d-md-block">
                                            <ul class="list-wrap">


                                                <li class="offCanvas-menu" @click="toggleMenu">
                                                    <a href="javascript:void(0)" class="menu-tigger">
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18"
                                                            fill="none">
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
                                                    </a>
                                                </li>


                                            </ul>
                                        </div>
                                        <div class="mobile-nav-toggler mobile-nav-toggler-two" @click="toggleMenu">
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
                                
                                <div class="tgmobile__menu">
                                    <nav class="tgmobile__menu-box">
                                        <div class="close-btn" @click="toggleMenu"><i class="fas fa-times"></i></div>
                                        <div class="nav-logo">
                                            <a href="index.html"><img src="assets/img/logo/logo.png" alt="Logo" /></a>
                                        </div>
                                        <div class="tgmobile__search">
                                            <form action="#">
                                                <input type="text" placeholder="Search here..." />
                                                <button><i class="fas fa-search"></i></button>
                                            </form>
                                        </div>
                                        <div class="tgmobile__menu-outer">
                                            <div v-html="mobileMenu"></div>
                                            
                                             
                                        </div>
                                        <div class="tgmobile__menu-bottom">
                                            <div class="contact-info">
                                                <ul class="list-wrap">
                                                    <li><a href="mailto:info@apexa.com">info@apexa.com</a></li>
                                                    <li><a href="tel:0123456789">+123 888 9999</a></li>
                                                </ul>
                                            </div>
                                            <div class="social-links">
                                                <ul class="list-wrap">
                                                    <li>
                                                        <a href="javascript:void(0)"><i
                                                                class="fab fa-facebook-f"></i></a>
                                                    </li>
                                                    <li>
                                                        <a href="javascript:void(0)"><i class="fab fa-twitter"></i></a>
                                                    </li>
                                                    <li>
                                                        <a href="javascript:void(0)"><i
                                                                class="fab fa-instagram"></i></a>
                                                    </li>
                                                    <li>
                                                        <a href="javascript:void(0)"><i
                                                                class="fab fa-linkedin-in"></i></a>
                                                    </li>
                                                    <li>
                                                        <a href="javascript:void(0)"><i class="fab fa-youtube"></i></a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </nav>
                                </div>
                                <div class="tgmobile__menu-backdrop"></div>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="search__popup">
                <div class="container">
                    <div class="row">
                        <div class="col-12">
                            <div class="search__wrapper">
                                <div class="search__close">
                                    <button type="button" class="search-close-btn">
                                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path d="M17 1L1 17" stroke="currentColor" stroke-width="1.5"
                                                stroke-linecap="round" stroke-linejoin="round"></path>
                                            <path d="M1 1L17 17" stroke="currentColor" stroke-width="1.5"
                                                stroke-linecap="round" stroke-linejoin="round"></path>
                                        </svg>
                                    </button>
                                </div>
                                <div class="search__form">
                                    <form action="#">
                                        <div class="search__input">
                                            <input class="search-input-field" type="text"
                                                placeholder="Type keywords here" />
                                            <span class="search-focus-border"></span>
                                            <button>
                                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M9.55 18.1C14.272 18.1 18.1 14.272 18.1 9.55C18.1 4.82797 14.272 1 9.55 1C4.82797 1 1 4.82797 1 9.55C1 14.272 4.82797 18.1 9.55 18.1Z"
                                                        stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                                                        stroke-linejoin="round"></path>
                                                    <path d="M19.0002 19.0002L17.2002 17.2002" stroke="currentColor"
                                                        stroke-width="1.5" stroke-linecap="round"
                                                        stroke-linejoin="round"></path>
                                                </svg>
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="search-popup-overlay"></div>
 
            <div class="offCanvas__info">
                <div class="offCanvas__close-icon menu-close">
                    <button><i class="far fa-window-close"></i></button>
                </div>
                <div class="offCanvas__logo mb-30">
                    <a href="index.html"><img src="assets/img/logo/logo.png" alt="Logo" /></a>
                </div>
                <div class="offCanvas__side-info mb-30">
                    <div class="contact-list mb-30">
                        <h4>Office Address</h4>
                        <p>
                            123/A, Miranda City Likaoli <br />
                            Prikano, Dope
                        </p>
                    </div>
                    <div class="contact-list mb-30">
                        <h4>Phone Number</h4>
                        <p>+0989 7876 9865 9</p>
                        <p>+(090) 8765 86543 85</p>
                    </div>
                    <div class="contact-list mb-30">
                        <h4>Email Address</h4>
                        <p>info@example.com</p>
                        <p>example.mail@hum.com</p>
                    </div>
                </div>
                <div class="offCanvas__social-icon mt-30">
                    <a href="javascript:void(0)"><i class="fab fa-facebook-f"></i></a>
                    <a href="javascript:void(0)"><i class="fab fa-twitter"></i></a>
                    <a href="javascript:void(0)"><i class="fab fa-google-plus-g"></i></a>
                    <a href="javascript:void(0)"><i class="fab fa-instagram"></i></a>
                </div>
            </div>
            <div class="offCanvas__overly"></div>
             
        </header> -->
</template>

<script>
export default { 
    data() {
        return {
            URL_APP: 'https://server-web.konaweselatankab.go.id/',
            UPLOADS: 'https://server-web.konaweselatankab.go.id/uploads/',
            mobileMenu:"",
             
        };
    },
    methods: {
        toggleMenu() {
            this.$store.state.isVisible = !this.$store.state.isVisible;
        },
    },
    
    mounted() {
        // this.mobileMenu = this.$refs.desktopMenu.innerHTML;
    },
}
</script>