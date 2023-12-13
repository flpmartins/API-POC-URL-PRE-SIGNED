const { Router } = require('express')

const awsRouters = require('../../modules/AWS/routes/aws.routes')

const routes = Router()

routes.use('/aws', awsRouters)

module.exports = routes