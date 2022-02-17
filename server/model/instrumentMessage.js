import mongoose from 'mongoose';

const instrumentSchema = mongoose.Schema({
    /*title: String,
    message: String,
    creator: String,
    tags: [String],
    selectedFile: String,
    likeCount:{
        typeNumber,
        default: 0
    },
    createdAt{
        type: Date,
        default: new Date()
    },*/
    title: String,
    code: String,
    type: String,
});

const InstrumentMessage = mongoose.model('Instrument Message', instrumentSchema);

export default InstrumentMessage;