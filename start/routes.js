"use strict";

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");
const User = use("App/Models/User");

Route.group(() => {
	Route.get("/", async ({ response }) => { /* just for now, it's temporary  */
		return response.redirect("login");
	});
  Route.get("login", "SessionController.create");
  Route.post("login", "SessionController.store");
  Route.get("register", "UserController.create");
  Route.post("register", "UserController.store");
}).middleware(["guest"]);

Route.group(() => {
  Route.get("welcome", "WelcomeController.index");
	Route.resource("loanheaders", "LoanHeaderController");
	Route.resource("loandetails", "LoanDetailController");
  Route.resource("contacts", "ContactController");
  Route.get("getContactsforBorrowers", "LoanHeaderController.getContactsforBorrowers");
  Route.get("logout", "SessionController.delete"); // According to Harminder Virk, it must be GET
  Route.get("users/:id/profilepicture", "ImageController.getUserProfilePicture");
}).middleware(["auth"]);
