<template>
  <div class="bgku">
    <div class="row items-center">
      <div class="col-11 col-md-3 fixed-center">

        <!-- <q-card class="my-card bgku">
            <br>
            <q-img src="img/LOGO.png" />
          <q-card-section>
            <hr />
            <br>
            <form>
              <q-input outlined square :dense="true" class="bg-white" placeholder="Username">
                <template v-slot:prepend>
                  <q-icon name="account_circle" />
                </template>
              </q-input>
              <br />

              <q-input
                outlined
                square
                :dense="true"
                class="bg-white"
                placeholder="Password"
                type="password"
              >
                <template v-slot:prepend>
                  <q-icon name="vpn_key" />
                </template>
              </q-input>
              <br />

              <q-btn push class="full-width" color="primary" icon-right="send" label="LOGIN" to="/" />
            </form>
            <br>
            <hr>
            
          </q-card-section>
          <div class="transAbu">
              <span class="h_fotter_title">Copyright : Diskominfo & DKPSDM Kab. Konawe Selatan</span>
          </div>
        </q-card> -->

        <div class="putihTrans formLogin shadow-5">
          <br>
            <q-img src="img/card.png" />
            <hr />
            <br>



            <div v-if="errorMessage">
              <div  class="alertku shadow-2">
                <strong>Warning!</strong> {{ errorMessage }}.

              </div>
              <br>
            </div>

            <form @submit.prevent="btn_login()">
              <q-input v-model="user.username" outlined square :dense="true" class="bg-white" placeholder="Username">
                <template v-slot:prepend>
                  <q-icon name="account_circle" />
                </template>
              </q-input>
              <br />

              <q-input
                 v-model="user.password"
                outlined
                square
                :dense="true"
                class="bg-white"
                placeholder="Password"
                type="password"
              >
                <template v-slot:prepend>
                  <q-icon name="vpn_key" />
                </template>
              </q-input>
              <br />

              <q-btn type="submit" push class="full-width main1" icon-right="send" label="LOGIN" style="color:white"/>
            </form>
            <br>
            <hr>
            <div class="transAbu">
              <span class="h_fotter_title">Copyright : CSR-SETARA Kab. Konawe Selatan</span>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>










<script>

// const ADD_URL = URL_APP + "api/v1/rincian_obyek/";

  import Joi from "joi";
  const schema = Joi.object().keys({
    username: Joi.string().regex(/^[a-zA-Z0-9_]*$/).min(3).max(13).required(),
    password: Joi.string().min(6).required(),
  });

  import { Notify  } from 'quasar'

  export default {
    name: "monev_login",
    data : function(){
      return {
          testtttttt : [],
          errorMessage: '',
          user : {
            username : "",
            password : ""
          },

          url : {
            LOGIN_URL : this.$store.state.url.URL_APP + "auth/login",
          }
      }
    },
    watch: {
      user: {
          handler() {
              this.errorMessage = "";
          },
          deep: true
      }
    },
    methods: {
      // go_register : function(){
      //   alert(App.data().sesseee);
      //   this.displayed = 'block';
      // },
      btn_login : function(){

        

        this.errorMessage = '';
        if(this.validUser()){
          this.$store.commit("shoWLoading");
          // this.$q.notify("hi");

          // this.$store.commit("shoWNotify", 'Kiken', 'primary', 'timer');
          const body = {
            username : this.user.username,
            password : this.user.password
          }
          fetch(this.url.LOGIN_URL, {
            method : 'POST',
            headers : {
              'content-type' : 'application/json',
            },
            body : JSON.stringify(body),
          }).then((response) => {
            
            // console.log(response);
            
                if (response.ok) {
                    return response.json();
                    this.$store.commit("shoWLoading");
                }

                return response.json().then(error => {
                    throw new Error(error.message);
                    this.$store.commit("shoWLoading");
                });
            })
            .then((result) => {
              console.log("=============================");
              // console.log(result);
              // menyimpan token yang tergenerate dari server
              localStorage.token = result.token;
              localStorage.profile = JSON.stringify(result.profile);
              // cek semua key yang ada
              const profile = result.profile;

                // Cari field db_csrkonsel, baik langsung maupun di dalam nested "profile"
                let tipe = null;
                if (profile.db_csrkonsel) {
                  tipe = profile.db_csrkonsel;
                } else if (profile.profile && profile.profile.db_csrkonsel) {
                  tipe = profile.profile.db_csrkonsel;
                }

                localStorage.tipe = tipe;

              setTimeout(() => {
                this.$store.commit("hideLoading")
                // cek role dari profile

                this.$store.commit("hideLoading");
                if (tipe === "1" || tipe === "5" ) {
                  this.$router.push("/dashboard-admin");
                } else if (tipe === "4") {
                  this.$router.push("/dashboard-perusahaan");
                } else {
                  // fallback kalau role lain
                  this.$router.push("/dashboard-perusahaan");
                }
                // location.reload();
              }, 1000);
            })
            .catch(error => {
              setTimeout(() => {
                this.$store.commit("hideLoading")
                this.errorMessage = error.message;
              }, 1000);
            });;
        }



      },
      validUser: function(){
        const result = Joi.validate(this.user, schema);
        if (result.error === null) {
          return true;
        }
        if (result.error.message.includes("username")) {
          this.errorMessage = "Username tidak valid";
        } else {
          this.errorMessage = "Username tidak valid2";
        }
        return false;
      },



      testGetData : function(){
        // axios.get('https://api.coindesk.com/v1/bpi/currentprice.json')
        // .then(response => {
        //   console.log(response);
        //   this.testtttttt = response
        // })
        // .catch(error => {
        //   alert(error)
        //   console.log(error);
        // });




         axios
      .get('https://api.coindesk.com/v1/bpi/currentprice.json')
      .then(response => (this.testtttttt = response))






      }

    },
    mounted : function(){

      this.testGetData()
      

    },
  };
</script>