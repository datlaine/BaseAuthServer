import { Router } from 'express'
import authentication from '~/middlewares/authentication'
import { asyncHandler } from '~/helpers/asyncHandler'
import CommentService from '~/services/comment.service'
import { upload } from '~/configs/cloundinary.config'
import CommentController from '~/controllers/comment.controller'

const commentRouter = Router()

commentRouter.use(authentication)

commentRouter.post('/add-comment', upload.single('file'), asyncHandler(CommentController.addComment))
commentRouter.get('/get-me-comment', asyncHandler(CommentController.meComment))

export default commentRouter
