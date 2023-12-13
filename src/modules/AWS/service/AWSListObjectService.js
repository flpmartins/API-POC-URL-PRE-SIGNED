require('dotenv').config()

const AWS = require('aws-sdk')

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
})

const s3 = new AWS.S3()

module.exports = {
  async generateSignedUrl(key, bucket, expirationTime = 60000) {
    const params = {
      Bucket: bucket,
      Key: key,
      Expires: expirationTime,
    }

    return new Promise((resolve, reject) => {
      s3.getSignedUrl('getObject', params, (err, url) => {
        if (err) {
          reject(err)
        } else {
          resolve(url)
        }
      })
    })
  },
}