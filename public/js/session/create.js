var app = new Vue({
  vuetify: new Vuetify({
    icons: {
      iconfont: "mdi" // default - only for display purposes
    }
  }),
  data() {
    return {
      colors: [
        "indigo",
        "warning",
        "success",
        "gray",
      ],
      slides: [
        {
          title: "Bienvenido a Prestamos Rapiditos",
          description:
            "Una aplicacion para facilitar la gestion de los prestamos que realizas con tus familiares, amigos y conocidos en del dia a dia."
        },
        {
          title: "Administra tus prestamos",
          description: "Acceda rapidamente a sus lista de prestamos."
        },
        {
          title: "Administra tus contactos",
          description:
            "Puedes agregar varios contactos y utilizarlos en tus prestamos."
        },
        {
          title: "Genera documentos facilmente",
          description:
            "Genera un documento de prestamo en PDF las veces que quieras."
        }
      ],
      valid: true,
      dni: "",
      dniRules: [
        n => !!n || "DNI es requerido",
        n => /^\d+$/.test(n) || "Ingrese un DNI valido"
      ],
      password: "",
      passwordRules: [
        v => !!v || "Contraseña es requerida",
        v => (v && v.length >= 4) || "Contraseña debe ser al menos de 4 letras"
      ]
    };
  },
  methods: {}
}).$mount("#app");
