"use strict";

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use("Hash");

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class User extends Model {
  static boot() {
    super.boot();

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook("beforeSave", async userInstance => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password);
      }
    });
  }

  //static get table() {
  //    return 'user'
  //}

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

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens() {
    return this.hasMany("App/Models/Token");
  }

  loans() {
    return this.hasMany("App/Models/LoanHeader", "dni_id", "lending_user_id");
	}
	
	contacts() {
    return this.hasMany("App/Models/Contact", "dni_id", "user_id");
  }
}

module.exports = User;
