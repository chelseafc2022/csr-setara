<template >
    <div id="app">
        <!-- <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </nav> -->


        <!--Preloader-end -->
        <!-- Scroll-top -->

        <!-- Scroll-top-end-->
        <!-- header-area -->

        <!-- <headerx></headerx> -->
        <MainNavbar />


        <!-- header-area-end -->
        <!-- main-area -->
        <main class="fix">
            <!-- slider-area -->
           <router-view/>
 
 
 
        </main>
        <!-- main-area-end -->
        <!-- footer-area -->

        <footerx></footerx>
        
 
        <!-- footer-area-end -->
        <!-- <router-view/> -->
    </div>

</template>

<style scoped> 
/* Container carousel */
.carousel-container {
  background-color: #ecf6fa !important;
  max-width: 100%;
  margin: auto;
  position: relative;
  overflow: hidden;
  border-radius: 0px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.carousel-wrapper {
    background-color: #ecf6fa !important;
  width: 100%;
  overflow: hidden;
}

.carousel-track {
  display: flex;
  width: 100%;
}

.carousel-slide {
  flex: 0 0 100%;
  max-width: 100%;
}

.ratio-box {
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 */
  background-color: #ecf6fa;
  overflow: hidden;
  margin: 0px 0px;
}

.ratio-box img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* Controls */
.controls {
  position: absolute;
  top: 50%;
  width: 100%;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  transform: translateY(-50%);
}

.controls button {
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s;
}

.controls button:hover {
  background-color: rgba(0, 0, 0, 0.8);
}

.text-box {
  /* width: 320px; */
  /* height: 4em; */
  /* overflow: hidden; */
  /* display: -webkit-box; */
  /* -webkit-line-clamp: 3; Jumlah baris maksimal */
  /* -webkit-box-orient: vertical; */
    max-width: 100%;               /* Biar tidak melebihi parent */
  width: 100%;                   /* Full lebar kontainer */
  box-sizing: border-box;        /* Padding dihitung dalam width */
  padding: 1em;
  font-size: 1rem;               /* Responsive font */
  word-wrap: break-word;         /* Bungkus kata panjang */
  overflow-wrap: break-word;     /* Modern wrap */
  line-height: 1.5;
    display: -webkit-box;
   
   
  border-radius: 8px;



}
.image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background-color: #f5f5f5;
  position: relative;
  border-radius: 10px;
  padding: 10px;
}

.responsive-img {
  max-width: 100%;
  max-height: 100%;
  transition: transform 0.3s ease;
  object-fit: contain;
}

/* Efek hover */
.image-container:hover .responsive-img {
  transform: scale(1.05);
}  
</style>




<script>
import MainNavbar from './components/MainNavbar.vue'


import UMUM from './library/umum.js';

export default {
  name: 'App',
  components: {
    MainNavbar
  },

  data() {
    return {
      UMUM:UMUM,
      msg: 'CSR Kab. Konawe Selatan',
      isVisible: false,
       
      currentIndex: 0,
      images: [
        "https://server-web.konaweselatankab.go.id/uploads/1740462547777.png",
        "https://picsum.photos/id/1016/800/450",
        "https://picsum.photos/id/1018/800/450"
      ],
      intervalId: null,
      backgroundColor: "#ffffff",
      imageRef: null,
      listSlider:[],
      listBerita:[],


    }
  },
  methods: { 


  },
  mounted() { 


    document.title = this.msg;

 

  },
  beforeUnmount() {
    // this.stopAutoplay();

  }

}
</script>
