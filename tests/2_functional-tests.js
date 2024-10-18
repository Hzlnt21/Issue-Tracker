const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  let issueId;

  // Create an issue with every field
  test('Create an issue with every field: POST request to /api/issues/test', function(done) {
    chai.request(server)
      .post('/api/issues/test')
      .send({
        issue_title: 'Test Issue',
        issue_text: 'This is a test issue.',
        created_by: 'Tester',
        assigned_to: 'Assignee',
        status_text: 'In Progress'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.exists(res.body._id);
        issueId = res.body._id; // Simpan _id untuk pengujian berikutnya
        assert.equal(res.body.issue_title, 'Test Issue');
        done();
      });
  });

  // Create an issue with only required fields
  test('Create an issue with only required fields: POST request to /api/issues/test', function(done) {
    chai.request(server)
      .post('/api/issues/test')
      .send({
        issue_title: 'Test Issue 2',
        issue_text: 'This is the second test issue.',
        created_by: 'Tester'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.exists(res.body._id);
        done();
      });
  });

  // Create an issue with missing required fields
  test('Create an issue with missing required fields: POST request to /api/issues/test', function(done) {
    chai.request(server)
      .post('/api/issues/test')
      .send({
        issue_title: 'Test Issue 3'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'required field(s) missing');
        done();
      });
  });

  // View issues on a project
  test('View issues on a project: GET request to /api/issues/test', function(done) {
    chai.request(server)
      .get('/api/issues/test')
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        done();
      });
  });

  // Update an issue with _id
  test('Update one field on an issue: PUT request to /api/issues/test', function(done) {
    chai.request(server)
      .put('/api/issues/test')
      .send({
        _id: issueId,
        status_text: 'Completed'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.result, 'successfully updated');
        done();
      });
  });

  // Delete an issue
  test('Delete an issue: DELETE request to /api/issues/test', function(done) {
    chai.request(server)
      .delete('/api/issues/test')
      .send({ _id: issueId })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.result, 'successfully deleted');
        done();
      });
  });

});
