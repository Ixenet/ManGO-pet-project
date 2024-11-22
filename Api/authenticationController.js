const bcrypt = require('bcryptjs');
const {Client} = require('pg');
const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const client = require('./dataBaseClient');

class authenticationController {
    async registration(req, res) {
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty(400)) {
                 return res.status(400).json({message: "Registration error!", errors});
            }
            const {username, password, role} = req.body;
            const candidate = await client.query(`SELECT * FROM users WHERE username = $1`, [username]);

            if(candidate.rows.length > 0) {
                return res.status(400).json({message: 'User with this username already exist!'});
            }

            const hashPassword = bcrypt.hashSync(password, 7);

            client.query(`INSERT INTO users (username, password, role) VALUES ($1, $2, $3)`, [username, hashPassword, role]);

            return res.status(200);
        } catch (err) {
            console.log(err);
            res.status(403).json({message: 'Registration error!'});
        }
    }

    async login(req, res) {
        try {
            const {username, password} = req.body;
            const user = (await client.query(`SELECT * FROM users WHERE username = $1`, [username])).rows[0];

            if(!user) 
                return res.status(400).json({message: 'This user does not exist!'});

            const validPassword = bcrypt.compareSync(password, user.password);

            if(!validPassword)
                return res.status(400).json({message: 'The password is wrong!'});

            const token = generateAccessToken(user.id, user.role);
            return res.status(200).json({token});
        } catch (err) {
            console.log(err);
            res.status(403).json({message: 'Loggin error!'});
        }
    }
}

const generateAccessToken = function(id, role) {
    const payload = {
        id,
        role
    }

    return jwt.sign(payload, process.env.SECRET_KEY, {expiresIn:  '24h'});
};

module.exports = new authenticationController();