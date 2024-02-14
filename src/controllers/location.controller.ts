import { NextFunction, Response } from 'express'
import { OK } from '~/Core/response.success'
import { IRequestCustom } from '~/middlewares/authentication'
import LocationService from '~/services/location.service'

class LocationController {
      static async getAllProvince(req: IRequestCustom, res: Response, next: NextFunction) {
            return new OK({ metadata: await LocationService.getAllProvince(req) }).send(res)
      }

      static async getDistrict(req: IRequestCustom, res: Response, next: NextFunction) {
            return new OK({ metadata: await LocationService.getDistrict(req) }).send(res)
      }
      static async getWard(req: IRequestCustom, res: Response, next: NextFunction) {
            return new OK({ metadata: await LocationService.getWard(req) }).send(res)
      }
}

export default LocationController
