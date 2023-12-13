const unzipper = require('unzipper')
const { S3 } = require('aws-sdk')
require('dotenv').config()
const fs = require('fs').promises

const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

exports.handler = async (event) => {
  const s3Event = event.Records[0].s3
  const bucket = s3Event.bucket.name
  const key = s3Event.object.key
  const extractionPath = '/tmp/extracted'

  try {
    const downloadParams = {
      Bucket: bucket,
      Key: key,
    };
    const zipFile = await s3.getObject(downloadParams).promise();

    if (!fs.existsSync(extractionPath)) {
      await fs.mkdir(extractionPath);
    }

    await fs.createReadStream(zipFile.Body)
      .pipe(unzipper.Extract({ path: extractionPath }))

    console.log('Arquivo zip descompactado com sucesso.')
    return {
      statusCode: 200,
      body: JSON.stringify('Arquivo zip descompactado com sucesso.'),
    };
  } catch (error) {
    console.error('Erro ao descompactar o arquivo zip:', error);

    return {
      statusCode: 500,
      body: JSON.stringify('Erro ao descompactar o arquivo zip.'),
    }
  }
}
