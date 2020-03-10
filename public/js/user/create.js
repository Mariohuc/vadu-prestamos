var app = new Vue({
  vuetify: new Vuetify(),
  data() {
    return {
			window: {
        width: 0,
        height: 0
      },
      valid: false,
      dni: "",
      dniRules: [
        n => !!n || "DNI es requerido",
        n => /^\d+$/.test(n) || "Introduzca un DNI valido"
      ],
      name: "",
      nameRules: [v => !!v || "Nombre es requerido"],
      lastname: "",
			lastnameRules: [v => !!v || "Apellidos son requeridos"],
			gender: "",
			genderRules: [ g => g !== "" || "Genero es requerido" ],
      password: "",
      passwordRules: [
        v => !!v || "Contraseña es requerida",
        v => (v && v.length >= 4) || "Contraseña debe ser al menos de 4 letras"
      ],
      email: "",
      emailRules: [
        v => !!v || "E-mail es requerido",
        v => /.+@.+\..+/.test(v) || "E-mail debe ser valido"
      ],
      address: "",
      addressRules: [ad => !!ad || "Direccion es requerida"],
      selectDistrict: { code: "default", name: "default" },
      selectDistrictRules: [
        s => s.code !== "default" || "Debe escoger un distrito"
      ],
      selectProvince: { code: "default", name: "default" },
      selectProvinceRules: [
        s => s.code !== "default" || "Debe escoger una provincia"
      ],
      selectDepartment: { code: "default", name: "default" },
      selectDepartmentRules: [
        s => s.code !== "default" || ""
			],
			genders: ["M", "F"],
      departments,
      depProvinces: {},
      proDistricts: {},
      /* ---------------------------------- image properties  ---------------------------------------- */
      cropper: null,
      objectUrl: null,
      previewCropped: null,
      selectedFile: null,
      debouncedUpdatePreview: _.debounce(this.updatePreview, 257),
      rulesPhoto: [
        value =>
          !value ||
          value.size < 2000000 ||
          "Avatar size should be less than 2 MB!"
      ]
    };
	},
  computed: {
    isdepProvincesEmpty() {
      return Object.entries(this.depProvinces).length === 0;
    },
    isproDistrictsEmpty() {
      return Object.entries(this.proDistricts).length === 0;
		},
		centered() {
      return this.window.width >= 960 || false;
    }
	},
	mounted(){
		Vue.nextTick().then(() => {
			NProgress.done();		
    });
	},
	created(){
		window.addEventListener("resize", this.handleResize);
    this.handleResize();
	},
	destroyed() {
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
		handleResize() {
      this.window.width = window.innerWidth;
      this.window.height = window.innerHeight;
    },
    validate() {
      if (this.$refs.form.validate()) {
        this.snackbar = true;
      }
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
    onChangeDepartments() {
      this.selectProvince = { code: "default", name: "default" };
      this.selectDistrict = { code: "default", name: "default" };
      var selected = this.selectDepartment;
      var found = this.departments.find(function(element) {
        if (element.code === selected.code) {
          return element;
        }
        return null;
      });
      if (!!found) {
        this.depProvinces = found.provincies;
        this.proDistricts = {};
      }
    },
    onChangeProvincies() {
      this.selectDistrict = { code: "default", name: "default" };
      var selected = this.selectProvince;
      var found = this.depProvinces.find(element => {
        if (element.code === selected.code) {
          return element;
        }
        return null;
      });
      if (!!found) {
        this.proDistricts = found.districts;
      }
    },
    /* -------------------- methods for manage image and crooping image -------------------- */
    updatePreview(event) {
      console.log("Bananero");
    }
  }
}).$mount("#app");
