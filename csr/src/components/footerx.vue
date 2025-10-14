<template>

    <!-- footer-area -->
    <footer>
        <div class="footer__area-two">
            <div class="footer__newsletter-two">
                    <div class="container">
                        <div class="footer__newsletter-inner mb-20">
                            <h2 class="title">Tanggung jawab sosial atau corporate social responsibility (CSR)</h2>
                        </div>
                        <div class="footer__newsletter-inner mb-30">
                            <h5 class="titlex">“Tanggung jawab sosial dan lingkungan adalah komitmen perseroan untuk berperan serta dalam pembangunan ekonomi berkelanjutan guna meningkatkan kualitas kehidupan dan lingkungan yang bermanfaat, baik bagi perseroan sendiri, komunitas setempat, maupun masyarakat pada umumnya.”</h5>
                        </div>
                        <div class="footer__newsletter-inner" style="display: flex; justify-content: center;">
                            <router-link to="/registerMitracsr" class="btn">Daftarkan Perusahaan Anda</router-link>
                        </div>
                    </div>
                </div>
            
            <div class="footer__bottom-two">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="copyright-text-two">
                                <p>Copyright © <a href="javascript:void(0);">2025 Kabupaten Konawe Selatan</a> | CSR - SETARA Kab. Konawe Selatan</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </footer>
    <!-- footer-area-end -->

</template>


<script>

import { useStore } from 'vuex'

export default {
data() {
const store = useStore()
const baseURL = store.state.URL_APP

return {
  unit_kerja: store.state.UNIT_KERJA,
  file_path: baseURL + 'uploads/',
  list_foto: [],
 
}
},
mounted() {
 // Inisialisasi Swiper
    new window.Swiper('.brand-active', {
        slidesPerView: 5,
        spaceBetween: 30,
        loop: true,
        autoplay: {
        delay: 2000,
        disableOnInteraction: false,
        },
        breakpoints: {
        320: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
        1024: { slidesPerView: 5 }
        }
    })
},
methods: {

truncateText(text, limit = 50) {
if (!text) return '';
return text.length > limit ? text.substring(0, limit) + '...' : text;
},

cek_active(index) {
  return index === 0 ? 'active' : '';
},


},
}
</script>

<style scoped>
.hero {
padding: 60px 0;
background-color: #f8f9fa;
text-align: center;
}
</style>
