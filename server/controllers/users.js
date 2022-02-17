import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from "mongoose";
import Users from '../model/user.js';

export const getUsers= async (req, res) => {
    try{
        //takes time
        const usersList = await Users.find();

        //console.log(usersList);
        
        res.status(200).json(usersList);
    }catch(error){
        res.status(404).json({message: error.message});
    }
}

export const getUser = async (req, res) => {
    try{
        //takes time
        const {id: _id} = req.params;

        const user = await Users.findById({_id});

        console.log("getUser:");
        console.log(user);
        
        res.status(200).json(user);
    }catch(error){
        res.status(404).json({message: error.message});
    }
}

export const signin = async(req, res) => {
    const {email, password} = req.body;

    //console.log(req.body);

    try {
        const existingUser = await Users.findOne({email});

        if(!existingUser){
            return res.status(404).json({message:"User does not exist"});
        }

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

        if(!isPasswordCorrect){
            return res.status(400).json({message: "Invaid credentials"});
        }

        const token = jwt.sign({email: existingUser.email, id: existingUser._id}, 'test', {expiresIn: "1h"});

        res.status(200).json({result: existingUser, token});
    } catch (error) {
        res.status(500).json("Something went wrong");
    }
}

export const signup = async(req, res) => {
    const {email, password, confirmPassword, firstName, lastName} = req.body;

    console.log(req.body);

    try {
        const existingUser = await Users.findOne({email});

        if(existingUser){
            console.log("already exists");
            return res.status(400).json({message: "User already exists"});
        }

        if(password != confirmPassword){
            console.log("does not match");
            return res.status(400).json({message: "Passwords don't match"});
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        console.log(hashedPassword);

        const result = await Users.create({email, password: hashedPassword, name: `${firstName} ${lastName}`, accountBalance: 0, profit: 0});
        
        const token = jwt.sign({email: result.email, id: result._id}, 'test', {expiresIn: "1h"});

        res.status(200).json({result, token});

    } catch (error) {
        console.log(error);
        res.status(500).json("Something went wrong");
    }
}

export const depositMoney = async(req, res) => {
    const {id: _id} = req.params;
    const paymentData = req.body;

    console.log(_id);

    if(!mongoose.Types.ObjectId.isValid(_id)){
        return res.status(404).send(req.params);
    }

    const user = await Users.findById({_id});
    user.accountBalance += paymentData.sum;

    const updatedUser = await Users.findByIdAndUpdate(_id, user, {new: true});

    res.json(updatedUser);
}

export const buyInstrument = async(req, res) => {
    const {id: _id} = req.params;
    const buyData = req.body;

    console.log(_id);
    console.log("buy data: ");
    console.log(buyData);

    if(!mongoose.Types.ObjectId.isValid(_id)){
        return res.status(404).send(req.params);
    }

    const user = await Users.findById({_id});

    if(user.accountBalance < buyData.totalPrice){
        console.log("not enough money");
        return res.status(400).send("not enough money");
    }

    let isAlreadyOwned = false;
    let alreadyOwnedInstrument = null;
    user.instrumentsOwned.forEach(instrument => {
        if(instrument.name == buyData.name){
            isAlreadyOwned = true;
            alreadyOwnedInstrument = instrument;
        }
    });

    if(isAlreadyOwned){
        alreadyOwnedInstrument.quantity += buyData.quantity;
    }
    else{
        user.instrumentsOwned.push(buyData);
    }

    user.accountBalance-=buyData.totalPrice;

    const updatedUser = await Users.findByIdAndUpdate(_id, user, {new: true});

    res.json(updatedUser);
}

export const sellInstrument = async(req, res) => {
    const {id: _id} = req.params;
    const sellData = req.body;

    console.log("SELL");
    console.log(_id);
    console.log("sell data: ");
    console.log(sellData);

    if(!mongoose.Types.ObjectId.isValid(_id)){
        return res.status(404).send(req.params);
    }

    const user = await Users.findById({_id});
    console.log(user.instrumentsOwned);
    console.log("sell DATA: ");
    console.log(sellData);

    let isOwned = false;
    let toBeSoldInstrument = null;
    user.instrumentsOwned.forEach(instrument => {
        if(instrument.name == sellData.name){
            isOwned = true;
            toBeSoldInstrument = instrument;
        }
    });

    if(toBeSoldInstrument){
        user.instrumentsOwned.remove(toBeSoldInstrument);
        user.instrumentsSold.push(sellData);
    }

    const updatedUser = await Users.findByIdAndUpdate(_id, user, {new: true});

    res.json(updatedUser);
}