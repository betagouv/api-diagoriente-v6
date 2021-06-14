import User from 'models/user.model';

export default [
  new User({ email: 'admin@admin.com', firstName: 'admin', lastName: 'test', password: 'Test123&', role: 'admin' }),
  new User({ email: 'test@test.com', firstName: 'Test', lastName: 'Test', password: 'Test123&', role: 'user' }),
];
