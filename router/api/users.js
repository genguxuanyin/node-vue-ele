const express = require('express');
const Sequelize = require('sequelize');
// const mongoose = require('mongoose');
const router = express.Router();
//获取全球公认头像
const gravatar = require('gravatar');
const passport = require('passport');
//生成token
const jwt = require('jsonwebtoken');
//密码加密和匹配
const bcrypt = require('bcrypt');
const User = require('../../models/User');

const keys = require('../../config/keys')

router.get('/test', (req, res) => {
    res.json({
        info: 'user api is runing'
    });
});

router.post('/register', (req, res) => {
    //查询数据是否有邮箱
    console.log('email:', req.body.email)
    User.findOne({
            where: {
                email: req.body.email
            }
        })
        .then(user => {
            if (user) {
                return res.status(400).json({
                    email: '邮箱已被注册'
                })
            } else {
                const avatar = gravatar.url(req.body.email, {
                    s: '200',
                    r: 'pg',
                    d: 'mm'
                });
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar,
                    password: req.body.password,
                    identity: req.body.identity
                });
                // console.log(newUser)
                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        // Store hash in your password DB.
                        if (err) {
                            throw err;
                        }
                        newUser.password = hash;
                        newUser.save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err))
                    });
                });
            }
        })
});

router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({
            where: {
                email: email
            }
        })
        .then(user => {
            if (!user) {
                return res.status(404).json({
                    email: '用户不存在'
                });
            }
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    console.log('isMatch:',isMatch)
                    if (isMatch) {
                        const rule = {
                            id: user.id,
                            name: user.name,
                            avatar: user.avatar,
                            identity: user.identity
                        };
                        console.log('rule:',rule)
                        jwt.sign(rule, keys.secretOrKey, {
                            expiresIn: 3600
                        }, (err, token) => {
                            if (err) throw err;
                            console.log('token:',token)
                            res.json({
                                success: true,
                                token: 'Bearer ' + token
                            })
                        })
                    } else {
                        return res.status(400).json({
                            password: "密码错误"
                        })
                    }
                })
        })
});

/* router.get('/current', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        identity: req.user.identity
    });
}); */

/* router.get('/current', (req, res) => {
    // console.log(req.headers.authorization, keys.secretOrKey);
    // console.log(req.body);
    jwt.verify(req.headers.authorization, keys.secretOrKey, function (err, decode) {
        console.log(decode);
        if (err) {
            console.log(err);
            res.send({
                'status': 0
            });
        } else {
            res.send({
                'status': 1
            });
        }
    });
}); */

module.exports = router;