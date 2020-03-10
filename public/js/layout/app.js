var app = new Vue({
  vuetify: new Vuetify({
    lang: {
      current: "es"
    }
  }),
  data() {
    return {
      overlay: true,
      drawer: true,
      selectedNavigationItem: -1,
      navigatorItems: [
        { title: "Inicio", icon: "mdi-view-dashboard", href: "/welcome" },
        {
          title: "Mis Prestamos",
          icon: "mdi-cash-multiple",
          href: "/loanheaders"
        },
        { title: "Mis deudas", icon: "mdi-handshake", href: "#" },
        { title: "Mis contactos", icon: "mdi-contacts", href: "/contacts" },
        { title: "Acerca de", icon: "mdi-help-box", href: "#" }
      ],
      appbarOptions: [
        { name: "Mi perfil", icon: "mdi-account-box",  href: "#" },
        { name: "Cerrar sesion", icon: "mdi-logout", href: "/logout" }
      ],
      navigatorColor: "#4c0220",
      appBarColor: "#4c0220",
      left: true,
      miniVariant: false,
      expandOnHover: false,
      background: false,
      userloggedin,
      profile_photo: null
    };
  },
  components: {
    "main-content": myComponent
  },
  mounted() {
		if( this.$refs.main_content.navegatorCode > -1 ){
			this.selectedNavigationItem = this.$refs.main_content.navegatorCode;
		}   

    axios
      .get(`/users/${userloggedin.dni_id}/profilepicture`, {
        responseType: "blob"
      })
      .then(response => {
        var reader = new window.FileReader();
        reader.readAsDataURL(response.data);
        reader.onload = () => {
          this.profile_photo = reader.result; //imageDataUrl;
        };
      })
      .catch(error => {
        console.log(error);
      });
    Vue.nextTick().then(() => {		
			NProgress.done();		
      setTimeout(() => {
        this.overlay = false;
			}, 500);
			
    });
  },
  methods: {}
}).$mount("#app");
