import { Router } from 'express'
import authentication from '~/middlewares/authentication'
import { asyncHandler } from '~/helpers/asyncHandler'
import CommentService from '~/services/comment.service'
import { upload } from '~/configs/cloundinary.config'
import CommentController from '~/controllers/comment.controller'

const commentRouter = Router()

commentRouter.get('/get-all-comment', asyncHandler(CommentController.getAllCommentProduct))
commentRouter.get('/get-all-comment-image', asyncHandler(CommentController.getAllCommentImage))

commentRouter.use(authentication)
commentRouter.get('/get-me-comment', asyncHandler(CommentController.meComment))
commentRouter.post('/add-comment', upload.single('file'), asyncHandler(CommentController.addComment))

export default commentRouter
