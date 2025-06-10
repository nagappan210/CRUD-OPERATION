const express = require('express');
const db = require('./db');
const cors = require('cors');
const multer = require('multer');
const bodyParser = require('body-parser');
const sendMailToUser  = require('./sendmail');
const path = require('path');
const bcrypt = require('bcrypt');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const jwt_secret = "your_jwt_secret_key_here";
const PORT = process.env.PORT || 7000;

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/uploaded', express.static(path.join(__dirname, 'uploaded')));

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "Token missing" });
  console.log("Auth header received:", authHeader);

  const token = authHeader && authHeader.split(" ")[1];
   if (!token) {
    console.log("Token missing");
    return res.status(403).json({ error: 'Token missing' });
  }
  jwt.verify(token, jwt_secret, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = user;
    next();
  });
}


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploaded'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

app.post('/register', async (req, res) => {
  const { name, password, email } = req.body;
  if (!name || !password || !email)
    return res.status(400).json({ error: 'Missing user info' });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO details (name, password, email, create_at) VALUES (?, ?, ?, NOW())';
    const [result] = await db.query(query, [name, hashedPassword, email]);
    res.status(201).json({ id: result.insertId, message: 'User registered successfully' });
  } catch (err) {
    console.error('Error adding user:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/admin_register',authenticateToken,upload.array("image"), async (req, res) => {
  const { name, password, email ,age,number} = req.body;
  const files = req.files; 
  if (!name || !password || !email|| !age || !number || !files || files.length === 0)
    return res.status(400).json({ error: 'Missing user info' });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO details (name, password, email, age,number, create_at) VALUES (?, ?, ?,?,?, NOW())';
    const [result] = await db.query(query, [name, hashedPassword, email,age,number]);
    const userId = result.insertId;
    const imagerow = files.map(f => [userId, f.filename]);
    await db.query('INSERT INTO details1 (id, image) VALUES ?', [imagerow]);
    res.status(201).json({ id: result.insertId, message: 'User registered successfully' });
  } catch (err) {
    console.error('Error adding user:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post("/details/:id", upload.array("image", 10), async (req, res) => {
  const userId = req.params.id;
  const { age, number } = req.body;

  if (!age || !number || !req.files || req.files.length === 0) {
    return res.status(400).json({ error: "Age, number, and images are required" });
  }

  try {
    await db.query(
      "UPDATE details SET age = ?, number = ? WHERE id = ? AND delete_at IS NULL",
      [age, number, userId]
    );

    const insertImagePromises = req.files.map((file) =>
      db.query(
        "INSERT INTO details1 (p_id, image) VALUES (?, ?)",
        [userId, file.filename]
      )
    );
    await Promise.all(insertImagePromises);

    res.json({ message: "Details and images updated successfully" });
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});



app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'Email and password are required' });

  try {
    const [rows] = await db.query('SELECT * FROM details WHERE email = ? AND delete_at IS NULL', [email]);
    
    if (rows.length === 0)
      return res.status(404).json({ error: 'User not found' });
    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ error: 'Invalid password' });

    const token = jwt.sign({ id: user.id, email: user.email }, jwt_secret, { expiresIn: '1h' });
    res.json({ token, id: user.id, email: user.email, roll: user.roll });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/admin', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM details WHERE roll=1 AND delete_at IS NULL');
    res.json(rows);
  } catch (err) {
    console.error('Get admin data error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/get/:id', authenticateToken, async (req, res) => {
  const userId = req.params.id;

  try {
    const sql = `
      SELECT d.id, d.name, d.email, d.age, d.number, d.canedit, d.canchangepassword,
      GROUP_CONCAT(i.image) AS images
      FROM details d 
      LEFT JOIN details1 i ON d.id = i.id
      WHERE d.id = ? AND d.delete_at IS NULL
      GROUP BY d.id
    `;
    const [result] = await db.query(sql, [userId]);
    if (result.length === 0) return res.status(404).json({ error: "User not found" });

    const user = result[0];
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      age: user.age,
      number: user.number,
      canedit: !!user.canedit,
      canchangepassword: !!user.canchangepassword,
      images: user.images ? user.images.split(',') : []
    });
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/password/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;
  if (!password) return res.status(400).json({ error: 'Password is required' });

  try {
    const hashed = await bcrypt.hash(password, 10);
    await db.query('UPDATE details SET password=? WHERE id=? AND delete_at IS NULL', [hashed, id]);
    res.json({ message: 'User password updated successfully' });
  } catch (err) {
    console.error('Password update error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/update_all/:id', authenticateToken , upload.array('newImages', 10), async (req, res) => {
  console.log('hit')
  const { id } = req.params;
  

  const { name, age, number, email, canedit, canchangepassword } = req.body;
   const caneditBool = canedit === '1' || canedit === 'true' ? 1 : 0;
    const canchangepasswordBool =
      canchangepassword === '1' || canchangepassword === 'true' ? 1 : 0;

  const deleteImages = req.body['deleteImages[]']
    ? Array.isArray(req.body['deleteImages[]'])
      ? req.body['deleteImages[]']
      : [req.body['deleteImages[]']]
    : [];
  
  
  try {
    await db.query(
      `UPDATE details 
      SET name = ?, age = ?, number = ?, email = ?, canedit = ?, canchangepassword = ? 
      WHERE id = ? AND delete_at IS NULL`,
      [name, age, number, email, caneditBool, canchangepasswordBool, id]
    );

    for (const filename of deleteImages) {
      await db.query('DELETE FROM details1 WHERE id = ? AND image = ?', [id, filename]);
      const filePath = path.join(__dirname, 'uploaded', filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    if (req.files && req.files.length > 0) {
      const imageData = req.files.map(file => [id, file.filename]);
      await db.query('INSERT INTO details1 (id, image) VALUES ?', [imageData]);
    }

    res.json({ message: 'User info and images updated successfully' });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ error: 'Update failed' });
  }
});

app.put('/user_update_all/:id', authenticateToken , upload.array('newImages', 10), async (req, res) => {
  const { id } = req.params;
  const { name, age, number, email} = req.body;
 
  const deleteImages = req.body['deleteImages[]']
    ? Array.isArray(req.body['deleteImages[]'])
      ? req.body['deleteImages[]']
      : [req.body['deleteImages[]']]
    : [];
  
  
  try {
    await db.query(
      `UPDATE details 
      SET name = ?, age = ?, number = ?, email = ?
      WHERE id = ? AND delete_at IS NULL`,
      [name, age, number, email, id]
    );

    for (const filename of deleteImages) {
      await db.query('DELETE FROM details1 WHERE id = ? AND image = ?', [id, filename]);
      const filePath = path.join(__dirname, 'uploaded', filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    if (req.files && req.files.length > 0) {
      const imageData = req.files.map(file => [id, file.filename]);
      await db.query('INSERT INTO details1 (id, image) VALUES ?', [imageData]);
    }

    res.json({ message: 'User info and images updated successfully' });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ error: 'Update failed' });
  }
});


app.delete('/delete/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('UPDATE details SET delete_at = NOW() WHERE id = ?', [id]);
    res.json({ message: 'User soft deleted' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/delete-image/:id/:filename', authenticateToken, async (req, res) => {
  const { id, filename } = req.params;

  try {
    await db.query('DELETE FROM details1 WHERE id = ? AND image = ?', [id, filename]);
    const filePath = path.join(__dirname, 'uploaded', filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    res.json({ message: 'Image deleted successfully' });
  } catch (err) {
    console.error('Image delete error:', err);
    res.status(500).json({ error: 'Image deletion failed' });
  }
});

app.post('/sendemail', async (req, res) => {
  const { email, subject, text } = req.body;
  if (!email || !subject || !text) return res.status(400).json({ error: 'Missing email parameters' });

  try {
    await sendMailToUser(email, subject, text);
    res.json({ message: 'Email sent' });
  } catch (err) {
    console.error('Email send error:', err);
    res.status(500).json({ error: 'Email send failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
