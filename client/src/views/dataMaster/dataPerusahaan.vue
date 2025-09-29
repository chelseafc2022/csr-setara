<template>
  <div class="about" style="padding:15px">
    <q-card bordered class="my-card">
      <q-card-section class="main2 text-white">
        <div class="row">
          <div class="col-12 col-md-6">
            <div class="text-h6 h_titleHead">Data Mitra / Perusahaan</div>
            <!-- <div class="text-subtitle2">Program/Kegiatan</div> -->
          </div>
          <div class="col-12 col-md-2"></div>
          <div class="col-12 col-md-4">
            <div class="row">
              <q-input v-model="cari_value" @keyup="cari_data()" outlined square :dense="true" class="bg-white" style="width:90%"/>
              <q-btn disable glossy class="main1" @click="mdl_add = true" dense flat icon="add" style="width:10%">
                  <q-tooltip content-class="bg-cyan-9" content-style="font-size: 13px">
                    Click untuk menambah data
                  </q-tooltip>
              </q-btn>
            </div>

          </div>
        </div>
      </q-card-section>

      <q-separator dark inset />


      <q-card-section>

        <hr class="hrpagin">


          <div class="row">
            <div class="col-12">
              <span class="h_lable">Bidang Usaha</span>
              <select v-model="filterku.master_bidang_usaha" @change="getView()" class="bg-white">
                <option value="">-- SEMUA BIDANG --</option>
                <option v-for="data in list_bidang" :key="data.id" :value="data.id">
                  🔹 {{ data.uraian }}
                </option>
              </select>
            </div>
          </div>


          <hr class="hrpagin2">


        <div class="tbl_responsive">
          <!-- =================================================== KONTENT =========================================================== -->
            <table width="100%">
              <tr class="h_table_head main1 text-white ">
                <th width="5%" class="text-center">No</th>
                <th width="25%">Nama Perusahaan</th>
                <th width="15%">Bidang Usaha</th>
                <th width="15%">Email Perusahaan</th>
                <th width="10%">No Telp.</th>
                <th width="25%">Alamat</th>
                <!-- <th width="30%">Keterangan</th> -->
                <!-- <th width="10%"></th> -->
              </tr>
              <tr class="h_table_body" v-for="(data, index) in list_data" :key="data.id+'-'+index">
                  <td class="text-center">{{indexing(index+1)}}.</td>
                  <td>{{data.nama}}
                    <div class="h_nip text-blue cursor-pointer" @click="lihatPIC(data.users_id)">
                      Penanggung Jawab (PIC)
                    </div>
                  </td>
                  <td>{{data.bidang_usaha}}</td>
                  <td>{{data.email}}</td>
                  <td>{{data.hp}}</td>
                  <td>{{data.alamat}}</td>
                  <!-- <td class="text-center">
                      <q-btn-group>
                      <q-btn @click="mdl_hapus = true, selectData(data)" glossy color="negative" icon="delete_forever" class="tbl_btn">
                          <q-tooltip content-class="bg-red" content-style="font-size: 13px">
                          Click untuk menghapus data ini
                          </q-tooltip>
                      </q-btn>

                      <q-btn @click="selectData(data), mdl_edit = true" glossy color="orange" icon="create" class="tbl_btn">
                        <q-tooltip content-class="bg-orange-9" content-style="font-size: 13px">
                          Click untuk mengubah data ini
                        </q-tooltip>
                      </q-btn>
                      </q-btn-group>
                  </td> -->
              </tr>

            </table>

          <!-- =================================================== KONTENT =========================================================== -->
        </div>
        <hr class="hrpagin">
        <br>
        <div class="flex flex-center">
          <q-pagination
              @click="getView()"
              v-model="page_first"
              :max="page_last"
              :max-pages="4"
              color="grey-6"

              :direction-links="true"
              :boundary-links="true"
              icon-first="skip_previous"
              icon-last="skip_next"
              icon-prev="fast_rewind"
              icon-next="fast_forward"
          >
          </q-pagination>
        </div>




        <br>
      </q-card-section>
    </q-card>





          <!-- =================================================== MODAL =========================================================== -->


            <!-- ================================================= MODAL TAMBAH ================================================ -->
              <q-dialog v-model="mdl_add" persistent>
                <q-card class="mdl-md">
                  <q-card-section class="main1">
                    <div class="text-h6 h_modalhead">Tambah Perusahaan</div>
                  </q-card-section>

                  <form @submit.prevent="addData()">
                    <q-card-section class="q-pt-none">
                      <br>
                      <div class="row">

                        <!-- Nama Perusahaan -->
                        <div class="col-12 col-md-12 frame_cari">
                          <span class="h_lable">Nama Perusahaan</span>
                          <q-input v-model="form.nama" outlined square :dense="true" class="bg-white margin_btn" />
                        </div>

                        <!-- Bidang Usaha -->
                        <div class="col-12 col-md-12 frame_cari">
                          <span class="h_lable">Bidang Usaha</span>
                          <q-select 
                            v-model="form.bidang_usaha_id" 
                            :options="list_bidang" 
                            option-value="id" 
                            option-label="uraian"
                            emit-value map-options 
                            outlined square :dense="true" 
                            class="bg-white margin_btn" 
                            placeholder="Pilih Bidang Usaha"
                          />
                        </div>

                        <!-- Email -->
                        <div class="col-12 col-md-12 frame_cari">
                          <span class="h_lable">Email</span>
                          <q-input v-model="form.email" type="email" outlined square :dense="true" class="bg-white margin_btn" />
                        </div>

                        <!-- HP -->
                        <div class="col-12 col-md-12 frame_cari">
                          <span class="h_lable">No. HP</span>
                          <q-input v-model="form.hp" type="tel" outlined square :dense="true" class="bg-white margin_btn" />
                        </div>

                        <!-- Alamat -->
                        <div class="col-12 col-md-12 frame_cari">
                          <span class="h_lable">Alamat</span>
                          <q-input v-model="form.alamat" type="textarea" outlined square :dense="true" class="bg-white margin_btn" />
                        </div>

                      </div>
                    </q-card-section>

                    <q-card-actions class="bg-grey-4 mdl-footer" align="right">
                      <q-btn :loading="btn_add" color="primary" type="submit" label="Simpan" />
                      <q-btn label="Batal" color="negative" v-close-popup />
                    </q-card-actions>
                  </form>
                </q-card>
              </q-dialog>
              <!-- ================================================= MODAL TAMBAH ================================================ -->

                <!-- ================================================= MODAL EDIT ================================================ -->
                <q-dialog v-model="mdl_edit" persistent>
                  <q-card class="mdl-md">
                    <q-card-section class="bg-orange">
                      <div class="text-h6 h_modalhead">Edit Perusahaan</div>
                    </q-card-section>

                    <form @submit.prevent="editData()">
                      <q-card-section class="q-pt-none">
                        <br>
                        <div class="row">

                          <!-- Nama Perusahaan -->
                          <div class="col-12 col-md-12 frame_cari">
                            <span class="h_lable">Nama Perusahaan</span>
                            <q-input v-model="form.nama" outlined square :dense="true" class="bg-white margin_btn" />
                          </div>

                          <!-- Bidang Usaha -->
                          <div class="col-12 col-md-12 frame_cari">
                            <span class="h_lable">Bidang Usaha</span>
                            <q-select 
                              v-model="form.bidang_usaha_id" 
                              :options="list_bidang" 
                              option-value="id" 
                              option-label="uraian"
                              emit-value map-options 
                              outlined square :dense="true" 
                              class="bg-white margin_btn" 
                              placeholder="Pilih Bidang Usaha"
                            />
                          </div>

                          <!-- Email -->
                          <div class="col-12 col-md-12 frame_cari">
                            <span class="h_lable">Email</span>
                            <q-input v-model="form.email" type="email" outlined square :dense="true" class="bg-white margin_btn" />
                          </div>

                          <!-- HP -->
                          <div class="col-12 col-md-12 frame_cari">
                            <span class="h_lable">No. HP</span>
                            <q-input v-model="form.hp" type="tel" outlined square :dense="true" class="bg-white margin_btn" />
                          </div>

                          <!-- Alamat -->
                          <div class="col-12 col-md-12 frame_cari">
                            <span class="h_lable">Alamat</span>
                            <q-input v-model="form.alamat" type="textarea" outlined square :dense="true" class="bg-white margin_btn" />
                          </div>

                        </div>
                      </q-card-section>

                      <q-card-actions class="bg-grey-4 mdl-footer" align="right">
                        <q-btn :loading="btn_edit" color="primary" type="submit" label="Simpan" />
                        <q-btn label="Batal" color="negative" v-close-popup />
                      </q-card-actions>
                    </form>
                  </q-card>
                </q-dialog>
                <!-- ================================================= MODAL EDIT ================================================ -->

            <!-- ================================================ MODAL HAPUS ================================================ -->
              <q-dialog v-model="mdl_hapus" persistent>
                  <q-card class="mdl-sm ">
                  <q-card-section class="q-pt-none text-center orageGrad">
                      <form @submit.prevent="removeData">
                          <br>
                          <img src="img/alert.png" alt="" width="75"> <br>
                          <span class="h_notifikasi">APAKAH ANDA YAKIN INGIN MENGHAPUS DATA INI??</span>
                          <input type="submit" style="position: absolute; left: -9999px"/>
                          <br>
                          <br>

                          <q-btn label="Batal" size="sm" color="negative"  v-close-popup/>
                          &nbsp;
                          <q-btn type="submit" label="Hapus" size="sm" color="primary" v-close-popup/>

                      </form>
                  </q-card-section>
                  </q-card>
              </q-dialog>

            <!-- ================================================ MODAL HAPUS ================================================ -->

         <!-- ======================= MODAL DETAIL PIC ======================= -->
          <q-dialog v-model="mdl_pic" persistent>
            <q-card class="q-pa-md" style="max-width: 480px; border-radius: 18px; overflow: hidden;">
              
              <!-- Header dengan gradient -->
              <q-card-section class="text-center text-white" style="background: linear-gradient(135deg, #1976D2, #42A5F5);">
                <q-avatar size="100px" class="q-mb-sm shadow-2" style="border: 3px solid white;">
                  <img v-if="pic_data?.foto" :src="pic_data.foto" alt="Foto PIC" />
                  <q-icon v-else name="person" size="80px" color="white" />
                </q-avatar>
                <div class="text-h6">{{ pic_data?.nama }}</div>
                <div class="text-subtitle2">{{ pic_data?.jabatan }}</div>
              </q-card-section>

              <!-- Body dengan background abu muda -->
              <q-card-section class="bg-grey-2">
                <div class="q-gutter-md">
                  <q-card flat bordered class="q-pa-sm row items-center">
                    <q-icon name="email" size="22px" class="q-mr-sm text-primary" />
                    <span class="text-body2">{{ pic_data?.email || '-' }}</span>
                  </q-card>
                  <q-card flat bordered class="q-pa-sm row items-center">
                    <q-icon name="phone" size="22px" class="q-mr-sm text-green" />
                    <span class="text-body2">{{ pic_data?.hp || '-' }}</span>
                  </q-card>
                  <q-card flat bordered class="q-pa-sm row items-center">
                    <q-icon name="badge" size="22px" class="q-mr-sm text-indigo" />
                    <span class="text-body2">Username: {{ pic_data?.username }}</span>
                  </q-card>
                </div>
              </q-card-section>

              <!-- Footer -->
              <q-card-actions align="right" class="bg-grey-3">
                <q-btn label="Tutup" flat color="negative" v-close-popup />
              </q-card-actions>
            </q-card>
          </q-dialog>
          <!-- ======================= MODAL DETAIL PIC ======================= -->




          <!-- =================================================== MODAL =========================================================== -->




  </div>
