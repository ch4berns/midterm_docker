
var express = require('express')
var multer = require('multer')
var mysql = require('mysql')
var logger = require('./logger.js')

var port = 3000;

var app = express()


const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "testdb"
})

db.connect(function (err) {
  if (err) {
    return console.error('error: ' + err.message);
  }
  console.log("Connected to Mysql!")
})


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
var upload = multer({ storage: storage })

app.use(express.static(__dirname + '/public'));
app.use('/uploads', express.static('uploads'));

app.post('/profile-upload-single', upload.single('profile-file'), function (req, res, next) {

  if (!req.file) {
    logger.warn("No file upload!");
  } else {
    var imgsrc = 'http://127.0.0.1:3000/' + req.file.filename
    var insertData = "INSERT INTO users_file(file_src)VALUES(?)"
    db.query(insertData, [imgsrc], (err, result) => {
      if (err) throw err
      console.log("uploaded successfuly to Mysql!")
    })
  }
  logger.info('http://127.0.0.1:3000/' + req.file.filename);
  
  var response = '<a href="/">Home</a><br>'
  response += "<h2>Files uploaded successfully.</h2><br>"
  response += `<img style="width:50%;" src="${req.file.path}"/><br>`
  return res.send(response)
})

app.post('/profile-upload-multiple', upload.array('profile-files', 12), function (req, res, next) {
  // req.files is array of `profile-files` files
  // req.body will contain the text fields, if there were any
  if (!req.files) {
    logger.warn("No file upload!");
  } else {
      for (var i = 0; i < req.files.length; i++) {
        var imgsrc = 'http://127.0.0.1:3000/' + req.files
        var insertData = "INSERT INTO users_file(file_src)VALUES(?)"
        db.query(insertData, [imgsrc], (err, result) => {
          if (err) throw err
          console.log("uploaded successfuly to Mysql!")
      })
    }
  }

logger.info(JSON.stringify(req.files));

var response = '<a href="/">Home</a><br>'
response += "<h2>Multiple Files uploaded successfully.</h2><br>"
for (var i = 0; i < req.files.length; i++) {
  response += `<img style="width: 50%;" src="${req.files[i].path}" /><br>`
}

return res.send(response)
})


app.listen(port, () => logger.info(`Server running on port ${port}!`))