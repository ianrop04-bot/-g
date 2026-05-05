const express = require('express')
const crypto = require('crypto')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors())

const messages = {}

function generate() {
  return crypto.randomBytes(7).toString('hex')
}

app.use('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Portfolio Maker</title>
</head>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<style>
  * {
    margin: 0;
    padding: 0;
  }

  body {
    background: radial-gradient(#00B4FF, #0027FF, #00FFCB);
    font-size: 16px;
    font-family: Bold, Courier, monospace;
    font-stretch: 50rem;
    max-width: 290px;
  }

  input,
  textarea {
    margin: 10px;
    padding: 18px;
    border-radius: 10px;
    border: 1px solid #5D5D62;
    outline-color: #00B4FF;
  }

  #age {
    width: 20px;
  }

  .card {
    background: white;
    padding: 10px;
  }

  footer {
    color: white;
  }

  footer a {
    font-size: 20px;
    font-family: bold;
    color: #FF009B;
  }

  .icon {
    width: 30px;
    height: 30px;
    text-align: center;
    justify-items: center;
    border-radius: 30px;
    background: green;
    align-items: center;
  }

  .btb {
    position: fixed;
    right: 20px;
    bottom: 20px;
    margin: 10px;
    padding: 16px;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    border-bottom-left-radius: 20px;
    background: #06F0FF;
    border: none;
  }

  .btb:active {
    background: #065DFF;
  }

  #onclick {
    background: linear-gradient(136deg, #065DFF, #00CAFF);
    padding: 15px;
    margin: 10px;
    width: 50%;
    color: white;
    font-family: bold;
    border: none;
    border-radius: 40px;
  }

  #msg {
    margin: 10px;
    padding: 10px;
    text-align: center;
    color: #065DFF;
    font-weight: bold;
  }
</style>

<body>
  <br>
  <br />
  <div class="card">
    <h2>Portfolio Url Maker</h2>
    <br />
    <br />
    <div class="Profile" id="pro"></div>
    <input type="text" placeholder="Enter Your Name" id="name">
    <input type="text" placeholder="Age" id="age">
    <input type="url" placeholder="Follow button Url (optional)" id="url"><br>
    <textarea placeholder="Enter Your Bio" id="bio" rows="8" cols="20"></textarea>
    <button id="onclick"><i class="fas fa-url"></i>Generate URL</button>
    <div id="msg"></div>
  </div>
  <button class="btb" onclick="window.open('https://congenial-winner-1.vercel.app')">💌</button>
  <footer>
    <a href="/" class="crt">← Create Yours Now</a>
    <div class="icon" onclick="window.open('https://whatsapp.com/channel/0029Vb71mgIElaglZCU0je0x')"><i class="fab fa-whatsapp"></i></div>
    <p class="left">Service | Team</p>
    <th class="right"></th>
    <p class="left">Service ━━ Terms</p>
    <th class="right">Ch-teams</th>
    <p class="left">https Service</p>
  </footer>
  <script>
    const followBtn = document.getElementById('onclick')

    followBtn.addEventListener('click', async () => {
      const name = document.getElementById('name').value;
      const bio = document.getElementById('bio').value.trim();
      const url = document.getElementById('url').value.trim();
      const age = document.getElementById('age').value.trim();

      try {
        const response = await fetch('/user/new', {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, age, bio, url })
        })
        const data = await response.json()

        if (data.success) {
          document.getElementById('msg').innerHTML = \`✅ Success! Your URL: <a href="\${data.url}" target="_blank">\${data.url}</a>\`
        } else {
          document.getElementById('msg').textContent = 'Error: ' + data.error
        }
      } catch (e) {
        document.getElementById('msg').textContent = 'Error: ' + e.message
      }
    })
  </script>
</body>

</html>`)
})

app.post('/user/new', (req, res) => {
  const { name, age, bio, url } = req.body
  const id = generate()
  
  messages[id] = {
    name: name,
    old: age,
    followurl: url,
    bio: bio,
    created: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString(),
    views: 0
  }
  
  const fullUrl = `${req.protocol}://${req.get('host')}/user/m/${id}`
  
  res.json({
    success: true,
    id: id,
    url: fullUrl
  })
})

app.get('/user/m/:id', (req, res) => {
  const { id } = req.params
  const data = messages[id]
  
  if (!data) {
    return res.send(`
      <style>
        body { font-family: Arial; text-align: center; padding: 50px; background: #f0f0f0; }
        .error { background: white; padding: 20px; border-radius: 10px; }
      </style>
      <div class="error">
        <h2>❌ URL Expired or Not Found</h2>
        <p>The portfolio you're looking for doesn't exist or has been removed.</p>
        <a href="/">Create Yours Now →</a>
      </div>
    `)
  }
  
  data.views++
  
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>${data.name} | Portfolio</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          font-family: Arial, Helvetica, sans-serif;
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }
        .container {
          max-width: 400px;
          width: 100%;
        }
        .profile-card {
          background: white;
          border-radius: 20px;
          padding: 30px;
          text-align: center;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        .avatar {
          width: 100px;
          height: 100px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          font-size: 48px;
          font-weight: bold;
          color: white;
          text-transform: uppercase;
        }
        h2 {
          color: #333;
          margin-bottom: 10px;
        }
        .age {
          color: #667eea;
          font-size: 18px;
          margin-bottom: 15px;
        }
        .bio {
          color: #666;
          line-height: 1.6;
          margin-bottom: 20px;
          padding: 0 10px;
        }
        .follow-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 12px 30px;
          border-radius: 25px;
          font-size: 16px;
          cursor: pointer;
          margin: 20px 0;
          transition: transform 0.2s;
        }
        .follow-btn:hover {
          transform: scale(1.05);
        }
        .info {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #eee;
          font-size: 12px;
          color: #999;
        }
        .info p {
          margin: 5px 0;
        }
        .views {
          display: inline-block;
          background: #f0f0f0;
          padding: 5px 10px;
          border-radius: 15px;
          font-size: 12px;
        }
        .back-btn {
          display: inline-block;
          margin-top: 20px;
          color: white;
          text-decoration: none;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="profile-card">
          <div class="avatar">${data.name ? data.name.charAt(0).toUpperCase() : '?'}</div>
          <h2>${escapeHtml(data.name || 'No Name')}</h2>
          <div class="age">Age: ${escapeHtml(data.old || 'Not specified')}</div>
          <div class="bio">${escapeHtml(data.bio || 'No bio added yet')}</div>
          <button class="follow-btn" onclick="follow()">Follow Us</button>
          <div class="info">
            <p>Created: ${data.created} at ${data.time}</p>
            <p><span class="views">👁️ Views: ${data.views}</span></p>
          </div>
        </div>
        <div style="text-align: center;">
          <a href="/" class="back-btn">← Create Your Portfolio</a>
        </div>
      </div>
      <script>
        function follow() {
          const url = "${data.followurl || ''}";
          if (url) {
            window.open(url);
          } else {
            alert('Sorry, no follow URL was added');
          }
        }
      </script>
    </body>
    </html>
  `)
})

function escapeHtml(str) {
  if (!str) return ''
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:${PORT}\`)
})
