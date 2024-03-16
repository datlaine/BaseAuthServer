import { NextFunction, Response } from 'express'
import { CREATE, OK } from '~/Core/response.success'
import { IRequestCustom } from '~/middlewares/authentication'
import CommentService from '~/services/comment.service'

class CommentController {
      static async addComment(req: IRequestCustom, res: Response, next: NextFunction) {
            return new OK({ metadata: await CommentService.addComment(req) }).send(res)
      }

      static async deleteComment(req: IRequestCustom, res: Response, next: NextFunction) {
            return new OK({ metadata: await CommentService.deleteComment(req) }).send(res)
      }

      static async meComment(req: IRequestCustom, res: Response, next: NextFunction) {
            return new OK({ metadata: await CommentService.getMeComment(req) }).send(res)
      }

      static async getCommentCore(req: IRequestCustom, res: Response, next: NextFunction) {
            return new OK({ metadata: await CommentService.getCommentCore(req) }).send(res)
      }

      static async getAllCommentProduct(req: IRequestCustom, res: Response, next: NextFunction) {
            return new OK({ metadata: await CommentService.getAllCommentProduct(req) }).send(res)
      }

      static async getAllCommentImage(req: IRequestCustom, res: Response, next: NextFunction) {
            return new OK({ metadata: await CommentService.getAllCommentImage(req) }).send(res)
      }

      static async geAllCommentHasImage(req: IRequestCustom, res: Response, next: NextFunction) {
            return new OK({ metadata: await CommentService.geAllCommentHasImage(req) }).send(res)
      }

      static async geAllCommentFollowLevel(req: IRequestCustom, res: Response, next: NextFunction) {
            return new OK({ metadata: await CommentService.geAllCommentFollowLevel(req) }).send(res)
      }

      static async getAllCommentMe(req: IRequestCustom, res: Response, next: NextFunction) {
            return new OK({ metadata: await CommentService.getAllCommentMe(req) }).send(res)
      }
}

export default CommentController
