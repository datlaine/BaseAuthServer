import { Router } from 'express'
import authentication from '~/middlewares/authentication'
import { asyncHandler } from '~/helpers/asyncHandler'
import CommentService from '~/services/comment.service'
import { upload } from '~/configs/cloundinary.config'
import CommentController from '~/controllers/comment.controller'

const commentRouter = Router()

commentRouter.get('/get-all-comment', asyncHandler(CommentController.getAllCommentProduct))
commentRouter.get('/get-all-comment-image', asyncHandler(CommentController.getAllCommentImage))
commentRouter.get('/get-all-comment-has-image', asyncHandler(CommentController.geAllCommentHasImage))
commentRouter.get('/get-all-comment-follow-level', asyncHandler(CommentController.geAllCommentFollowLevel))

commentRouter.use(authentication)
commentRouter.get('/get-me-comment', asyncHandler(CommentController.meComment))
commentRouter.get('/get-me-all-comment', asyncHandler(CommentController.getAllCommentMe))

commentRouter.post('/add-comment', upload.single('file'), asyncHandler(CommentController.addComment))

export default commentRouter
