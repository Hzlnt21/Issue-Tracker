'use strict';

const mongoose = require('mongoose');

module.exports = function (app) {

  app.route('/api/issues/:project')

    .get(function (req, res) {
      let project = req.params.project;

      // Simulasi data untuk contoh
      const issues = [
        {
          issue_title: "Test Issue 1",
          issue_text: "This is the first test issue.",
          created_by: "Tester",
          assigned_to: "",
          status_text: "",
          created_on: new Date(),
          updated_on: new Date(),
          open: true,
          _id: new mongoose.Types.ObjectId().toString() // simulasi _id
        },
        // Tambahkan lebih banyak issue di sini jika perlu
      ];

      // Kembalikan semua issue untuk project yang diminta
      return res.json(issues);
    })

    .post(function (req, res) {
      let project = req.params.project;
      const { issue_title, issue_text, created_by, assigned_to, status_text } = req.body;

      // Validasi jika field required tidak ada
      if (!issue_title || !issue_text || !created_by) {
        return res.json({ error: 'required field(s) missing' });
      }

      // Buat object issue baru
      const newIssue = {
        issue_title,
        issue_text,
        created_by,
        assigned_to: assigned_to || '',
        status_text: status_text || '',
        created_on: new Date(),
        updated_on: new Date(),
        open: true,
        _id: new mongoose.Types.ObjectId().toString() // simulasi _id
      };

      // Kembalikan data issue yang baru saja dibuat
      return res.json(newIssue);
    })

    .put(function (req, res) {
      let project = req.params.project;
      const id = req.body._id; // Ambil _id dari body request
      const updateFields = {};

      // Cek jika ada field yang ingin diupdate
      if (req.body.issue_title) updateFields.issue_title = req.body.issue_title;
      if (req.body.issue_text) updateFields.issue_text = req.body.issue_text;
      if (req.body.created_by) updateFields.created_by = req.body.created_by;
      if (req.body.assigned_to) updateFields.assigned_to = req.body.assigned_to;
      if (req.body.status_text) updateFields.status_text = req.body.status_text;

      // Validasi jika tidak ada _id yang diberikan
      if (!id) {
        return res.json({ error: 'missing _id' });
      }

      // Validasi jika tidak ada field yang diupdate
      if (Object.keys(updateFields).length === 0) {
        return res.json({ error: 'no update field(s) sent', '_id': id });
      }

      // Simulasi update
      updateFields.updated_on = new Date(); // Update timestamp

      // Kembalikan response sukses
      return res.json({ result: 'successfully updated', '_id': id });
    })

    .delete(function (req, res) {
      let project = req.params.project;
      const id = req.body._id; // Ambil _id dari body request

      // Validasi jika tidak ada _id yang diberikan
      if (!id) {
        return res.json({ error: 'missing _id' });
      }

      // Simulasi penghapusan
      return res.json({ result: 'successfully deleted', '_id': id });
    });

};
