import * as mongoose from 'mongoose'
const { ObjectId, String, Date: MongooseDate, Number } = mongoose.Schema.Types

const schema = new mongoose.Schema({
    _id: ObjectId,
    createDate: {
        type: MongooseDate,
        default: Date.now,
    },
    creatorId: {
        type: ObjectId,
        required: true,
    },
    data: {},
    deletedOn: {
      type: MongooseDate,
      required: false,
    },
    expiresDate: {
        type: MongooseDate,
        required: true,
    },
    hitCount: {
        type: Number,
        default: 0
    },
    target: {
        type: String,
        required: true,
    },
})

const redirectModel = mongoose.model('Redirect', schema, 'Redirects')

export default redirectModel
export type RedirectType = {
    _id: typeof ObjectId,
    creatorId: typeof ObjectId,
    createDate: Date,
    deletedOn?: Date | null,
    data: { [key:string]: string }
    expiresDate: Date,
    hitCount: number
    target: string,
}
