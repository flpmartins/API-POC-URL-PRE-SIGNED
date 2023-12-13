require('dotenv').config
const AWS = require('aws-sdk')

const multer = require('multer')
const upload = multer()

const AWSListObjectService = require('../service/AWSListObjectService')
const S3Service = require("../service/AWSUploadObjectService")

module.exports = {
  async awsUpdateNotURL(request, response) {
    try {
      const s3 = new AWS.S3()
      await s3.putObject({
        Body: 'hello world',
        Bucket: 'flpmartins',
        Key: 'teste.txt',
      }).promise()

      return response.json({ message: true })
    } catch (error) {
      return response.status(500).json({ error: 'Erro interno do servidor' })
    }
  },

  async ListObjectBucket(request, response) {
    try {
      const { key, bucket } = request.query

      if (!key || !bucket) {
        return response.status(400).json({ error: 'Parâmetros key e bucket são necessários.' })
      }

      const signedUrl = await AWSListObjectService.generateSignedUrl(key, bucket)

      return response.json({ signedUrl })
    } catch (error) {
      return response.status(500).json({ error: 'Erro interno do servidor' })
    }
  },

  async URLsignedPut(request, response) {
    const REGION = process.env.AWS_REGION;
    const BUCKET = process.env.AWS_BUCKET;

    try {
      const KEY = request.query.key;

      if (!KEY) {
        return response.status(400).json({ error: 'Parâmetro key é necessário.' });
      }

      const noClientUrl = await S3Service.createPresignedUrlWithoutClient({
        region: REGION,
        bucket: BUCKET,
        key: KEY,
      });

      console.log(noClientUrl);

      return response.json({ signedUrl: noClientUrl });
    } catch (err) {
      console.error(err);
      return response.status(500).json({ error: 'Internal Server Error' });
    }
  }
}