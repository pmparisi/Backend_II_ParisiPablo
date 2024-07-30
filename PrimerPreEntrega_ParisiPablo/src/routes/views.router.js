import { Router } from 'express';
import ProductManager from '../managers/mongo/productManager.js';
import passport from "passport";

const router = Router();
const productManager = new ProductManager();

router.get('/', async (req, res) => {
    const { page, limit } = req.query;
    if (!page) {
        const pageEnd = 1;
        
        console.log(pageEnd)
    }
    console.log(limit)

    const productsResult = await productManager.getProducts({ limit, page });
    if (!productsResult) return res.status(500).send({ status: "error", error: "An error occurred while getting the products. Please try again later." });
    const { docs: products, totalPages, page: currentPage, hasNextPage, hasPrevPage, nextPage, prevPage } = productsResult;

    res.render('home', { 
        title: 'Home', 
        css: 'home', 
        products,
        totalPages,
        currentPage,
        hasNextPage,
        hasPrevPage,
        nextPage,
        prevPage,
        limit
    });
});

router.get('/realtimeproducts', async (req, res) => {
    const products = await productManager.getAllProducts();
    res.render('realTimeProducts', { title: 'Real Time Products', css: 'realTimeProducts', products });
});


router.get('/register',(req,res)=>{
    res.render('Register', { title: 'Register', css: 'Register'});
})

router.get('/login',(req,res)=>{
    res.render('Login', { title: 'Login', css: 'Login'});
})

router.get('/profile',passport.authenticate('current',{session:false}),(req,res)=>{
    console.log(req.user);
    if(!req.user){
        return res.redirect('/login')
    }
    res.render('Profile',{
        title: 'Profile', 
        css: 'Profile',
        user: req.user
    })
})

export default router;
