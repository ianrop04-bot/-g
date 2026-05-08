const express = require('express');
const crypto = require('crypto');
const fs = require('fs');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==================== DATABASE ====================
const DB_FILE = './database.json';

function readDB() {
    try {
        if (!fs.existsSync(DB_FILE)) {
            fs.writeFileSync(DB_FILE, JSON.stringify({ profiles: [] }));
        }
        return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    } catch (err) {
        return { profiles: [] };
    }
}

function writeDB(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

function findProfile(id) {
    const db = readDB();
    return db.profiles.find(p => p.id === id);
}

function getAllProfiles() {
    const db = readDB();
    return db.profiles;
}

function saveProfile(profile) {
    const db = readDB();
    db.profiles.push(profile);
    writeDB(db);
}

function incrementViews(id) {
    const db = readDB();
    const profile = db.profiles.find(p => p.id === id);
    if (profile) {
        profile.views = (profile.views || 0) + 1;
        writeDB(db);
    }
}

function generateId() {
    return crypto.randomBytes(4).toString('hex');
}

// ==================== HOME PAGE ====================
app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portfolio Maker</title>
    <style>
        *{margin:0;padding:0;box-sizing:border-box}
        body{
            background:linear-gradient(135deg,#0f172a,#1e293b);
            font-family:'Segoe UI',sans-serif;
            min-height:100vh;
            display:flex;
            align-items:center;
            justify-content:center;
            padding:1rem;
        }
        .card{
            background:white;
            border-radius:1.5rem;
            padding:2rem;
            width:100%;
            max-width:480px;
            box-shadow:0 20px 40px rgba(0,0,0,0.3);
        }
        h1{text-align:center;color:#0f172a;margin-bottom:0.2rem;font-size:1.6rem}
        .sub{text-align:center;color:#64748b;font-size:0.85rem;margin-bottom:1.5rem}
        
        .form-group{margin-bottom:1rem}
        label{display:block;font-weight:600;color:#0f172a;margin-bottom:0.3rem;font-size:0.85rem}
        input,textarea{
            width:100%;
            padding:0.8rem;
            border:2px solid #e2e8f0;
            border-radius:0.6rem;
            font-size:0.9rem;
            font-family:inherit;
            outline:none;
            transition:0.3s;
        }
        input:focus,textarea:focus{border-color:#3b82f6}
        textarea{min-height:80px;resize:vertical}
        
        .color-picker{display:flex;gap:0.5rem;flex-wrap:wrap}
        .color-dot{
            width:35px;height:35px;border-radius:50%;cursor:pointer;
            border:3px solid transparent;transition:0.2s;
        }
        .color-dot:hover{transform:scale(1.1)}
        .color-dot.active{border-color:#0f172a}
        
        button{
            width:100%;
            padding:1rem;
            background:#3b82f6;
            color:white;
            border:none;
            border-radius:2rem;
            font-size:1rem;
            font-weight:600;
            cursor:pointer;
            font-family:inherit;
            margin-top:1rem;
            transition:0.3s;
        }
        button:hover{background:#2563eb;transform:translateY(-1px)}
        button:disabled{opacity:0.5;cursor:not-allowed;transform:none}
        
        .result{
            margin-top:1rem;
            padding:1rem;
            background:#f0fdf4;
            border-radius:0.8rem;
            display:none;
            text-align:center;
            animation:slideUp 0.3s ease;
        }
        @keyframes slideUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        .result a{color:#3b82f6;font-family:monospace;word-break:break-all;font-size:0.85rem}
        .result button{
            width:auto;
            padding:0.5rem 1.5rem;
            margin-top:0.8rem;
            font-size:0.85rem;
        }
        .copied{background:#059669!important}
        
        .saved-list{
            margin-top:1.5rem;
            border-top:1px solid #e2e8f0;
            padding-top:1rem;
        }
        .saved-list h3{color:#0f172a;font-size:0.95rem;margin-bottom:0.5rem}
        .saved-item{
            display:flex;
            justify-content:space-between;
            align-items:center;
            padding:0.5rem 0;
            border-bottom:1px solid #f1f5f9;
            font-size:0.85rem;
        }
        .saved-item a{color:#3b82f6;text-decoration:none}
        .saved-item span{color:#94a3b8;font-size:0.75rem}
    </style>
</head>
<body>
    <div class="card">
        <h1>🎨 Portfolio Maker</h1>
        <p class="sub">Fill in your details & get a permanent portfolio link</p>
        
        <div class="form-group">
            <label>👤 Full Name *</label>
            <input type="text" id="nameInput" placeholder="Your full name">
        </div>
        
        <div class="form-group">
            <label>🎂 Age</label>
            <input type="number" id="ageInput" placeholder="Your age" min="1" max="150">
        </div>
        
        <div class="form-group">
            <label>📝 Bio</label>
            <textarea id="bioInput" placeholder="Write something about yourself..."></textarea>
        </div>
        
        <div class="form-group">
            <label>🔗 Social/Follow URL</label>
            <input type="url" id="urlInput" placeholder="https://instagram.com/yourname">
        </div>
        
        <div class="form-group">
            <label>🎨 Avatar Color</label>
            <div class="color-picker" id="colorPicker">
                <div class="color-dot active" style="background:#3b82f6" data-color="#3b82f6"></div>
                <div class="color-dot" style="background:#8b5cf6" data-color="#8b5cf6"></div>
                <div class="color-dot" style="background:#ec4899" data-color="#ec4899"></div>
                <div class="color-dot" style="background:#ef4444" data-color="#ef4444"></div>
                <div class="color-dot" style="background:#f59e0b" data-color="#f59e0b"></div>
                <div class="color-dot" style="background:#10b981" data-color="#10b981"></div>
                <div class="color-dot" style="background:#06b6d4" data-color="#06b6d4"></div>
                <div class="color-dot" style="background:#0f172a" data-color="#0f172a"></div>
            </div>
        </div>
        
        <button id="createBtn" onclick="createPortfolio()">🚀 Create My Portfolio</button>
        
        <div class="result" id="result">
            <p style="font-weight:600;color:#166534;margin-bottom:0.5rem;">✅ Portfolio Created!</p>
            <a id="portfolioLink" href="#" target="_blank"></a>
            <br>
            <button onclick="copyLink()" id="copyBtn">📋 Copy Link</button>
        </div>
        
        <div class="saved-list" id="savedList">
            <h3>📜 Saved Portfolios</h3>
            <div id="savedItems" style="color:#94a3b8;font-size:0.85rem;">Loading...</div>
        </div>
    </div>
    
    <script>
        var selectedColor = '#3b82f6';
        var portfolioUrl = '';
        
        // Color picker
        document.getElementById('colorPicker').onclick = function(e) {
            if (e.target.classList.contains('color-dot')) {
                var dots = document.querySelectorAll('.color-dot');
                for (var i = 0; i < dots.length; i++) {
                    dots[i].classList.remove('active');
                }
                e.target.classList.add('active');
                selectedColor = e.target.getAttribute('data-color');
            }
        };
        
        // Load saved profiles
        loadSavedProfiles();
        
        function loadSavedProfiles() {
            fetch('/api/profiles')
            .then(function(res) { return res.json(); })
            .then(function(data) {
                var list = document.getElementById('savedItems');
                if (data.profiles.length === 0) {
                    list.innerHTML = 'No portfolios yet. Create one!';
                    return;
                }
                
                var html = '';
                for (var i = 0; i < data.profiles.length; i++) {
                    var p = data.profiles[i];
                    html += '<div class="saved-item">' +
                        '<a href="/p/' + p.id + '" target="_blank">' + p.name + '</a>' +
                        '<span>👁 ' + p.views + ' views</span>' +
                    '</div>';
                }
                list.innerHTML = html;
            });
        }
        
        function createPortfolio() {
            var name = document.getElementById('nameInput').value.trim();
            var age = document.getElementById('ageInput').value.trim();
            var bio = document.getElementById('bioInput').value.trim();
            var url = document.getElementById('urlInput').value.trim();
            
            if (!name) {
                alert('Please enter your name!');
                return;
            }
            
            var btn = document.getElementById('createBtn');
            btn.disabled = true;
            btn.textContent = '⏳ Creating...';
            
            fetch('/create', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    name: name,
                    age: age,
                    bio: bio,
                    url: url,
                    color: selectedColor
                })
            })
            .then(function(res) { return res.json(); })
            .then(function(data) {
                if (data.success) {
                    portfolioUrl = data.url;
                    var link = document.getElementById('portfolioLink');
                    link.href = data.url;
                    link.textContent = data.url;
                    document.getElementById('result').style.display = 'block';
                    
                    // Clear form
                    document.getElementById('nameInput').value = '';
                    document.getElementById('ageInput').value = '';
                    document.getElementById('bioInput').value = '';
                    document.getElementById('urlInput').value = '';
                    
                    // Refresh saved list
                    loadSavedProfiles();
                } else {
                    alert('Error: ' + data.error);
                }
            })
            .catch(function(err) {
                alert('Connection error!');
            })
            .finally(function() {
                btn.disabled = false;
                btn.textContent = '🚀 Create My Portfolio';
            });
        }
        
        window.copyLink = function() {
            var btn = document.getElementById('copyBtn');
            navigator.clipboard.writeText(portfolioUrl).then(function() {
                btn.textContent = '✅ Copied!';
                btn.classList.add('copied');
                setTimeout(function() {
                    btn.textContent = '📋 Copy Link';
                    btn.classList.remove('copied');
                }, 2000);
            });
        };
    </script>
</body>
</html>
    `);
});

// ==================== API: CREATE PORTFOLIO ====================
app.post('/create', (req, res) => {
    const { name, age, bio, url, color } = req.body;
    
    if (!name || name.trim().length === 0) {
        return res.json({ success: false, error: 'Name is required' });
    }
    
    const id = generateId();
    
    const profile = {
        id,
        name: name.trim(),
        age: age || '',
        bio: bio || '',
        url: url || '',
        color: color || '#3b82f6',
        created: new Date().toISOString(),
        views: 0
    };
    
    // Save to database
    saveProfile(profile);
    
    const portfolioUrl = `${req.protocol}://${req.get('host')}/p/${id}`;
    
    console.log('✅ Portfolio saved:', portfolioUrl);
    
    res.json({ success: true, url: portfolioUrl, id });
});

// ==================== API: GET ALL PROFILES ====================
app.get('/api/profiles', (req, res) => {
    const profiles = getAllProfiles();
    // Return last 10, newest first
    const sorted = profiles
        .sort((a, b) => new Date(b.created) - new Date(a.created))
        .slice(0, 10);
    
    res.json({ success: true, profiles: sorted });
});

// ==================== API: GET SINGLE PROFILE ====================
app.get('/api/profile/:id', (req, res) => {
    const profile = findProfile(req.params.id);
    
    if (!profile) {
        return res.json({ success: false, error: 'Profile not found' });
    }
    
    res.json({ success: true, profile });
});

// ==================== VIEW PORTFOLIO PAGE ====================
app.get('/p/:id', (req, res) => {
    const { id } = req.params;
    const profile = findProfile(id);
    
    if (!profile) {
        return res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Not Found</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body{
                        font-family:sans-serif;
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        min-height:100vh;
                        background:#0f172a;
                        color:white;
                        text-align:center;
                    }
                    a{color:#3b82f6}
                </style>
            </head>
            <body>
                <div>
                    <h1>🔍 Portfolio Not Found</h1>
                    <p>This link doesn't exist.</p>
                    <a href="/">Create Your Portfolio →</a>
                </div>
            </body>
            </html>
        `);
    }
    
    // Increment views in database
    incrementViews(id);
    const updatedProfile = findProfile(id);
    
    const initial = profile.name.charAt(0).toUpperCase();
    
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${profile.name} | Portfolio</title>
        <style>
            *{margin:0;padding:0;box-sizing:border-box}
            body{
                background:linear-gradient(135deg,#f8fafc,#e2e8f0);
                font-family:'Segoe UI',sans-serif;
                min-height:100vh;
                display:flex;
                align-items:center;
                justify-content:center;
                padding:1rem;
            }
            .profile-card{
                background:white;
                border-radius:2rem;
                padding:3rem 2rem;
                text-align:center;
                max-width:420px;
                width:100%;
                box-shadow:0 20px 60px rgba(0,0,0,0.1);
                position:relative;
                overflow:hidden;
            }
            .profile-card::before{
                content:'';
                position:absolute;
                top:0;left:0;right:0;
                height:120px;
                background:${profile.color};
            }
            .avatar{
                width:100px;
                height:100px;
                border-radius:50%;
                background:${profile.color};
                display:flex;
                align-items:center;
                justify-content:center;
                font-size:3rem;
                font-weight:bold;
                color:white;
                margin:0 auto 1rem;
                position:relative;
                z-index:1;
                border:4px solid white;
                box-shadow:0 4px 15px rgba(0,0,0,0.2);
            }
            h1{
                font-size:1.5rem;
                color:#0f172a;
                margin-bottom:0.3rem;
            }
            .age{
                display:inline-block;
                background:#f1f5f9;
                color:#64748b;
                padding:0.3rem 1rem;
                border-radius:2rem;
                font-size:0.85rem;
                margin-bottom:1rem;
            }
            .bio{
                color:#475569;
                line-height:1.6;
                margin-bottom:1.5rem;
                font-size:0.95rem;
                padding:0 1rem;
            }
            .follow-btn{
                display:inline-block;
                padding:0.8rem 2.5rem;
                background:${profile.color};
                color:white;
                text-decoration:none;
                border-radius:2rem;
                font-weight:600;
                font-size:0.95rem;
                transition:0.3s;
            }
            .follow-btn:hover{
                transform:translateY(-2px);
                box-shadow:0 10px 25px rgba(0,0,0,0.2);
            }
            .views{
                margin-top:1rem;
                color:#94a3b8;
                font-size:0.8rem;
            }
            .create-link{
                display:block;
                margin-top:1rem;
                color:#3b82f6;
                text-decoration:none;
                font-size:0.85rem;
            }
        </style>
    </head>
    <body>
        <div class="profile-card">
            <div class="avatar">${initial}</div>
            <h1>${profile.name}</h1>
            ${profile.age ? '<div class="age">🎂 ' + profile.age + ' years old</div>' : ''}
            ${profile.bio ? '<p class="bio">' + profile.bio + '</p>' : ''}
            ${profile.url ? '<a class="follow-btn" href="' + profile.url + '" target="_blank">🔗 Follow Me</a>' : ''}
            <div class="views">👁️ ${updatedProfile.views} views</div>
            <a class="create-link" href="/">⚡ Create Your Portfolio</a>
        </div>
    </body>
    </html>
    `);
});

// ==================== START SERVER ====================
const PORT = process.env.PORT || 3230;
app.listen(PORT, () => {
    console.log('🎨 Portfolio Maker running on port ' + PORT);
    console.log('💾 Database: ' + DB_FILE);
});
