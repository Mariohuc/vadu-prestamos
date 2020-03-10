'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const AuthorizationService = use("App/Utils/AuthorizationService");
const Loan = use("App/Models/LoanHeader");
/**
 * Resourceful controller for interacting with loandetails
 */
class LoanDetailController {
  /**
   * Show a list of all loandetails.
   * GET loandetails
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ auth, request, response, view }) {
		
  }

  /**
   * Render a form to be used for creating a new loandetail.
   * GET loandetails/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {}

  /**
   * Create/save a new loandetail.
   * POST loandetails
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ auth, request, response }) {
		/* borrower_contacts is a array of objects */
		const { loan_header_id, borrower_contacts } = request.all();
		const user = await auth.getUser();
		const loan = await Loan.find(loan_header_id);
		AuthorizationService.verifyPermissionInLoans(loan, user);
		if (loan.reg_status === "*") {
      return response.status(404).send({ message: "Este recurso no esta disponible" });
    }
		if( !borrower_contacts || borrower_contacts.length === 0 ){
			return response.status(404).send({ message: "No se han enviado contactos" });
		}
		for(let i=0; i < borrower_contacts.length; i++){
			await loan.loansDetails().create({ borrower_contact_id: borrower_contacts[i].dni_id , reg_status: "A"});
		}
		const loanDetails = await loan.loansDetails()
			.select("loan_details.id","loan_details.borrower_contact_id","contacts.name","contacts.surname","loan_details.reg_status")	
			.whereNot("loan_details.reg_status", "*")
			.innerJoin(
				"contacts",
				"loan_details.borrower_contact_id",
				"contacts.dni_id"
			)
			.fetch();
		return response.status(201).send(loanDetails);
  }

  /**
   * Display a single loandetail.
   * GET loandetails/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing loandetail.
   * GET loandetails/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update loandetail details.
   * PUT or PATCH loandetails/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a loandetail with id.
   * DELETE loandetails/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = LoanDetailController
