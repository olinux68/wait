const express = require('express');
const router = express.Router();
const Queue = require('../models/Queue');
const auth = require('../middleware/auth');

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
 *         description: The ID of the queue to join
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
 *         description: Bad request
 *     components:
 *       securitySchemes:
 *         BearerAuth:
 *           type: http
 *           scheme: bearer
 *           bearerFormat: JWT
 */
router.post('/:queueId/join', async (req, res) => {
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
