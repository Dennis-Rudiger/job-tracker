import { validationResult } from 'express-validator';
import Job from '../models/Job.js';

export const listJobs = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const query = { createdBy: req.user._id };
    if (status) query.status = status;
    if (search) query.$or = [
      { company: { $regex: search, $options: 'i' } },
      { position: { $regex: search, $options: 'i' } }
    ];

    const skip = (Number(page) - 1) * Number(limit);
    const [data, total] = await Promise.all([
      Job.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Job.countDocuments(query)
    ]);

    res.json({ data, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    next(err);
  }
};

export const getJob = async (req, res, next) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, createdBy: req.user._id });
    if (!job) {
      res.status(404);
      throw new Error('Job not found');
    }
    res.json({ job });
  } catch (err) {
    next(err);
  }
};

export const createJob = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return next({ errors: errors.array() });

    const job = await Job.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ job });
  } catch (err) {
    next(err);
  }
};

export const updateJob = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return next({ errors: errors.array() });

    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      req.body,
      { new: true }
    );
    if (!job) {
      res.status(404);
      throw new Error('Job not found');
    }
    res.json({ job });
  } catch (err) {
    next(err);
  }
};

export const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });
    if (!job) {
      res.status(404);
      throw new Error('Job not found');
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
