const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const Mailchimp = require('mailchimp-api-v3');
require('dotenv').config();

axios.defaults.headers.common['Accept'] = 'application/json';

const mailchimp = new Mailchimp(process.env.MAILCHIMP_KEY);

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/api/get-token', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  getToken(req.query.code || '')
    .then(token => {
      res.send(JSON.stringify({ token }));
    })
    .catch(error => {
      res.status(500).send({ error });
    });
});

app.get('/api/get-users', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  getUsers()
    .then(items => {
      res.send(JSON.stringify({ items }));
    })
    .catch(error => {
      res.status(500).send({ error });
    });
});

app.post('/api/add-user', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  addUser(req.body.info)
    .then(() => {
      res.send(JSON.stringify({ status: 'success' }));
    })
    .catch(error => {
      res.status(500).send({ error });
    });
});

app.listen(3001, () => console.log('Express server is running on localhost:3001'));

/* ========= get token ========= */

async function getToken(code) {
  try {
    const result = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: process.env.REACT_APP_GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code
    });
    const token = result.data.access_token;
    if (token) {
      return Promise.resolve(token);
    }
  } catch (error) {}
  return Promise.reject('Failed to get token');
}

/* ========= get audience ========= */

async function getAudience() {
  try {
    console.log('checking audience...');
    var result = await mailchimp.get('/lists');
    const list = result.lists.find(item => item.name === process.env.AUDIENCE_NAME);
    if (list) {
      return Promise.resolve(list);
    }
  } catch (error) {}
  return Promise.reject(`Faild to get audience`);
}

/* ========= get users ========= */

async function getUsers() {
  let list, members;

  try {
    list = await getAudience();
  } catch (error) {
    return Promise.reject(error);
  }

  try {
    console.log('getting members...');
    const count = list.stats.member_count + list.stats.unsubscribe_count;
    var result = await mailchimp.get(`/lists/${list.id}/members`, { count });
    members = result.members;
  } catch (error) {
    return Promise.reject(`Faild to get members`);
  }

  const items = [];
  members.forEach(member => {
    if (member.last_note) {
      const note = member.last_note.note.replace(new RegExp('&quot;', 'g'), '"').replace(new RegExp('&amp;', 'g'), '&');
      const info = JSON.parse(note);
      items.push({
        email: member.email_address,
        name: member.merge_fields.FNAME,
        ...info
      });
    }
  });
  return Promise.resolve(items);
}

/* ========= add user ========= */

async function addUser(info) {
  let list, member;

  try {
    list = await getAudience();
  } catch (error) {
    return Promise.reject(error);
  }

  try {
    console.log(`add member`);
    member = await mailchimp.post(`/lists/${list.id}/members`, {
      email_address: info.email,
      status: 'subscribed',
      merge_fields: {
        FNAME: info.name
      }
    });
  } catch (error) {
    return Promise.reject('Field to add user');
  }

  if (info.login) {
    try {
      console.log(`add note`);
      const note = JSON.stringify({
        login: info.login,
        location: info.location,
        avatar: info.avatar,
        repos: info.repos,
        followers: info.followers,
        following: info.following
      });
      await mailchimp.post(`/lists/${list.id}/members/${member.id}/notes`, {
        note
      });
    } catch (error) {
      return Promise.reject('Field to add note');
    }
  }

  return Promise.resolve();
}
