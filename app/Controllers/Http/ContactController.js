'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const ubigeo_data = require('ubigeo').include('provincies').include('districts').data
const AuthorizationService = use("App/Utils/AuthorizationService");
const Contact = use("App/Models/Contact");

/**
 * Resourceful controller for interacting with contacts
 */
class ContactController {
  /**
   * Show a list of all contacts.
   * GET contacts
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ auth, view }) {
		const user = await auth.getUser();
		const myContacts = await user
      .contacts()
      .whereNot("reg_status", "*")
			.fetch();
			return view.render("contact.index", { myContacts, ubigeo_data });
  }

  /**
   * Render a form to be used for creating a new contact.
   * GET contacts/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new contact.
   * POST contacts
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ auth, request, response }) {
		const { dni_id, name, surname, gender, address, district, province, department } = request.all();
		const user = await auth.getUser();
		const newContact = await user.contacts().create({ dni_id, name, surname, gender, address, district, province, department, reg_status: 'A' });
		return response.status(201).send(newContact);
  }

  /**
   * Display a single contact.
   * GET contacts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ auth, params, request, response, view }) {}

  /**
   * Render a form to update an existing contact.
   * GET contacts/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update contact details.
   * PUT or PATCH contacts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ auth, params, request, response }) {
		const user = await auth.getUser();
    const { id } = params;
    const contact = await Contact.find(id);
		AuthorizationService.verifyPermissionInContacts(contact, user);
		if (contact.reg_status === "*") {
      return response.status(404).send({ message: "Este recurso no esta disponible" });
		}
    const { name, surname, gender, address, district, province, department } = request.all();
    contact.merge({ name, surname, gender, address, district, province, department });
    await contact.save();
    return response.status(200).send(contact);
  }

  /**
   * Delete a contact with id.
   * DELETE contacts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
	}
}

module.exports = ContactController
