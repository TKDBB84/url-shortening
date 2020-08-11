import { Router } from 'express'
import * as mongoose from 'mongoose'
import redirectModel, {RedirectType} from "../../models/redirect";

const { ObjectId } = mongoose.Types
const privateRedirectRouter = Router()

privateRedirectRouter.use(async (req, res, next) => {
    // auth something
    next()
})

privateRedirectRouter.delete('/:redirectId', async (req, res) => {
    if (!ObjectId.isValid(req.params.redirectId)) {
        return res.sendStatus(204)
    }
    const redirectId = new ObjectId(req.params.redirectId)
    await redirectModel.findByIdAndUpdate(redirectId, {$currentDate: {deletedOn: true}}).catch()
    return res.sendStatus(204)
})


privateRedirectRouter.patch('/:redirectId', async (req, res) => {
    if (!ObjectId.isValid(req.params.redirectId)) {
        return res.sendStatus(404)
    }
    const redirectId = new ObjectId(req.params.redirectId)
    const redirect = await redirectModel.findById(redirectId).lean<RedirectType>().exec()
    const updates = {
        redirect,
        ...req.body,
        data: {
            ...redirect.data,
            ...(req.body.data ? req.body.data : {}),
        },
        _id: redirectId
    }
    const updatedRedirect = await redirectModel.findByIdAndUpdate(redirectId, updates, {new: true}).lean<RedirectType>().exec()
    return res.json(updatedRedirect)
})
privateRedirectRouter.post('/', async (req, res) => {
    const redirect = await redirectModel.create<RedirectType>(req.body)
    return res.json(redirect.toJSON())
})
privateRedirectRouter.put('/:redirectId', async (req, res) => {
    if (!ObjectId.isValid(req.params.redirectId)) {
        return res.sendStatus(404)
    }
    const redirectId = new ObjectId(req.params.redirectId)
    await redirectModel.replaceOne({_id: redirectId}, {
        ...req.body,
        _id: redirectId
    }).exec()
    const updatedRedirect = await redirectModel.findById(redirectId).lean<RedirectType>().exec()
    return res.json(updatedRedirect)
})

export default privateRedirectRouter
