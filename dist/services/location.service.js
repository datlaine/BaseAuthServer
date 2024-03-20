"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const provinces_1 = require("../utils/provinces");
const district_1 = require("../utils/district");
const ward_1 = require("../utils/ward");
class LocationService {
    static async getAllProvince(req) {
        return provinces_1.provinces;
    }
    static async getDistrict(req) {
        const provinceCode = req.query.province;
        const district = district_1.district.filter((districtItem) => districtItem['parent_code'] === provinceCode);
        return district;
    }
    static async getWard(req) {
        const districtCode = req.query.district;
        const ward = ward_1.ward.filter((wardItem) => wardItem['parent_code'] === districtCode);
        return ward;
    }
}
exports.default = LocationService;
