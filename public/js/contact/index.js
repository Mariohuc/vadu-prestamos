var myComponent = {
  data: () => ({
    navegatorCode: 3,
    dialog: false,
    search: "",
    headers: [
      { text: "DNI",  value: "dni_id", align: "center"},
      { text: "Nombres", value: "name" },
      { text: "Apellidos", value: "surname" },
      { text: "Departamento", value: "department" },
      { text: "Provincia", value: "province" },
      { text: "Acciones", value: "action", sortable: false }
    ],
    myContacts, /* List of contacts for datatable */
		editedIndex: -1, /* User select an contact from the table which only can be watched within a dialog */
		isEditMode: false,  /* If the user click on Edit button (isEditMode'll be true), the viewed contact can be edited.  */
    validContact: true,
    editedItem: {
			dni_id: "",
			name: "",
			surname: "",
			gender: "",
			address: "",
			selectDistrict: { code: "nothing", name: "nothing" },
			selectProvince: { code: "nothing", name: "nothing" },
			selectDepartment: { code: "default", name: "default" },
		},
    defaultItem: {
      dni_id: "",
			name: "",
			surname: "",
			gender: "",
			address: "",
			selectDistrict: { code: "nothing", name: "nothing" },
			selectProvince: { code: "nothing", name: "nothing" },
			selectDepartment: { code: "default", name: "default" },
    },
    itemRules: {
      dni_id: [
        n => !!n || "DNI es requerido",
        n => /^\d+$/.test(n) || "Introduzca un DNI valido"
      ],
      name: [v => !!v || "Nombre es requerido"],
			surname: [v => !!v || "Apellidos son requeridos"],
			gender: [ g => g !== "" || "Genero es requerido" ],
      address: [ad => !!ad || "Direccion es requerida"],
      selectDistrict: [
        s => s.code !== "default" || "Debe escoger un distrito"
      ],
      selectProvince: [
        s => s.code !== "default" || "Debe escoger una provincia"
      ],
      selectDepartment: [
        s => s.code !== "default" || "Debe escoger una region"
      ]
		},
		genders: ["M", "F"],
    departments,
    depProvinces: {},
    proDistricts: {}
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo contacto" : "Mi contacto";
		},
		/* It's empty selector of provinces */
		isdepProvincesEmpty() {
      return Object.entries(this.depProvinces).length === 0;
		},
		/* It's empty selector of districts */
    isproDistrictsEmpty() {
      return Object.entries(this.proDistricts).length === 0;
		},
  },
  watch: {
    dialog(val) {
      val || this.close();
    }
  },
  methods: {
    setCreationDateofLoan() {
      this.editedItem.interest_delivery_day = this.editedItem.creation_date.substr(
        8,
        2
      );
      this.menuCreationDate = false;
    },
    viewItem(item) {
			this.editedIndex = this.myContacts.indexOf(item);
			console.log(this.editedIndex);
			Object.assign(this.editedItem, item);
      this.dialog = true;
    },
		editItem(){
			this.isEditMode = true;
			/* Arrow functions are amazing ! */
			var found_dep = this.departments.find( element => element.name === this.editedItem.department || null );
      if (!!found_dep) {
				this.editedItem.selectDepartment = { code: found_dep.code , name: found_dep.name };
				this.depProvinces = found_dep.provincies;
				var found_pro = this.depProvinces.find( element => element.name === this.editedItem.province || null );
				if (!!found_pro){
					this.editedItem.selectProvince = { code: found_pro.code , name: found_pro.name };
					this.proDistricts = found_pro.districts;
					var found_dis = this.proDistricts.find( element => element.name === this.editedItem.district || null );
					if(!!found_dis){
						this.editedItem.selectDistrict = { code: found_dis.code , name: found_dis.name };
					}
				}
      }
			this.$refs.form.resetValidation(); // reset validation
			console.log(this.editedIndex);
		},
    deleteItem(item) {
      const index = this.myContacts.indexOf(item);
      confirm("Are you sure you want to delete this item?") &&
        this.myContacts.splice(index, 1);
    },
		
    close() {
      this.dialog = false;
			this.editedItem = Object.assign({}, this.defaultItem);
			this.$refs.form.resetValidation(); // reset validation
			this.editedIndex = -1;
			this.isEditMode = false;
    },

    saveItem() {
			var contactToSave = Object.assign({}, this.editedItem);
			contactToSave.district = contactToSave.selectDistrict.name;
			contactToSave.province = contactToSave.selectProvince.name; 
			contactToSave.department = contactToSave.selectDepartment.name;

      if (this.editedIndex > -1) {
				axios
          .patch(`/contacts/${contactToSave.dni_id}`, contactToSave)
          .then(response => {
						// arrow function don't have it own 'this' object
						Object.assign(this.myContacts[this.editedIndex], response.data);
						this.close();
          })
          .catch(error => {
            // handle error
            console.log(error);
          });
      } else {
        axios
          .post("/contacts", contactToSave)
          .then(response => {
            // arrow function don't have it own 'this' object
						this.myContacts.push(response.data);
						this.close();
          })
          .catch(error => {
            // handle error
            console.log(error);
          });
      }
      
		},
		/* Event is actived when selector of departaments change */
		onChangeDepartments() {
      this.editedItem.selectProvince = { code: "default", name: "default" };
      this.editedItem.selectDistrict = { code: "default", name: "default" };
      var selected = this.editedItem.selectDepartment;
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
		/* Event is actived when selector of provinces change */
    onChangeProvincies() {
      this.editedItem.selectDistrict = { code: "default", name: "default" };
      var selected = this.editedItem.selectProvince;
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
  }
};
