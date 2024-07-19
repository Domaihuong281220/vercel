const multer = require('multer');
// const {GridFsStorage} = require('multer-gridfs-storage');
const crypto = require("crypto");
const path = require("path");
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "upload/");
    },
    filename: function (req, file, cb) {
      // console.log(file);
      cb(null, file.fieldname + "-" + Date.now() + file.originalname);
    },
  });

  const upload = multer({ storage });
  module.exports = { upload };