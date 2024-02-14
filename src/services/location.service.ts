import { NextFunction, Response } from 'express'
import { IRequestCustom } from '~/middlewares/authentication'

import { provinces } from '~/utils/provinces'
import { district as districtData } from '~/utils/district'
import { ward as wardData } from '~/utils/ward'

class LocationService {
      static async getAllProvince(req: IRequestCustom) {
            return provinces
      }

      static async getDistrict(req: IRequestCustom) {
            const provinceCode = req.query.province
            const district = districtData.filter((districtItem) => districtItem['parent_code'] === provinceCode)

            return district
      }
      static async getWard(req: IRequestCustom) {
            const districtCode = req.query.district
            const ward = wardData.filter((wardItem) => wardItem['parent_code'] === districtCode)
            return ward
      }
}

export default LocationService
