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

export const exportJobsCsv = async (req, res, next) => {
  try {
    const jobs = await Job.find({ createdBy: req.user._id }).sort({ createdAt: -1 }).lean();
    const headers = [
      'company', 'position', 'status', 'location', 'salary', 'link', 'notes', 'dateApplied', 'interviewDates', 'offerDate', 'rejectedDate', 'createdAt', 'updatedAt'
    ];
    const esc = (v) => {
      if (v === null || v === undefined) return '';
      const s = String(v).replace(/"/g, '""');
      return /[",\n]/.test(s) ? `"${s}"` : s;
    };
    const rows = [headers.join(',')].concat(
      jobs.map(j => headers.map(h => {
        let val = j[h];
        if (Array.isArray(val)) {
          val = val.map(d => d instanceof Date ? d.toISOString() : d).join(';');
        } else if (val instanceof Date) {
          val = val.toISOString();
        }
        return esc(val);
      }).join(','))
    ).join('\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="jobs-export.csv"');
    res.send(`\uFEFF${rows}`); // include BOM for Excel UTF-8
  } catch (err) {
    next(err);
  }
};

export const stats = async (req, res, next) => {
  try {
    const [{ counts = [], last30 = 0 } = {}] = await Job.aggregate([
      { $match: { createdBy: req.user._id } },
      {
        $facet: {
          counts: [
            { $group: { _id: '$status', count: { $sum: 1 } } },
            { $project: { _id: 0, status: '$_id', count: 1 } }
          ],
          last30: [
            { $match: { dateApplied: { $gte: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30) } } },
            { $count: 'value' }
          ]
        }
      }
    ]);

    const byStatus = counts.reduce((acc, cur) => { acc[cur.status] = cur.count; return acc; }, {});
    const total = Object.values(byStatus).reduce((a, b) => a + b, 0);
    const last30Applied = Array.isArray(last30) ? (last30[0]?.value || 0) : last30;
    res.json({ total, byStatus: { applied: byStatus.applied || 0, interview: byStatus.interview || 0, offer: byStatus.offer || 0, rejected: byStatus.rejected || 0 }, last30Applied });
  } catch (err) {
    next(err);
  }
};
