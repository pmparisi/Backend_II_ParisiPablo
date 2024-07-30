import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { ExtractJwt, Strategy as JWTStrategy } from 'passport-jwt';
import { usersService } from '../managers/index.js';
import AuthService from '../services/authService.js';

const initializePassportConfig = () => {
  passport.use('register', new LocalStrategy({ usernameField: 'email', passReqToCallback: true }, async (req, email, password, done) => {
    const { first_name, last_name, age, cart } = req.body;
    if (!first_name || !last_name || age === undefined) {
      return done(null, false, { message: 'Incomplete values' });
    }
    const user = await usersService.getUserByEmail(email);
    if (user) {
      return done(null, false, { message: "User already exists" });
    }
    const authService = new AuthService();
    const hashedPassword = await authService.hashPassword(password);
    const newUser = {
      first_name,
      last_name,
      email,
      age,
      password: hashedPassword,
      cart,
      role: 'user'
    };
    const result = await usersService.createUser(newUser);
    return done(null, result);
  }));

  passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    const user = await usersService.getUserByEmail(email);
    if (!user) {
      return done(null, false, { message: "Incorrect credentials" });
    }
    const authService = new AuthService();
    const isValidPassword = await authService.validatePassword(password, user.password);
    if (!isValidPassword) {
      return done(null, false, { message: "Incorrect credentials" });
    }
    return done(null, user);
  }));

  passport.use('current', new JWTStrategy({
    secretOrKey: 'A1b2C3d4E5',
    jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor])
  }, async (payload, done) => {
      try {
          const user = await usersService.getUserById(payload.id);
          if (user) {
              const { password, _id, ...userWithoutSensitiveData } = user.toObject();
              return done(null, userWithoutSensitiveData);
          }
          return done(null, false);
      } catch (error) {
          return done(error, false);
      }
  }));
};

function cookieExtractor(req) {
  return req?.cookies?.['authTokenCookie'];
}

export default initializePassportConfig;