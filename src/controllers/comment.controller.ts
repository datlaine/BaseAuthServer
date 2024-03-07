import { NextFunction, Response } from 'express'
import { CREATE, OK } from '~/Core/response.success'
import { IRequestCustom } from '~/middlewares/authentication'
import CommentService from '~/services/comment.service'

class CommentController {
      static async addComment(req: IRequestCustom, res: Response, next: NextFunction) {
            return new OK({ metadata: await CommentService.addComment(req) }).send(res)
      }

      static async meComment(req: IRequestCustom, res: Response, next: NextFunction) {
            return new OK({ metadata: await CommentService.getMeComment(req) }).send(res)
      }
}

export default CommentController
