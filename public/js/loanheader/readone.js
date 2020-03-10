var myComponent = {
  data: () => ({
    navegatorCode: 1, // by default
    validLoan: false,
    editedIndex: -1,
    editedLoanMode: false,
    editedItem: Object.assign({}, loan), // <== It's important to do a copy of the object, so they both are independent
    defaultItem: {},
    itemRules: {
      amount: [
        n => !!n || "Monto es requerido",
        n =>
          /^\d{2,5}\.\d{0,2}$/.test(n) || "Debe estar entre: 10.00 a 99999.99"
      ],
      monthly_interest: [
        n => !!n || "Este valor es requerido",
        n => /^0?\.\d{2}$/.test(n) || "Introduzca un valor valido"
      ],
      relationship_borrowers: ["Conocidos", "Parientes", "Esposos", "Solo"],
      loan_status: ["Pendiente", "Cancelado"]
    },
    menuCreationDate: false,
    menuExpirationDate: false,
    /* 	Propiedades usados para los contactos y usuarios deudores (prestatarios) */
    borrowerDialog: false,
    search: "",
    headers: [
      {
        text: "DNI",
        align: "center",
        value: "borrower_contact_id"
      },
      { text: "Nombres", value: "name" },
      { text: "Apellidos", value: "surname" },
      { text: "Acciones", value: "action", sortable: false }
    ],
    loanDetails,
    selectContacts: [],
    validBorrowers: true,
    myContacts: [],
    loadingLoanDetails: false,
    generatedPDFDialog: false,
    PDFblobUrl: null
  }),
  created() {
    this.editedItem.relationship_borrowers = this.editedItem.relationship_borrowers.capitalize();
    this.editedItem.loan_status = this.editedItem.loan_status.capitalize();
    this.defaultItem = Object.assign({}, this.editedItem);
  },
  computed: {
    hint_monthly_interest() {
      return `${parseInt(
        this.editedItem.monthly_interest * 100
      )}% de interes mensual`;
    }
  },
  watch: {
    borrowerDialog(val) {
      if (!val) {
        this.closeBorrowerDialog();
      } else {
        axios
          .get("/getContactsforBorrowers")
          .then(response => {
            this.myContacts = this.filterContacts(
              response.data,
              this.loanDetails
            );
          })
          .catch(error => {
            // handle error
            console.log(error);
          });
      }
    },
    generatedPDFDialog(val) {
      val || this.closePDFDialog();
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
    cancelLoanEdition() {
      this.editedLoanMode = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
      }, 300);
    },

    saveLoan() {
      let editedloan = Object.assign({}, this.editedItem);
      editedloan.relationship_borrowers = editedloan.relationship_borrowers.toLowerCase();
      editedloan.loan_status = editedloan.loan_status.toLowerCase();
      axios
        .patch(`/loanheaders/${editedloan.id}`, editedloan)
        .then(response => {
          this.editedLoanMode = false;
        })
        .catch(error => {
          // handle error
          console.log(error);
        });
    },
    filterContacts(contacts, loanDetails) {
      var filtercontacts = contacts;
      for (let i = 0; i < loanDetails.length; i++) {
        for (let j = 0; j < filtercontacts.length; j++) {
          if (loanDetails[i].borrower_contact_id === filtercontacts[j].dni_id) {
            filtercontacts.splice(j, 1);
            break;
          }
        }
      }
      return filtercontacts;
    },
    editItem(item) {
      this.editedIndex = this.loans.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.borrowerDialog = true;
    },

    deleteItem(item) {
      const index = this.loans.indexOf(item);
      confirm("Are you sure you want to delete this item?") &&
        this.loans.splice(index, 1);
    },

    closeBorrowerDialog() {
      this.borrowerDialog = false;
      this.selectContacts = [];
    },
    saveBorrowers() {
      this.loadingLoanDetails = true;
      axios
        .post("/loandetails", {
          loan_header_id: this.editedItem.id,
          borrower_contacts: this.selectContacts
        })
        .then(response => {
          // arrow function don't have it own 'this' object
          this.loanDetails = response.data;
          this.closeBorrowerDialog();
          setTimeout(() => (this.loadingLoanDetails = false), 1000);
        })
        .catch(error => {
          console.log(error);
        });
    },
    showGeneratedPDF() {
      if (!this.PDFblobUrl) {
        this.generatePdf();
        console.log("Created .... PDF");
      }
      console.log("Show dialog !");
      this.generatedPDFDialog = true;
    },
    generatePdf() {
      var doc = new jsPDF("p", "mm", "a4");
      doc.setProperties({
        title: "Contrato",
        subject: "Info about PDF",
        author: "User",
        keywords: "generated, javascript, axios, vue, adonisjs",
        creator: "VADU"
      });
      doc.setFont("times");
      doc.setFontSize(18);
      var text =
        "CONTRATO DE PRESTAMO";
      // 105: is the middle of 210. 210 is the A4's width
      doc.text(text, 105, 25, { maxWidth: 170, align: "center" });
      doc.setFontSize(12);

      var paragraph = [
        "Conste  por  el  presente  documento  susceptible  a   escritura  pública   a  simple  reconocimiento  de firma y a solicitud  de las partes del contrato que se celebran de una parte: \n\n",
        "PRIMERO.- La prestamista otorga  un crédito de s/1600.00 (mil seiscientos nuevos soles). Quedando pagar en cuotas mensuales de 150 nuevos soles que serán entregados cada 28 del mes. \n",
				"SEGUNDO.- El tiempo de préstamo es de 10 meses a partir de la fecha siendo su vencimiento el 28 de octubre del 2016. \n\n",
				"La prestamista y la prestataria declaran en celebración del presente contrato se someten al presente acuerdo porque han obrado con entera libertad  y suficiente conocimiento de sus derechos que no media dolo ni causa alguna de vicio que  pueda invalidar el presente contrato por el que las partes conformes se ratifican cada uno de sus cláusulas y firman. \n\n"
			];
      doc.text(paragraph, 20, 35, { maxWidth: 170 });
			this.PDFblobUrl = doc.output('datauristring');
    },
    closePDFDialog() {
      this.generatedPDFDialog = false;
    }
  }
};
