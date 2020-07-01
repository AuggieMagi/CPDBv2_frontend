import should from 'should';

import { getUserEmail, setUserEmail } from 'utils/user';


describe('user utils', function () {
  beforeEach(function () {
    localStorage.clear();
  });

  describe('getUserEmail', function () {
    it('should return correct user email', function () {
      should(getUserEmail()).be.null();
      localStorage.setItem('user_email', 'cpdb@cpdb.co');
      getUserEmail().should.equal('cpdb@cpdb.co');
    });
  });

  describe('setUserEmail', function () {
    it('should set user email correctly', function () {
      should(localStorage.getItem('user_email')).be.null();
      setUserEmail('cpdb@cpdb.co');
      localStorage.getItem('user_email').should.equal('cpdb@cpdb.co');
    });
  });
});
