import { Router } from 'express'
import { asyncHandler } from '~/helpers/asyncHandler'

import authentication from '~/middlewares/authentication'
import LocationController from '~/controllers/location.controller'
const locationRouter = Router()

// locationRouter.use(authentication)
locationRouter.get('/get-all-province', asyncHandler(LocationController.getAllProvince))
locationRouter.get('/get-district', asyncHandler(LocationController.getDistrict))
locationRouter.get('/get-ward', asyncHandler(LocationController.getWard))

export default locationRouter