</template>
  
  
  <script>
  
  
  export default {
    data() {
      return {
  
        form: {
            id: null,
            nama: '',
            bidang_usaha_id: '',
            email: '',
            hp: '',
            alamat: ''
          },

        filterku: {
          master_bidang_usaha: ''  // filter pakai bidang
        },
        mdl_pic: false,
        pic_data: null,

        list_bidang : [],

      

        tipeku: null,

  
  
       
        list_data : [],
  
        page_first: 1,
        page_last: 0,
        page_limit : 10,
        cari_value: "",
        cek_load_data : true,
  
        mdl_add: false,
        mdl_edit: false,
        mdl_hapus : false,
        btn_add: false,
      }
    },
    methods: {

      lihatPIC(users_id) {
          fetch(this.$store.state.url.DATA_MITRA + "viewPIC", {
            method: "POST",
            headers: {
              "content-type": "application/json",
              authorization: "kikensbatara " + localStorage.token
            },
            body: JSON.stringify({ users_id })
          })
            .then(res => res.json())
            .then(res_data => {
              if (res_data.success) {
                this.pic_data = res_data.data;
                this.mdl_pic = true;
              } else {
                this.$q.notify({ type: "negative", message: res_data.message });
              }
            })
            .catch(err => {
              console.error(err);
              this.$q.notify({ type: "negative", message: "Gagal ambil data PIC" });
            });
        },

      getBidang() {
        fetch(this.$store.state.url.DATA_MITRA + "viewBidang", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            authorization: "kikensbatara " + localStorage.token
          },
          body: JSON.stringify({})
        })
          .then(res => res.json())
          .then(res_data => {
            console.log("📌 hasil bidang:", res_data); // debug
            this.list_bidang = res_data.data || [];
          });
      },

  
      getView() {
          fetch(this.$store.state.url.DATA_MITRA + "view", {
            method: "POST",
            headers: {
              "content-type": "application/json",
              authorization: "kikensbatara " + localStorage.token
            },
            body: JSON.stringify({
              page_limit: this.page_limit,
              data_ke: this.data_ke,
              cari_value: this.cari_value,
              master_bidang_usaha: this.filterku.master_bidang_usaha 
            })
          })
            .then(res => res.json())
            .then(res_data => {
              this.list_data = res_data.data;
              this.jml_data = res_data.jml_data;
              this.total_data = res_data.total_data;
            });
        },
  
  
      // addData : function() {
      //   fetch(this.$store.state.url.DATA_MITRA + "addData", {
      //       method: "POST",
      //       headers: {
      //         "content-type": "application/json",
      //         authorization: "kikensbatara " + localStorage.token
      //       },
      //       body: JSON.stringify(this.form)
      //   }).then(res_data => {
      //       this.Notify('Sukses Menambah Data', 'primary', 'check_circle_outline');
      //       this.getView();
      //   });
      // },
  
  
      editData : function(){
        fetch(this.$store.state.url.URL_DM_BID + "editDataForce", {
            method: "POST",
            headers: {
              "content-type": "application/json",
              authorization: "kikensbatara " + localStorage.token
            },
            body: JSON.stringify(this.form)
        }).then(res_data => {
            this.Notify('Sukses Merubah Data', 'warning', 'check_circle_outline');
            this.getView();
        });
      },
  
      removeData : function(E){
        fetch(this.$store.state.url.URL_DM_BID + "removeDataForce", {
            method: "POST",
            headers: {
              "content-type": "application/json",
              authorization: "kikensbatara " + localStorage.token
            },
            body: JSON.stringify({id : this.form.id})
        }).then(res_data => {
            this.Notify('Sukses Menghapus Data', 'negative', 'check_circle_outline');
            this.getView();
        });
  
      },
  
      selectData : function(data){

        console.log(data);
          this.form.id = data.id;
          this.form.uraian = data.uraian;
      },
  
  
    
      // ====================================== PAGINATE ====================================
          Notify : function(message, positive, icon){
            this.$q.notify({
              message: message,
              color: positive,
              icon: icon,
              position : 'top',
              timeout: 500,
            })
          },
          btn_prev : function(){
              this.cek_load_data = true;
              if(this.page_first>1){
                  this.page_first--
              }else{
                  this.page_first = 1;
              }
              this.getView();
          },
  
          btn_next : function(){
              if(this.page_first >= this.page_last){
                  this.page_first == this.page_last
              }else{
                  this.page_first++;
              }
              this.getView();
          },
  
          cari_data : function(){
              this.page_first = 1;
              this.getView();
          },

            indexing : function(index){
                var idx = ((this.page_first-1)*this.page_limit)+index
                return idx
            },
  
  
      // ====================================== PAGINATE ====================================
  
  
    },
  
    mounted () {
      this.getView();
      this.getBidang();

    },
  }
  </script>
  
  
  
  
   