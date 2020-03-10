"use strict";

const SessionService = use("App/Utils/SessionService");

class SessionController {
  /**
   * Render the view session.create
   */
  async create({ view }) {
    /**
     * Render the view 'sessions.create'.
     *
     * ref: http://adonisjs.com/docs/4.1/views
     */

    //const newuser = await User.create({ dni_id: 23456789, email: 'elbana@gmail.com', password: '12345', reg_status: 'A' });

    return view.render("session.create");
  }

  async store({ auth, request, response, session }) {
    return SessionService.login(...arguments);
  }

  async delete({ auth, response }) {
    /**
     * Logout the user.
     *
     * ref: http://adonisjs.com/docs/4.1/authentication#_logout
     */
		return SessionService.logout(...arguments);
  }
}

module.exports = SessionController;
