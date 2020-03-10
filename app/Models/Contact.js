'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Contact extends Model {
	static get primaryKey() {
    return "dni_id";
  }

  static get incrementing() {
    return false;
  }

  static get createdAtColumn() {
    return null; //or 'created_at'
  }

  static get updatedAtColumn() {
    return null; //or 'updated_at'
	}
	user() {
    return this.belongsTo("App/Models/User", "user_id", "dni_id");
  }
}

module.exports = Contact
