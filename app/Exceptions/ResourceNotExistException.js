"use strict";

const { LogicalException } = require("@adonisjs/generic-exceptions");

class ResourceNotExistException extends LogicalException {
  /**
   * Handle this exception by itself
   */
  handle(error, { response }) {
    return response.status(404).send({ message: "Recurso no existente" });
  }
}

module.exports = ResourceNotExistException;
