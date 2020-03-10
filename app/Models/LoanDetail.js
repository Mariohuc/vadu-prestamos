'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class LoanDetail extends Model {
	static get createdAtColumn() {
    return null;
  }
  static get updatedAtColumn() {
    return null;
	}
	
	loanHeader() {
    return this.belongsTo("App/Models/LoanHeader", "loan_header_id", "id");
  }
}

module.exports = LoanDetail
