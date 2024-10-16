const express = require('express');
const router = express.Router();
const User = require('../models/users');
const multer = require('multer');

// Image upload configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now() + '_' + file.originalname);
    }
});

const upload = multer({
    storage: storage
}).single('image');


// get all users route
router.get('/', async (req, res) => {
    try {
        const users = await User.find(); // Use await instead of exec with callback
        res.render('index', { title: 'Home page', users: users });
    } catch (err) {
        console.log(err);   
        res.json({ message: err.message, type: 'danger' });
    }
});


router.get('/add', (req, res) => {
    res.render('add_users', { title: 'Add Users Page' });
});

// Insert a user into the database route
router.post('/add', upload, async (req, res) => {
    try {
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            image: req.file.filename
        });

        // Save the user using await
        await user.save();
        
        // Set a success message in the session
        req.session.message = {
            type: 'success',
            message: 'User added successfully'
        };
        
        // Redirect to the home page
        res.redirect('/');
    } catch (err) {
        console.log(err);
        res.json({ message: err.message, type: 'danger' });
    }
});


// edit a user route
router.get('/edit/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.render('edit_users', { title: 'Edit Users Page', user: user });
    } catch (err) {
        console.log(err);
        res.json({ message: err.message, type: 'danger' });
        res.redirect('/');
    }
});


/// Update a user route
router.post('/update/:id', upload, async (req, res) => {
    try {
        // Find the user by ID and update fields
        const user = await User.findById(req.params.id);
        
        // Update user details
        user.name = req.body.name;
        user.email = req.body.email;
        user.phone = req.body.phone;

        // Check if a new image was uploaded
        if (req.file) {
            user.image = req.file.filename; // Update only if an image is uploaded
        }

        // Save the updated user
        await user.save();

        // Set a success message in the session
        req.session.message = {
            type: 'success',
            message: 'User updated successfully'
        };

        // Redirect to the home page
        return res.redirect('/');
    } catch (err) {
        console.log(err);
        
        // Ensure only one response is sent
        res.json({ message: err.message, type: 'danger' });
    }
});


// Delete a user route
router.get('/delete/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        req.session.message = {
            type: 'info',
            message: 'User deleted successfully'
        }
        res.redirect('/');
    } catch (err) {
        console.log(err);
        res.json({ message: err.message, type: 'danger' });
    }
    
});


module.exports = router;
