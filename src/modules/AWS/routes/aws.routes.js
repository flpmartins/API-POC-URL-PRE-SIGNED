const { Router } = require('express')

const {
  awsUpdateNotURL,
  ListObjectBucket,
  URLsignedPut

} = require('../controller/aws.controller')

const awsRouters = Router()

awsRouters.get('/', awsUpdateNotURL)
awsRouters.get('/ListObject', ListObjectBucket)
awsRouters.get('/putObject', URLsignedPut)

module.exports = awsRouters