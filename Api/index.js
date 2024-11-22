const express = require('express');
const {check} = require('express-validator');
const cors = require('cors');
const autController = require('./authenticationController');
const mngConroller = require('./mangaController');

const app = express();
require('dotenv').config();

app.use(express.json());
app.use(cors());

app.listen(3000, () => {
    console.log(`Server is running on http://localhost:3000`);
}); 

app.post('/ ', [
    check('username', 'Enter the user name').notEmpty(),
    check('password', 'The password cannot be blank, and must be 6 characters or more in length').isLength({min: 6})
], autController.registration);
app.post('/login', [
    check('username', 'Enter the user name').notEmpty(),
    check('password', 'The password cannot be blank.').isEmpty()
], autController.login);
app.post('/add/manga', [
    check('title', 'The title cannot be blank').notEmpty(),
], mngConroller.addManga);
app.post('/add/news', [
    check('title', 'The title cannot be blank').notEmpty(),
], mngConroller.addNews);
app.get('/get/manga', mngConroller.getManga);
app.get('/get/news', mngConroller.getNews);
app.get('/get/news/:id', mngConroller.getNewsById);
app.get('/get/manga/:key', mngConroller.getMangaByKey);
app.post('/delete/manga', mngConroller.deleteManga);

