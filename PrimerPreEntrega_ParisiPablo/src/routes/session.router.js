import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = Router();

router.post('/register', passport.authenticate('register', { session: false }), (req, res) => {
    res.status(201).send({ status: 'success', message: 'User registered successfully' });
});

router.post('/login', passport.authenticate('login', { session: false }), async (req, res) => {
        const user = req.user;
        const token = jwt.sign({ id: user._id, email: user.email }, 'A1b2C3d4E5', { expiresIn: '1h' });
        res.cookie('authTokenCookie', token, { httpOnly: true });
        res.send({ status: 'success', message: 'Login successful' });
});

router.get('/current', passport.authenticate('current', { session: false }), (req, res) => {
    if (!req.user) {
        return res.status(401).send({ status: 'error', message: 'Not logged in' });
    }
    res.send({ status: 'success', user: req.user });
});

router.get('/logout', (req, res) => {
    res.clearCookie('authTokenCookie');
    res.send({ status: 'success', message: 'Logout successful' });
});

export default router;