"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with users
 */
const ubigeo_data = require('ubigeo').include('provincies').include('districts').data
const Helpers = use('Helpers');
const SessionService = use("App/Utils/SessionService");
const User = use("App/Models/User");

class UserController {
  /**
   * Show a list of all users.
   * GET users
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, view }) {}

  /**
   * Render a form to be used for creating a new user.
   * GET users/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, response, view }) {
		const user_type = "user";
    return view.render("user.create", { ubigeo_data, user_type });
  }

  /**
   * Create/save a new user.
   * POST users
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ auth, request, response, session }) {
		const { dni_id, name, surname, gender, email, password, address, district, province, department, user_type } = request.all();
		const profilePic = request.file('profile_photo', { types: ['image'], size: '2mb'});
		if( profilePic !== null ){
			await profilePic.move(Helpers.tmpPath('profile_pictures'), {
				name: `${dni_id}-profile-picture.jpg`,
				overwrite: true
			});
		
			if (!profilePic.moved()) {
				throw new Error('No se pudo importar la foto.');
			}
			await User.create({ dni_id, name, surname, gender, email, password, address, district, province, department, profile_picture:`${dni_id}-profile-picture.jpg`, user_type, reg_status: 'A' });
		}else{
			await User.create({ dni_id, name, surname, gender, email, password, address, district, province, department, user_type, reg_status: 'A' });
		};
		return SessionService.login(...arguments);
	}

  /**
   * Display a single user.
   * GET users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {}

  /**
   * Render a form to update an existing user.
   * GET users/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {}

  /**
   * Update user details.
   * PUT or PATCH users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {}

  /**
   * Delete a user with id.
   * DELETE users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {}
}

module.exports = UserController;
