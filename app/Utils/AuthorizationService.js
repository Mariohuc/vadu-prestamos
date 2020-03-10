const UserInvalidAccessException = use("App/Exceptions/UserInvalidAccessException");
const ResourceNotExistException = use("App/Exceptions/ResourceNotExistException");

class AuthorizationService {
  static verifyPermissionInLoans(loan, user) {
		if( !loan ){
			throw new ResourceNotExistException();
		}
    if (loan.lending_user_id !== user.dni_id) {
      throw new UserInvalidAccessException();
    }
	}
	static verifyPermissionInContacts(contact, user) {
		if( !contact ){
			throw new ResourceNotExistException();
		}
    if (contact.user_id !== user.dni_id) {
      throw new UserInvalidAccessException();
    }
  }
}

module.exports = AuthorizationService;
