var express = require('express');
var router = express.Router();
const fs = require('fs')
const multer  = require('multer')
const storage = multer.diskStorage({
  // note if you pass destination a function then you must manually create the folder, when passing destination a string make sure that the folder doesn't already exist otherwise it will throw error
  destination: './tmp/uploads',
  filename: function (req, file, cb) {
    // in this case we're not making the name unique becasue we'll delete them staight away but in other case it's advise to make it unique
    cb(null, file.originalname)
  }
})

// adding option to multer, limit file size and file types
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024*100,
    files: 1
  },
  // // example of limiting file type
  // fileFilter: function (req, file, next) {
  //   var ext = path.extname(file.originalname);

  //   // if file is txt then carry on as usual
  //   if(_.indexOf(['.txt'], ext) !== -1) {
  //       return next(null, true);
  //   }
  //   // if not then pass make a new error object and pass it down to error handler
  //   let err = new Error('Wrong file type!')
  //   err.code = 403
  //   next(err);
  // }
})

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/fileupload', upload.single('file'), function (req, res, next) {
  // delete the file after upload
  fs.unlink(`./tmp/uploads/${req.file.filename}`, (err) => {
    if (err) console.log(new Error('could not delete temporary upload folder'))
  })
  res.json({
    filesize: `${req.file.size} bytes`
  })
})

module.exports = router;
