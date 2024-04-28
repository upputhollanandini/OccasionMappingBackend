const exp = require('express');

const userApp = exp.Router();

let eventsCollection;
userApp.use((req, res, next) => {
    eventsCollection = req.app.get('eventsCollection');
    next();
});

// Get all events
userApp.get('/', async (req, res) => {
    try {
        const events = await eventsCollection.find().toArray();
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new event
userApp.post('/', async (req, res) => {
	let event=req.body;
    try {
        const newEvent = await eventsCollection.insertOne(event);
        res.send({message:"Event Added",payload:newEvent})
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete an event
// Delete an event by eventId
const { ObjectId } = require('mongodb');

userApp.delete('/:eventId', async (req, res) => {
    try {
        const eventId = req.params.eventId; // Retrieve eventId from request parameters
        const query = { _id: new ObjectId(eventId) }; // Create query object using new ObjectId()
        await eventsCollection.deleteOne(query); // Delete the event with the specified _id
        res.json({ message: 'Event deleted' });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ message: error.message });
    }
});




// Update an event by ID
//const { ObjectId } = require('mongodb');

userApp.put('/:eventId', async (req, res) => {
    const eventId = req.params.eventId;
    const { title, date, time, reminder } = req.body; // Include the 'time' field

    try {
        const updatedEvent = await eventsCollection.findOneAndUpdate(
            { _id: new ObjectId(eventId) }, // Use new ObjectId() to create ObjectId
            { $set: { title, date, time, reminder } }, // Include 'time' in the update operation
            { returnOriginal: false }
        );
        res.send({ message: "Event Updated" });
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


module.exports = userApp;
