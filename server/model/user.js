import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    instrumentsOwned:[{
        name : String,
        quantity : Number,
        assetType: String,
    }],
    instrumentsSold:[{
        name : String,
        quantity : Number,
        assetType: String,
        sellPrice: Number,
    }],
    accountBalance: {type: Number, required: true},
    profit: {type: Number, required: true},
    password: {type: String, required: true},
    id: {type: String}
})

const Users =  mongoose.model("User", userSchema);
export default Users;