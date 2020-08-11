import { Router } from 'express'
import * as mongoose from 'mongoose'
import redirectModel, {RedirectType} from "../../models/redirect";
import * as queryString from 'querystring'

const { ObjectId } = mongoose.Types
const publicRedirectRouter = Router()

publicRedirectRouter.get('/:redirectId', async (req, res) => {
    if (!ObjectId.isValid(req.params.redirectId)) {
        return res.sendStatus(404)
    }
    const redirectId = new ObjectId(req.params.redirectId)
    const redirect = await redirectModel.findById(redirectId).lean<RedirectType>().exec()
    if (!redirect) {
        return res.sendStatus(404)
    }

    if (redirect.expiresDate.getTime() <= Date.now()) {
        return res.sendStatus(404)
    }

    if (req.method.toLowerCase() !== 'head') {
        redirectModel.findByIdAndUpdate(redirectId, {$inc: {hitCount: 1}}).exec().catch(console.error)
    }
    return res.redirect(`${redirect.target}?${queryString.stringify(redirect.data)}`)
});


export default publicRedirectRouter;
