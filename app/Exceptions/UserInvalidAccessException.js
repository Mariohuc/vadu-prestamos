"use strict";

const { LogicalException } = require("@adonisjs/generic-exceptions");

class UserInvalidAccessException extends LogicalException {
  /**
   * Handle this exception by itself
   */
  handle(error, { response }) {
    return response
      .status(403)
      .send({ message: "Acceso no autorizado. No posee este recurso." });
  }
}

module.exports = UserInvalidAccessException;
