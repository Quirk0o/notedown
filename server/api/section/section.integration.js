'use strict';

var app = require('../..');
import request from 'supertest';

var newSection;

describe('Section API:', function() {

  describe('GET /api/sections', function() {
    var sections;

    beforeEach(function(done) {
      request(app)
        .get('/api/sections')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          sections = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      sections.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/sections', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/sections')
        .send({
          name: 'New Section',
          info: 'This is the brand new section!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newSection = res.body;
          done();
        });
    });

    it('should respond with the newly created section', function() {
      newSection.name.should.equal('New Section');
      newSection.info.should.equal('This is the brand new section!!!');
    });

  });

  describe('GET /api/sections/:id', function() {
    var section;

    beforeEach(function(done) {
      request(app)
        .get('/api/sections/' + newSection._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          section = res.body;
          done();
        });
    });

    afterEach(function() {
      section = {};
    });

    it('should respond with the requested section', function() {
      section.name.should.equal('New Section');
      section.info.should.equal('This is the brand new section!!!');
    });

  });

  describe('PUT /api/sections/:id', function() {
    var updatedSection;

    beforeEach(function(done) {
      request(app)
        .put('/api/sections/' + newSection._id)
        .send({
          name: 'Updated Section',
          info: 'This is the updated section!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedSection = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedSection = {};
    });

    it('should respond with the updated section', function() {
      updatedSection.name.should.equal('Updated Section');
      updatedSection.info.should.equal('This is the updated section!!!');
    });

  });

  describe('DELETE /api/sections/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/sections/' + newSection._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when section does not exist', function(done) {
      request(app)
        .delete('/api/sections/' + newSection._id)
        .expect(404)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

  });

});
