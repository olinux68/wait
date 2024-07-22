const express = require('express');
const router = express.Router();
const Queue = require('../models/Queue');
const auth = require('../middleware/auth'); // Assurez-vous que ce chemin est correct

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
 *                 example: "My Queue"
 *     responses:
 *       201:
 *         description: Queue created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Queue'
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *     parameters:
 *       - in: path
 *         name: queueId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the queue to join
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
 *                   example: 1
 *       404:
 *         description: Queue not found
 *       400:
 *         description: Bad request - Name is required
 */

router.post('/', auth, async (req, res) => {
    try {
        const { name } = req.body;
        const queue = new Queue({ name, ownerId: req.userId });
        await queue.save();
        res.status(201).send(queue);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post('/:queueId/join', async (req, res) => {
    try {
        const { queueId } = req.params;
        const { name } = req.body;

        // Vérifier si le nom est fourni dans le corps de la requête
        if (!name) {
            return res.status(400).send('Name is required.');
        }

        const queue = await Queue.findById(queueId);
        if (!queue) {
            return res.status(404).send('Queue not found');
        }

        // Ajouter l'utilisateur à la file d'attente
        const participant = { name: name, position: queue.participants.length + 1 };
        queue.participants.push(participant);
        await queue.save();

        res.status(200).send({ position: participant.position });
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;
