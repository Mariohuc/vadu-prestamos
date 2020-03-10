var myComponent = {
  data: () => ({
    navegatorCode: 1,
    dialog: false,
    search: "",
    headers: [
      {
        text: "Monto prestado",
        align: "center",
        value: "amount"
      },
      { text: "Interes mensual", value: "monthly_interest", align: "center" },
      { text: "Fecha creacion", value: "creation_date", align: "center" },
      {
        text: "Dia de entrega mensual",
        value: "interest_delivery_day",
        align: "center"
      },
      {
        text: "Fecha de vencimiento",
        value: "expiration_date",
        align: "center"
      },
      { text: "Acciones", value: "action", sortable: false }
    ],
    loans,
    validLoan: false,
    editedItem: {
      amount: "0.00",
      monthly_interest: "0.00",
      creation_date: new Date().toISOString().substr(0, 10),
      interest_delivery_day: new Date().toISOString().substr(8, 2), // 8 starting point, 2 number of characters
      expiration_date: new Date().toISOString().substr(0, 10),
      relationship_borrowers: "Conocidos"
    },
    defaultItem: {
      amount: "0.00",
      monthly_interest: "0.00",
      creation_date: new Date().toISOString().substr(0, 10),
      interest_delivery_day: new Date().toISOString().substr(8, 2),
      expiration_date: new Date().toISOString().substr(0, 10),
      relationship_borrowers: "Conocidos"
    },
    itemRules: {
      amount: [
        n => !!n || "Monto es requerido",
        n => /^\d+\.\d{0,2}$/.test(n) || "Introduzca un monto valido"
      ],
      monthly_interest: [
        n => !!n || "Este valor es requerido",
        n => /^0?\.\d{2}$/.test(n) || "Introduzca un valor valido"
      ],
      relationship_borrowers: ["Conocidos", "Parientes", "Esposos", "Solo"]
    },
    menuCreationDate: false, // son para controlar la aparicion de los dialog de fechas
    menuExpirationDate: false
  }),
  computed: {
    hint_monthly_interest() {
      return `${parseInt(this.editedItem.monthly_interest * 100)}% de interes mensual`;
    }
  },
  watch: {
    dialog(val) {
      val || this.close();
    }
  },
  methods: {
    setCreationDateofLoan() {
      this.editedItem.interest_delivery_day = this.editedItem.creation_date.substr( 8, 2);
      this.menuCreationDate = false;
    },

    deleteItem(item) {
      const index = this.loans.indexOf(item);
      confirm("Are you sure you want to delete this item?") &&
        this.loans.splice(index, 1);
    },

    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
			}, 300);
			this.$refs.form.resetValidation(); // reset validation
    },

    save() {
      var newloan = Object.assign({}, this.editedItem);
      newloan.relationship_borrowers = newloan.relationship_borrowers.toLowerCase();
      axios
        .post("/loanheaders", newloan)
        .then(response => {
          // arrow function don't have it own 'this' object
          // handle success
          console.log(response);
          this.loans.push(response.data);
        })
        .catch(error => {
          // handle error
          console.log(error);
        });

      this.close();
    }
  }
};
