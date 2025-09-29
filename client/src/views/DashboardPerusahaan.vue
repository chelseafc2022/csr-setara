<template>
  <div class="about" style="padding:15px">
    <q-card bordered class="my-card">
      <!-- Header -->
      <q-card-section class="main2 text-white">
        <div class="text-h6 h_titleHead">Informasi Perusahaan</div>
      </q-card-section>

      <q-separator dark inset />

      <!-- Profil Perusahaan + Widget -->
      <q-card-section class="biruSangatmudaGrad">
        <div class="row q-col-gutter-md items-start">

          <!-- Logo Perusahaan -->
          <div class="col-12 col-md-2 flex flex-center">
            <q-avatar size="180px" square>
              <img 
                :src="mitra?.file_name 
                  ? `${baseURL}/uploads/logo/${mitra.file_name}` 
                  : '/img/icons/logo_konsel.png'" 
                alt="Logo Perusahaan" 
              />
            </q-avatar>
          </div>

          <!-- Informasi + Widget -->
          <div class="col-12 col-md-10 column">

            <!-- Informasi Perusahaan -->
            <div class="q-mb-md">
              <div class="text-h6 text-bold q-mb-sm">{{mitra?.perusahaan_nama}}</div>
              <div class="row items-center q-gutter-lg">
                <div class="row items-center col-auto">
                  <q-icon name="person" size="16px" class="q-mr-xs" />
                  <span><b>PIC:</b> {{mitra?.pic_nama}}</span>
                </div>
                <div class="row items-center col-auto">
                  <q-icon name="email" size="16px" class="q-mr-xs" />
                  <span><b>Email:</b> {{mitra?.perusahaan_email}}</span>
                </div>
                <div class="row items-center col-auto">
                  <q-icon name="phone" size="16px" class="q-mr-xs" />
                  <span><b>Telp:</b> {{mitra?.perusahaan_telp}}</span>
                </div>
                <div class="row items-center col-auto">
                  <q-icon name="place" size="16px" class="q-mr-xs" />
                  <span><b>Alamat:</b> {{mitra?.perusahaan_alamat}}</span>
                </div>
              </div>
            </div>

            <!-- Widget Status -->
            <div class="row q-col-gutter-md">
              <div class="col-6 col-md-3">
                <div class="row shadow-3 frWidgetSub" style="min-height:80px">
                  <div class="col-4 frWidgetSub1 text-center widgetdashboardTerimaIcon row items-center justify-center">
                    <q-icon name="check_circle_outline" size="28px" color="white" />
                  </div>
                  <div class="col-8 frWidgetSub2 widgetdashboardTerimaNilai">
                    <span class="frWidgetText1">Diterima</span><br>
                    <span class="frWidgetText2">{{ widgetStatus.diterima }}</span>
                  </div>
                </div>
              </div>

              <div class="col-6 col-md-3">
                <div class="row shadow-3 frWidgetSub" style="min-height:80px">
                  <div class="col-4 frWidgetSub1 text-center widgetdashboardTolakIcon row items-center justify-center">
                    <q-icon name="block" size="28px" color="white" />
                  </div>
                  <div class="col-8 frWidgetSub2 widgetdashboardTolakNilai">
                    <span class="frWidgetText1">Ditolak</span><br>
                    <span class="frWidgetText2">{{ widgetStatus.ditolak }}</span>
                  </div>
                </div>
              </div>

              <div class="col-6 col-md-3">
                <div class="row shadow-3 frWidgetSub" style="min-height:80px">
                  <div class="col-4 frWidgetSub1 text-center widgetdashboardProsesIcon row items-center justify-center">
                    <q-icon name="hourglass_top" size="28px" color="white" />
                  </div>
                  <div class="col-8 frWidgetSub2 widgetdashboardProsesNilai">
                    <span class="frWidgetText1">Proses</span><br>
                    <span class="frWidgetText2">{{ widgetStatus.diproses }}</span>
                  </div>
                </div>
              </div>

              <div class="col-6 col-md-3">
                <div class="row shadow-3 frWidgetSub" style="min-height:80px">
                  <div class="col-4 frWidgetSub1 text-center main1x row items-center justify-center">
                    <q-icon name="pending_actions" size="28px" color="white" />
                  </div>
                  <div class="col-8 frWidgetSub2 main1">
                    <span class="frWidgetText1">Pengajuan</span><br>
                    <span class="frWidgetText2">{{ widgetStatus.total_pengajuan }}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div class="row">
          <div class="col-12 col-md-6 padding1-5">
            <div class="frameChart shadow-5">
              <div id="chartPieCSR" style="width:100%; height:400px;"></div>
            </div>
          </div>
          <div class="col-12 col-md-6 padding1-5">
            <div class="frameChart shadow-5">
              <div id="chartByBidangCSR" style="width:100%; height:400px;"></div>
            </div>
          </div>
        </div>
      </q-card-section>
      <q-card-section class="biruSangatmudaGrad">


      </q-card-section>
    </q-card>


  </div>
</template>

