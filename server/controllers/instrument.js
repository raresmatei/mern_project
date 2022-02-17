import mongoose from "mongoose";
import InstrumentMessage from "../model/instrumentMessage.js";

export const getInstruments = async (req, res) => {
    try{
        //takes time
        const instrumentMessages = await InstrumentMessage.find();

        //console.log(instrumentMessages);
        
        res.status(200).json(instrumentMessages);
    }catch(error){
        res.status(404).json({message: error.message});
    }
}

export const createInstrument = async (req, res) =>{
    const body = req.body;

    const newInstrument = new InstrumentMessage(body);

    try {
        await newInstrument.save();

        res.status(201).json(newInstrument);
    } catch (error) {
        res.status(409).json({message: error.message});
    }
}

export const deletePost = async(req, res) =>{
    const {id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).send('No post with that id');
    }

    await InstrumentMessage.findByIdAndRemove(id);

    res.json({message: 'Post deleted successfully'});
}