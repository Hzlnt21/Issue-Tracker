"use strict";
const mongoose = require("mongoose");
const IssueModel = require("../models").Issue;
const ProjectModel = require("../models").Project;
const ObjectId = mongoose.Types.ObjectId;

module.exports = function (app) {
  app
    .route("/api/issues/:project")
    .get(async function (req, res) {
      let projectName = req.params.project;
      const {
        _id,
        open,
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text,
      } = req.query;

      try {
        const data = await ProjectModel.aggregate([
          { $match: { name: projectName } },
          { $unwind: "$issues" },
          _id ? { $match: { "issues._id": ObjectId(_id) } } : { $match: {} },
          open ? { $match: { "issues.open": open === 'true' } } : { $match: {} }, // open 'true' handling
          issue_title ? { $match: { "issues.issue_title": issue_title } } : { $match: {} },
          issue_text ? { $match: { "issues.issue_text": issue_text } } : { $match: {} },
          created_by ? { $match: { "issues.created_by": created_by } } : { $match: {} },
          assigned_to ? { $match: { "issues.assigned_to": assigned_to } } : { $match: {} },
          status_text ? { $match: { "issues.status_text": status_text } } : { $match: {} },
        ]).exec();

        if (!data.length) {
          return res.json([]);
        }

        let mappedData = data.map((item) => item.issues);
        res.json(mappedData);
      } catch (err) {
        res.status(500).send("Error retrieving issues.");
      }
    })

    .post(async function (req, res) {
      let project = req.params.project;
      const {
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text,
      } = req.body;

      if (!issue_title || !issue_text || !created_by) {
        return res.json({ error: "required field(s) missing" });
      }

      const newIssue = new IssueModel({
        issue_title: issue_title || "",
        issue_text: issue_text || "",
        created_on: new Date(),
        updated_on: new Date(),
        created_by: created_by || "",
        assigned_to: assigned_to || "",
        open: true,
        status_text: status_text || "",
      });

      try {
        let projectdata = await ProjectModel.findOne({ name: project });

        if (!projectdata) {
          const newProject = new ProjectModel({ name: project });
          newProject.issues.push(newIssue);
          await newProject.save();
          return res.json(newIssue);
        } else {
          projectdata.issues.push(newIssue);
          await projectdata.save();
          return res.json(newIssue);
        }
      } catch (err) {
        res.send("There was an error saving in post");
      }
    })

    .put(async function (req, res) {
      let project = req.params.project;
      const {
        _id,
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text,
        open,
      } = req.body;

      if (!_id) {
        return res.json({ error: "missing _id" });
      }

      if (!issue_title && !issue_text && !created_by && !assigned_to && !status_text && open === undefined) {
        return res.json({ error: "no update field(s) sent", _id: _id });
      }

      try {
        let projectdata = await ProjectModel.findOne({ name: project });

        if (!projectdata) {
          return res.json({ error: "could not update", _id: _id });
        }

        const issueData = projectdata.issues.id(_id);
        if (!issueData) {
          return res.json({ error: "could not update", _id: _id });
        }

        issueData.issue_title = issue_title || issueData.issue_title;
        issueData.issue_text = issue_text || issueData.issue_text;
        issueData.created_by = created_by || issueData.created_by;
        issueData.assigned_to = assigned_to || issueData.assigned_to;
        issueData.status_text = status_text || issueData.status_text;
        issueData.updated_on = new Date();
        issueData.open = open !== undefined ? open : issueData.open; // handling open field properly

        await projectdata.save();
        res.json({ result: "successfully updated", _id: _id });
      } catch (err) {
        res.json({ error: "could not update", _id: _id });
      }
    })

    .delete(async function (req, res) {
      let project = req.params.project;
      const { _id } = req.body;

      if (!_id) {
        return res.json({ error: "missing _id" });
      }

      try {
        let projectdata = await ProjectModel.findOne({ name: project });

        if (!projectdata) {
          return res.json({ error: "could not delete", _id: _id });
        }

        const issueData = projectdata.issues.id(_id);
        if (!issueData) {
          return res.json({ error: "could not delete", _id: _id });
        }

        issueData.remove();
        await projectdata.save();
        res.json({ result: "successfully deleted", _id: _id });
      } catch (err) {
        res.json({ error: "could not delete", _id: _id });
      }
    });
};
