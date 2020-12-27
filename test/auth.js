const expect = require('chai').expect;

const authMiddleware = require('../auth/is-auth');

it('should throw an error if no authorization header is present', function() {
  const req = {
    get: function(headerName) {
      return null;
    }
  };
  expect(authMiddleware.bind(this, req, {}, () => {})).to.throw(
    'Not authenticated.'
  );
});
it('should throw an error if no authorization header is only one string', function() {
  const req = {
    get: function(headerName) {
      return 'xyz';
    }
  };
  expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
});
