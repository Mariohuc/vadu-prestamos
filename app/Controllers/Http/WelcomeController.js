"use strict";
const User = use("App/Models/User");
const Helpers = use('Helpers');

class WelcomeController {
  /**
   * Render the view session.create
   */
  async index({ auth, view }) {
		await auth.getUser();
    return view.render("dashboard.welcome");
  }
  async create({ view }) {}

  async store({ auth, request, response, session }) {}

  async delete({ auth, response }) {
    /**
     * Logout the user.
     *
     * ref: http://adonisjs.com/docs/4.1/authentication#_logout
     */
  }
}

module.exports = WelcomeController;
