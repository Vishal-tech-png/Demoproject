const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

// Setup MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'movie_booking'
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});

// Email transporter setup (for OTP)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'vishalkheni94@gmail.com',
    pass: 'phxrluzmnssxnzlx'
  }
});

// User login route (send OTP)
app.post('/api/login', (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
  db.query("SELECT * FROM users WHERE email = ?",
    [email], (err, res1) => {
      if (err) {
        console.error('Error getting user:', err);
        res.status(500).send('Error getting user');
        return;
      } else {
        if (res1.length <= 0) {
          // Save OTP to the database (or in-memory storage)
          db.query('INSERT INTO users (email, otp) VALUES (?, ?)', [email, otp], (err) => {
            if (err) {
              console.error('Error saving OTP:', err);
              res.status(500).send('Error sending OTP');
              return;
            }
          });
        } else {
          db.query('UPDATE users SET otp = ? WHERE email = ?', [otp, email], (err) => {
            if (err) {
              console.error('Error saving OTP:', err);
              res.status(500).send('Error sending OTP');
              return;
            }
          });
        }

        // Send OTP via email
        transporter.sendMail({
          to: email,
          subject: 'Your OTP Code',
          text: `Your OTP code is ${otp}`
        }, (err) => {
          if (err) {
            console.error('Error sending email:', err);
            res.status(500).send('Error sending OTP email');
            return;
          }

          res.status(200).send('OTP sent successfully');
        });
      }
    }
  );

});

app.post('/api/resendotp', (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
  db.query('UPDATE users SET otp = ? WHERE email = ?', [otp, email], (err) => {
    if (err) {
      console.error('Error saving OTP:', err);
      res.status(500).send('Error sending OTP');
      return;
    }
  });

  // Send OTP via email
  transporter.sendMail({
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}`
  }, (err) => {
    if (err) {
      console.error('Error sending email:', err);
      res.status(500).send('Error sending OTP email');
      return;
    }

    res.status(200).send('OTP send successfully');
  });
});

// OTP verification route
app.post('/api/verify-otp', (req, res) => {
  const { email, otp } = req.body;

  db.query('SELECT * FROM users WHERE email = ? AND otp = ?', [email, otp], (err, results) => {
    if (err) {
      console.error('Error verifying OTP:', err);
      res.status(500).send('Error verifying OTP');
      return;
    }

    if (results.length > 0) {
      res.status(200).send({ results: results[0], message: 'OTP verified' });
    } else {
      res.status(400).send('Invalid OTP');
    }
  });
});

// Fetch movies
app.get('/api/movies', (req, res) => {
  db.query('SELECT * FROM movies', (err, results) => {
    if (err) {
      console.error('Error fetching movies:', err);
      res.status(500).send('Error fetching movies');
      return;
    }
    res.json(results);
  });
});

// Fetch showtimes for a specific movie
app.get('/api/showtimes/:movieId', (req, res) => {
  const { movieId } = req.params;
  db.query('SELECT * FROM show_times WHERE movie_id = ?', [movieId], (err, results) => {
    if (err) {
      console.error('Error fetching showtimes:', err);
      res.status(500).send('Error fetching showtimes');
      return;
    }
    res.json(results);
  });
});

// Fetch seats for a specific showtime
app.get('/api/seats/:showTimeId', (req, res) => {
  const { showTimeId } = req.params;
  db.query('SELECT t1.*,IFNULL(t2.tickit_booked_id,0) as is_tickit_booked\n\
     FROM seats t1 LEFT JOIN user_booked_seat t2 ON t1.id = t2.seat_id AND t2.tickit_status = 0 \n\
      WHERE t1.show_time_id = ? order by t1.seat_number ASC', [showTimeId], (err, results) => {
    if (err) {
      console.error('Error fetching seats:', err);
      res.status(500).send('Error fetching seats');
      return;
    }
    res.json(results);
  });
});

// Ticket booking
app.post('/api/book-ticket', (req, res) => {
  const { showTimeId, seatNumbers, selectedSeatsids, userId, movieid } = req.body;
  // Update seat availability and insert booking
  seatNumbers.forEach((seatNumber, index) => {
    db.query(`SELECT COUNT(*) as tickit_available FROM user_booked_seat where seat_id IN (${selectedSeatsids.join(",")}) AND tickit_status = 0`, (err, res1) => {
      if (err) {
        console.error('Error booking seat:', err);
        res.status(500).send('Error booking seat');
        return;
      } else {
        if (res1[0]["tickit_available"] == 1) {
          return res.status(422).send('your are not able to book this seat');
        } else {
          db.query(`INSERT INTO user_booked_seat(user_id,movie_id,seat_id,tickit_status) VALUES(?,?,?,0)`, [userId, movieid, selectedSeatsids[index]], (err, res2) => {
            if (err) {
              console.error('Error booking seat:', err);
              res.status(500).send('Error booking seat');
              return;
            }
          }
          )
        }
      }
    });
  });

  res.status(200).send('Ticket booked successfully');
});

// Ticket booking
app.post('/api/mytickets', (req, res) => {
  const { userId } = req.body;
  db.query(`SELECT t1.*,t2.title,t2.image,t2.genre,t3.seat_number,t4.time \n\
     FROM user_booked_seat t1\n\
     LEFT JOIN movies t2 ON t1.movie_id = t2.id\n\
     LEFT JOIN seats t3 ON t1.seat_id = t3.id\n\
     LEFT JOIN show_times t4 ON t1.movie_id = t4.movie_id\n\
     WHERE t1.user_id = ? AND t1.tickit_status = 0 group by t1.seat_id`,[userId], (err, res1) => {
    if (err) {
      console.error('Error booking seat:', err);
      res.status(500).send('Error booking seat');
      return;
    }
    res.status(200).send(res1);
  });
});

app.post('/api/canceltickets', (req, res) => {
  const { ticketId } = req.body;
  console.log(ticketId);
  db.query(`UPDATE user_booked_seat SET tickit_status = 1 WHERE tickit_booked_id = ?`,[ticketId], (err, res1) => {
    if (err) {
      console.error('Error booking seat:', err);
      res.status(500).send('Error booking seat');
      return;
    }
    res.status(200).send(res1);
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
