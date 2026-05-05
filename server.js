const express = require('express')
const crypto = require('crypto')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

function generate(){
  return crypto.randomBytes(7).toString('hex')
}

app.get('/', (req, res)=>{
  res.send(`<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Portfolio Maker</title>
</head>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
 <style>
   *{
  margin:0;
  padding:0;
}
body{
  background:radial-gradient(#00B4FF,#0027FF,#00FFCB);
  font-size: 16px;
  font-family: Bold, Courier, monospace;
  font-stretch:50rem;
  max-width: 290px;
}
input , textarea{
  margin:10px;
  padding:18px;
  border-radius:10px;
  border:1px solid #5D5D62;
  outline-color:#00B4FF;
}
#age{
  width:20px;
}
.card{
  background: white;
  padding:10px;
}
footer{
  color:white;
}
footer a{
  font-size: 20px;
  font-family: bold;
  color:#FF009B;
}
.icon{
  width:30px;
  height:30px;
  text-align: center;
  justify-items: center;
  border-radius: 30px;
  background:green;
  align-items: center;
}
.btb{
  position:fixed;
  right: 20px;
  bottom:20px;
  margin:10px;
  padding:16px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  border-bottom-left-radius: 20px;
  background:#06F0FF;
  border:none;
}
.btb:active{
  background:#065DFF;
}
#onclick{
  background :linear-gradient(136deg,#065DFF,#00CAFF);
  padding:15px;
  margin:10px;
  width:50%;
  color:white;
  font-family:bold;
  border: none;
  border-radius: 40px;
}
 </style>
<body> 
<br>
<br />
  <div class="card">
    <h2>Portfolio Url Maker</h2>
    <br />
    <br />
    <div class="Profile"id="pro">
      
    </div>
    <input type="text" placeholder=" Enter Your Name"id="name">
    <input type="text" placeholder="Age" id="age">
    <input type="url" placeholder="Follow button Url (optional)" id="url"><br>
  
    <textarea placeholder="Enter Your Bio" id="bio" rows="8" cols="20"></textarea>
    <button id="onclick"><i class="fas fa-url"></i>Generate URL</button>
  </div>
  <button class="btb"onclick="window.open('congenial-winner-1.vercel.app')">💌</button>
  <footer>
    <a href="/" class="crt">← Create Yours Now</a>
    <div class="icon"onclick="window.open('https://whatsapp.com/channel/0029Vb71mgIElaglZCU0je0x')"><i class="fab fa-whatsapp"></i></div>
    <p class="left">Service | Team</p>
    <th class="right"></th>
    <p class="left">Service ━━ Terms</p>
    <th class="right">Ch-teams</th>
    <p class="left">https Service</p>
  </footer>
  <script>
    const name = document.getElementById('name').value;
    const bio = document.getElementById('bio').value.trim();
    const url = document.getElementById('url').value.trim();
    const age = document.getElementById('age').value.trim();
    const followBtn = document.getElementById('onclick')
    
    followBtn.addEventListener('click', async()=>{
      try{
      const response = await fetch('/user/new',{
        method:"POST",
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({ name , age , bio , url})
      })
      const data = await response.json()
      
      if(data.success){
        document.getElementById('msg').textContent= data.url
      }
      }catch (e){
        document.getElementById('msg').textContent='Error :'+ error
      }
    })
    

  </script>
</body>

</html>`)
})
const messages = {}
app.post('/user/new', async(req, res)=> {
  const {username , old ,bio,followurl} = req.body
  const sessonId = generate()
  message[sessonId] = {
    name:username,
    old:old,
    followurl:followurl,
    bio:bio,
    created:new Date.toLocaleDateString(),
    time:new Date.toLocaleTimeString(),
    view:0
  }
  const url = `${req.protocol}://${req.get('host')}/m/${sessonId}`;
  
  res.json({
    success:true,
    sessonId:sessonId,
    url:url
  })
})

app.get('/user/m/:sessonId', (req,res)=>{
  const { sessonId } = req.params
  const data = messages[sessonId]
  
  if (!data) {
    res.send(`
       Url Expired Or Website restarted
    `)
  }
  
  message[sessonId].view++
  
  res.send(`
  <style>
  body{
    background:E9E9E9
  }
    #profile {
  margin: 89 px;
  padding: 20 px;
  border - radius: 30 px;
  text - align: center;
  background: #FF007D;
  font - size: 15 px;
  color: white;
  font - weight: 30 px;
}
.card {
  margin: 10 px;
  padding: 20 px;
  border - radius: 15 px;
  background: white;
}
#p,#cr,#views{
  color:gray;
  text-align:right;
}
</style>
  <div>
    <div id="profile"></div>
    <h3 id="name"></h3>
    <h4 id="age"></h4>
    <h4 id="bio"></h4>
    <p id="p"></p>
    <p id="cr"></p>
    <p id="views"></p>
    <button onclick("window.open(data.followurl || alert('Am sorry no followUrl was added')>Follow Us</button>
    <script>
      document.getElementById('profile').textContent= data.name.charAt(0).toUpperCase()
      document.getElementById('name').textContent= data.name
      document.getElementById('age').textContent= data.old
      document.getElementById('bio').textContent = data.bio
      document.getElementById('p').textContent= data.time
      document.getElementById('cr').textContent= 'Created At :'+ data.created
      document.getElementById('veiws').textContent= 'Views:'+ data.veiws
    </script>
  </div>
  `)
})
