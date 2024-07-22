const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Queue = require('../models/Queue');

/**
 * @swagger
 * tags:
 *   name: Queue
 *   description: Operations related to queues
 */

/**
 * @swagger
 * /queue:
 *   post:
 *     summary: Create a new queue
 *     tags: [Queue]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the queue
 *                 example: "My Queue"
 *               ownerId:
 *                 type: string
 *                 description: The ID of the user creating the queue
 *                 example: "60d9f0f4f0b8c6f7d8b6b8c7"
 *     responses:
 *       201:
 *         description: Queue created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Queue'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *     components:
 *       securitySchemes:
 *         BearerAuth:
 *           type: http
 *           scheme: bearer
 *           bearerFormat: JWT
 */

/**
 * @swagger
 * /queue/{queueId}/join:
 *   post:
 *     summary: Join a queue
 *     tags: [Queue]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: queueId
 *         required: true
 *         schema:
 *           type: string
 *           description: The ID of the queue to join
 *           example: "60d9f0f4f0b8c6f7d8b6b8c8"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the user joining the queue
 *                 example: "John Doe"
 *     responses:
 *       200:
 *         description: Successfully joined the queue
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 position:
 *                   type: integer
 *                   description: The position of the user in the queue
 *                   example: 1
 *       404:
 *         description: Queue not found
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *     components:
 *       securitySchemes:
 *         BearerAuth:
 *           type: http
 *           scheme: bearer
 *           bearerFormat: JWT
 */

/**
 * Route pour créer une file d'attente
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const queue = new Queue(req.body);
    await queue.save();
    res.status(201).send(queue);
  } catch (error) {
    res.status(400).send(error);
  }
});

/**
 * Route pour rejoindre une file d'attente
 */
router.post('/:queueId/join', authMiddleware, async (req, res) => {
  try {
    const queue = await Queue.findById(req.params.queueId);
    if (!queue) {
      return res.status(404).send({ error: 'Queue not found' });
    }
    // Logique pour ajouter l'utilisateur à la file d'attente
    const position = queue.addUser(req.body.name);
    await queue.save();
    res.status(200).send({ position });
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
