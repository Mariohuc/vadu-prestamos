"use strict";
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class RedirectIfAuthenticated {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ auth, request, response }, next) {
    /**
     * Verify if we are logged in.
     */
    try {
      await auth.check();
      
      return response.redirect("welcome");
    } catch (e) {
			
		}
		await next();
  }
}

module.exports = RedirectIfAuthenticated;
