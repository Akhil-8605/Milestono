const Feedback = require("../models/feedback");

const addFeedback = async (req, res) => {
    try {
        const { name, email, feedback } = req.body;

        const newFeedback = new Feedback({
            name,
            email,
            feedback,
            date: new Date(),
            isOnHomePage: false,
        });

        await newFeedback.save();
        res.status(201).json({ message: "Feedback submitted successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error submitting feedback", error });
    }
};

const getFeedback = async (req, res) => {
    try {
        const feedbacks = await Feedback.find().sort({ date: -1 });
        res.status(200).json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: "Error fetching feedback", error });
    }
};

const updateIsOnHomePage = async (req, res) => {
    try {
        const { _id, isOnHomePage } = req.body;

        const feedback = await Feedback.findByIdAndUpdate(
            _id,
            { isOnHomePage },
            { new: true }
        );

        if (!feedback) {
            return res.status(404).json({ message: "Feedback not found" });
        }

        res.status(200).json({ message: "Feedback updated successfully!", feedback });
    } catch (error) {
        res.status(500).json({ message: "Error updating feedback", error });
    }
};
module.exports = {
    getFeedback,
    addFeedback,
    updateIsOnHomePage,
};
