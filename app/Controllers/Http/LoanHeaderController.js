"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
/**
 * Resourceful controller for interacting with loanheaders
 */
const AuthorizationService = use("App/Utils/AuthorizationService");
const Loan = use("App/Models/LoanHeader");
const Database = use('Database');

class LoanHeaderController {
  /**
   * Show a list of all loanheaders.
   * GET loanheaders
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ auth, request, response, view }) {
    const userloggedin = await auth.getUser();
    const loans = await userloggedin
      .loans()
      .whereNot("reg_status", "*")
      .fetch();
    return view.render("loanheader.index", { loans });
  }

  /**
   * Render a form to be used for creating a new loanheader.
   * GET loanheaders/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, response, view }) {}

  /**
   * Create/save a new loanheader.
   * POST loanheaders
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ auth, request, response }) {
    const {
      amount,
      monthly_interest,
      creation_date,
      interest_delivery_day,
      expiration_date,
      relationship_borrowers
    } = request.all();
    const user = await auth.getUser();
    const newLoan = await user.loans().create({
      amount,
      monthly_interest,
      creation_date,
      interest_delivery_day,
      expiration_date,
      loan_status: "pendiente",
      relationship_borrowers,
      reg_status: "A"
    });
    return response.status(201).send(newLoan);
  }

  /**
   * Display a single loanheader.
   * GET loanheaders/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ auth, params, request, response, view }) {
    const user = await auth.getUser();
    const { id } = params;
    const loan = await Loan.find(id);
    AuthorizationService.verifyPermissionInLoans(loan, user);
    if (loan.reg_status === "*") {
      return response.status(404).send({ message: "Este recurso no esta disponible" });
    }
    const loanDetails = await loan
			.loansDetails()
			.select("loan_details.id","loan_details.borrower_contact_id","contacts.name","contacts.surname","loan_details.reg_status")
      .whereNot("loan_details.reg_status", "*")
      .innerJoin(
        "contacts",
        "loan_details.borrower_contact_id",
        "contacts.dni_id"
      )
      .fetch();
   
    return view.render("loanheader.readone", { loan, loanDetails });
  }

  /**
   * Render a form to update an existing loanheader.
   * GET loanheaders/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {}

  /**
   * Update loanheader details.
   * PUT or PATCH loanheaders/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ auth, params, request, response }) {
    const user = await auth.getUser();
    const { id } = params;
    const loan = await Loan.find(id);
    AuthorizationService.verifyPermissionInLoans(loan, user);
    const {
      amount,
      monthly_interest,
      creation_date,
      interest_delivery_day,
      expiration_date,
      relationship_borrowers,
      loan_status
    } = request.all();
    loan.merge({
      amount,
      monthly_interest,
      creation_date,
      interest_delivery_day,
      expiration_date,
      relationship_borrowers,
      loan_status
    });
    await loan.save();
    return response.status(200).send(loan);
  }

  /**
   * Delete a loanheader with id.
   * DELETE loanheaders/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {
    const user = await auth.getUser();
    const { id } = params;
    const loan = await Loan.find(id);
    AuthorizationService.verifyPermissionInLoans(loan, user);
    loan.merge({ reg_status: "*" });
    await loan.save();
    return response.status(200).send(loan);
	}
	
	async getContactsforBorrowers({ auth, response}){
		const user = await auth.getUser();	
		const myContacts = await user
			.contacts()
			.select("dni_id", Database.raw("name || ', ' || surname as fullname"))
			.whereNot("reg_status", "*")
			.fetch();
		
		return response.status(200).send(myContacts);	
		
	}
}

module.exports = LoanHeaderController;
