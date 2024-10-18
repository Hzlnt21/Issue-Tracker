const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  
  let project = 'apitest';
  let testIssueId; // Stocke l'_id pour les tests de mise à jour et suppression

  // POST Tests
  test('Create an issue with every field', function(done) {
    chai.request(server)
      .post('/api/issues/' + project)
      .send({
        issue_title: 'Test Issue',
        issue_text: 'This is a test issue.',
        created_by: 'Tester',
        assigned_to: 'Assignee',
        status_text: 'In Progress'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, '_id');
        testIssueId = res.body._id; // Sauvegarde l'_id pour les tests suivants
        done();
      });
  });

  test('Create an issue with only required fields', function(done) {
    chai.request(server)
      .post('/api/issues/' + project)
      .send({
        issue_title: 'Required Fields Only',
        issue_text: 'This issue only has required fields.',
        created_by: 'Tester'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, '_id');
        done();
      });
  });

  test('Create an issue with missing required fields', function(done) {
    chai.request(server)
      .post('/api/issues/' + project)
      .send({
        issue_title: '',
        issue_text: 'Missing fields test',
        created_by: ''
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'required field(s) missing');
        done();
      });
  });

  // GET Tests
  test('View issues on a project', function(done) {
    chai.request(server)
      .get('/api/issues/' + project)
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        done();
      });
  });

  test('View issues on a project with one filter', function(done) {
    chai.request(server)
      .get('/api/issues/' + project + '?open=true')
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        assert.property(res.body[0], 'open');
        assert.equal(res.body[0].open, true);
        done();
      });
  });

  test('View issues on a project with multiple filters', function(done) {
    chai.request(server)
      .get('/api/issues/' + project + '?open=true&assigned_to=Assignee')
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        assert.property(res.body[0], 'assigned_to');
        assert.equal(res.body[0].assigned_to, 'Assignee');
        done();
      });
  });

  // PUT Tests
  test('Update one field on an issue', function(done) {
    chai.request(server)
      .put('/api/issues/' + project)
      .send({ _id: testIssueId, issue_title: 'Updated Title' })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.result, 'successfully updated');
        assert.equal(res.body._id, testIssueId);
        done();
      });
  });

  test('Update multiple fields on an issue', function(done) {
    chai.request(server)
      .put('/api/issues/' + project)
      .send({ _id: testIssueId, issue_title: 'New Title', status_text: 'Resolved' })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.result, 'successfully updated');
        assert.equal(res.body._id, testIssueId);
        done();
      });
  });

  test('Update an issue with missing _id', function(done) {
    chai.request(server)
      .put('/api/issues/' + project)
      .send({ issue_title: 'No ID' })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'missing _id');
        done();
      });
  });

  test('Update an issue with no fields to update', function(done) {
    chai.request(server)
      .put('/api/issues/' + project)
      .send({ _id: testIssueId })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'no update field(s) sent');
        done();
      });
  });

  test('Update an issue with an invalid _id', function(done) {
    chai.request(server)
      .put('/api/issues/' + project)
      .send({ _id: 'invalid_id', issue_title: 'Invalid ID' })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'could not update');
        assert.equal(res.body._id, 'invalid_id');
        done();
      });
  });

  // DELETE Tests
  test('Delete an issue', function(done) {
    chai.request(server)
      .delete('/api/issues/' + project)
      .send({ _id: testIssueId })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.result, 'successfully deleted');
        assert.equal(res.body._id, testIssueId);
        done();
      });
  });

  test('Delete an issue with an invalid _id', function(done) {
    chai.request(server)
      .delete('/api/issues/' + project)
      .send({ _id: 'invalid_id' })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'could not delete');
        assert.equal(res.body._id, 'invalid_id');
        done();
      });
  });

  test('Delete an issue with missing _id', function(done) {
    chai.request(server)
      .delete('/api/issues/' + project)
      .send({})
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'missing _id');
        done();
      });
  });

});