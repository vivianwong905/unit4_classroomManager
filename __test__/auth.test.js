const request = require('supertest');
const express = require('express');
const axios = require("axios");
const router = require("express").Router();
const {GITHUB_CLIENT_ID,GITHUB_CLIENT_SECRET} = process.env;

const app = express();
app.use('/', router);


jest.mock('axios');
axios.post.mockResolvedValue({ data: { access_token: response.data.access_token  } });

describe('test github routes', () => {
  it('GET /github/login should redirect to GitHub OAuth login', async () => {
    const response = await request(app).get('/github/login');
    expect(response.status).toBe(302); 
    expect(response.header.location).toContain(`https://github.com/login/oauth/authorize?client_id=`);
  });


});
