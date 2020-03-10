"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class LoanHeader extends Model {
  static get createdAtColumn() {
    return null;
  }
  static get updatedAtColumn() {
    return null;
  }
  static get dates() { //it's necesary to register date fields
    return super.dates.concat(["creation_date", "expiration_date"]);
  }

	static castDates (field, value) {
    if (field === "creation_date" || field === "expiration_date") {
      return value.format("YYYY-MM-DD");
    }
    return super.formatDates(field, value);
  }

  user() {
    return this.belongsTo("App/Models/User", "lending_user_id", "dni_id");
	}
	
	loansDetails() {
    return this.hasMany("App/Models/LoanDetail", "id", "loan_header_id");
  }
}

module.exports = LoanHeader;