<script>
export default {
  data() {
    return {
      bidangCSRChart: [],  // data dari backend
      bidangCSR: [],
      mitra: null,
      tipe: null,
      perusahaan: null,
      indikator: {
        pengajuan: 12,
        diterima: 7,
        ditolak: 3,
        proses: 2
      },

      widgetStatus: {
        total_pengajuan: 0,
        diterima: 0,
        ditolak: 0,
        diproses: 0
      },
      
    }
  },
  mounted() {
    const get_profile = JSON.parse(localStorage.profile);

    this.tipe = Number(get_profile.profile.db_csrkonsel);

    this.mitra = {
      id: get_profile._id,
      nama: get_profile.profile.nama,
      username: get_profile.username,
      email: get_profile.email,
      telp: get_profile.profile.telp,
      alamat: get_profile.profile.alamat,
      pic: get_profile.profile.pic,
      file_name: get_profile.profile.file_name // logo perusahaan
    };

    this.getMitra(get_profile._id);


    this.loadWidgetAndChart();
  },
  methods: {

    

    async loadWidgetAndChart() {
    try {
      // Ambil data widget dari backend
      const res = await fetch(this.$store.state.url.DASHBOARD + "statusPengajuan", {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "authorization": "kikensbatara " + localStorage.token
        },
        body: JSON.stringify({ users_id: this.mitra.id })
      });

      const data = await res.json();

      if (data.data) {
        // Update widgetStatus
        this.widgetStatus = data.data;
      }

      // Setelah data widget tersedia, render pie chart
      this.chartPieCSR();

    } catch (err) {
      console.error('Gagal ambil data widget:', err);
    }
  },

    // Ambil jumlah pengajuan untuk widget
    getWidgetStatus(users_id) {
      fetch(this.$store.state.url.DASHBOARD + "statusPengajuan", {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "authorization": "kikensbatara " + localStorage.token
        },
        body: JSON.stringify({ users_id })
      })
      .then(res => res.json())
      .then(res => {
        if(res.data) {
          this.widgetStatus.total_pengajuan = res.data.total_pengajuan;
          this.widgetStatus.diterima = res.data.diterima;
          this.widgetStatus.ditolak = res.data.ditolak;
          this.widgetStatus.diproses = res.data.diproses;
        }
      })
      .catch(err => console.error('Gagal ambil data widget:', err));
    },

    getMitra(userId) {
      fetch(this.$store.state.url.DATA_MITRA + "viewByUser", {
        method: 'POST',
        headers: {
          "content-type": "application/json",
          authorization: "kikensbatara " + localStorage.token
        },
        body: JSON.stringify({ users_id: userId })
      })
      .then(res => res.json())
      .then(res => {
        if (res.data) {
          // kalau backend return array
          this.mitra = Array.isArray(res.data) ? res.data[0] : res.data;
          // panggil widget status pakai users_id dari mitra
      this.getWidgetStatus(this.mitra.users_id || userId);
      this.getBidangCSR();
        }
      })
      .catch(err => {
        console.error('Gagal ambil data perusahaan:', err);
      });
    },
    chartPieCSR() {
  Highcharts.chart('chartPieCSR', {
    chart: { type: 'pie', backgroundColor: 'transparent' },
    title: { text: 'Status Pengajuan Force Majeure' },
    tooltip: { pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>' },
    plotOptions: {
      pie: { 
        allowPointSelect: true, 
        cursor: 'pointer', 
        dataLabels: { enabled: false }, 
        showInLegend: true 
      }
    },
    series: [{
      name: 'Persentase',
      colorByPoint: true,
      data: [
       
        { name: 'Diterima', y: this.widgetStatus.diterima, color: '#43a047' },
        { name: 'Ditolak', y: this.widgetStatus.ditolak, color: '#e53935' },
        { name: 'Proses', y: this.widgetStatus.diproses, color: '#ffb300' }
      ]
    }]
  });
},
getBidangCSR() {
  const users_id = this.mitra.users_id;
  console.log('users_id dikirim ke backend:', users_id); // harus ada value
  fetch(this.$store.state.url.DASHBOARD + "bidangCSR", {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      authorization: "kikensbatara " + localStorage.token
    },
    body: JSON.stringify({ users_id })
  })
  .then(res => res.json())
  .then(res => {
    console.log("Data dari backend bidangCSR:", res.data);
    if(res.data) {
      this.bidangCSR = res.data;
      this.chartByBidangCSR(); // panggil chart
    }
  })
  .catch(err => console.error(err));
},

chartByBidangCSR() {
  if (!this.bidangCSR || this.bidangCSR.length === 0) return;

  Highcharts.chart('chartByBidangCSR', {
    chart: { type: 'column', backgroundColor: 'transparent' },
    title: { text: 'Pengajuan Berdasarkan Bidang CSR' },
    xAxis: {
      categories: this.bidangCSR.map(b => b.nama_bidang), // <-- ganti nama_bidang -> uraian
      crosshair: true
    },
    yAxis: {
      min: 0,
      title: { text: 'Jumlah Pengajuan' }
    },
    tooltip: {
      shared: true,
      valueSuffix: ' pengajuan'
    },
    plotOptions: {
      column: { colorByPoint: true }
    },
    series: [{
      name: 'Jumlah Pengajuan',
      data: this.bidangCSR.map(b => b.total_pengajuan), 
      color: '#1e88e5'
    }]
  });
},


  }
}
</script>
