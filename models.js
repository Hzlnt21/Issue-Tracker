const mongoose = require("mongoose");
const { Schema } = mongoose;

const IssueSchema = new Schema({
  issue_title: { type: String, required: true },
  issue_text: { type: String, required: true },
  created_on: { type: Date, default: Date.now },
  updated_on: { type: Date, default: Date.now },
  created_by: { type: String, required: true },
  assigned_to: { type: String, default: "" },
  open: { type: Boolean, default: true },
  status_text: { type: String, default: "" },
});

const ProjectSchema = new Schema({
  name: { type: String, required: true },
  issues: [IssueSchema],
});

const Issue = mongoose.model("Issue", IssueSchema);
const Project = mongoose.model("Project", ProjectSchema);

exports.Issue = Issue;
exports.Project = Project;
