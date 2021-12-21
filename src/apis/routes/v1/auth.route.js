const express = require('express')

const { authController } = require('../../controllers')
const { authValidation } = require('../../validations')

const authControllerUser = require('./../../controllers/client/auth-controller');
const validate = require('../../../middlewares/validate')

const router = express.Router()

router.post('/login', validate(authValidation.loginSchema), authController.login)
router.post('/register', validate(authValidation.registerSchema), authController.register)
router.post('/user/register', authControllerUser.signup);
router.post('/user/registers', authControllerUser.register);
router.get('/:id', authControllerUser.viewProfile);
router.post('/user/login', authControllerUser.login);
router.post('/forgotPassword', authControllerUser.forgotPassword);
router.patch('/user/resetPassword/:token', authControllerUser.resetPassword);
router.patch('/user/registerMail/:token', authControllerUser.registerMail);
router.patch('/user/updateMe', authControllerUser.protect, authControllerUser.updateMe);
router.patch('/user/updateMyPassword', authControllerUser.protect, authControllerUser.updatePassword);
router.delete('/logout/:refreshToken', authController.logout)

module.exports = router

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register as user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - displayName
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *                 description: must be unique
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 description: At least one number and one letter
 *             example:
 *               name: fake name
 *               email: fake@example.com
 *               password: password1
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 tokens:
 *                   $ref: '#/components/schemas/AuthTokens'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 */
