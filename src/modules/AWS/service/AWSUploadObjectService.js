const https = require("https");
const { HttpRequest } = require("@smithy/protocol-http")
const { S3RequestPresigner } = require("@aws-sdk/s3-request-presigner")
const { parseUrl } = require("@smithy/url-parser")
const { formatUrl } = require("@aws-sdk/util-format-url")
const { Hash } = require("@smithy/hash-node")

require('dotenv').config()

class S3Service {
  static async createPresignedUrlWithoutClient({ region, bucket, key }) {
    const url = parseUrl(`https://${bucket}.s3.${region}.amazonaws.com/${key}`)
    const presigner = new S3RequestPresigner({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
      sha256: Hash.bind(null, "sha256"),
    })

    const signedUrlObject = await presigner.presign(
      new HttpRequest({ ...url, method: "PUT" }),
    )

    return formatUrl(signedUrlObject)
  }
}

module.exports = S3Service