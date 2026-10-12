const mongoose = require("mongoose");
const Hackathon = require("../models/Hackathon");

const fields = ["title","description","organizer","startDate","endDate","registrationDeadline","location","mode","status","website"];

const getHackathons = async (req, res) => {
        const { search, status, mode, mine } = req.query;
        const filter = {};

        if (status) {
            filter.status = status;
        }

        if (mode) {
            filter.mode = mode;
        }

        if (mine === "true") {
            filter.createdBy = req.user;
        }

        const hackathons = await Hackathon.find(filter)
            .populate("createdBy", "name")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: hackathons.length,
            hackathons
        });
};

const getHackathonById = async (req, res) => {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid hackathon ID"
            });
        }

        const hackathon = await Hackathon.findById(req.params.id).populate("createdBy", "name");

        if (!hackathon) {
            return res.status(404).json({
                success: false,
                message: "Hackathon not found"
            });
        }

        res.json({
            success: true,
            hackathon
        });
};

const createHackathon = async (req, res) => {
        const { title, organizer, startDate, endDate } = req.body;

        if (!title || !organizer) {
            return res.status(400).json({
                success: false,
                message: "Title and organizer are required"
            });
        }

        if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
            return res.status(400).json({
                success: false,
                message: "End date cannot be before start date"
            });
        }

        const data = {};
        fields.forEach((field) => {
            if (req.body[field] !== undefined) {
                data[field] = req.body[field];
            }
        });
        data.createdBy = req.user;

        const hackathon = await Hackathon.create(data);

        res.status(201).json({
            success: true,
            message: "Hackathon created successfully",
            hackathon
        });
};

const updateHackathon = async (req, res) => {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid hackathon ID"
            });
        }

        const hackathon = await Hackathon.findById(req.params.id);

        if (!hackathon) {
            return res.status(404).json({
                success: false,
                message: "Hackathon not found"
            });
        }

        if (hackathon.createdBy.toString() !== req.user && req.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "You can only edit hackathons you created"
            });
        }

        fields.forEach((field) => {
            if (req.body[field] !== undefined) {
                hackathon[field] = req.body[field];
            }
        });

        if (hackathon.startDate && hackathon.endDate && hackathon.endDate < hackathon.startDate) {
            return res.status(400).json({
                success: false,
                message: "End date cannot be before start date"
            });
        }

        await hackathon.save();

        res.json({
            success: true,
            message: "Hackathon updated successfully",
            hackathon
        });
};

const deleteHackathon = async (req, res) => {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid hackathon ID"
            });
        }

        const hackathon = await Hackathon.findById(req.params.id);

        if (!hackathon) {
            return res.status(404).json({
                success: false,
                message: "Hackathon not found"
            });
        }

        if (hackathon.createdBy.toString() !== req.user && req.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "You can only delete hackathons you created"
            });
        }

        await hackathon.deleteOne();

        res.json({
            success: true,
            message: "Hackathon deleted successfully"
        });
};

module.exports = {getHackathons,getHackathonById,createHackathon,updateHackathon,deleteHackathon};