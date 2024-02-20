import { RequestHandler } from "express";
import * as yup from 'yup'

export const validate = (schema:any) : RequestHandler =>{
    return async(req,res,next)=>{
        if(!req.body) return res.json({error:"Empty body is not expected"})

        //in case you work with audio file //we have to make it dynamic
        const schemaToValidate = yup.object({
            body:schema
        })

        try{
            await schemaToValidate.validate({
                body:req.body
            },{
                abortEarly:true       //if there any problem or error found then abort as soon as possible rather than whole validate
            })
            next()
        } catch(error){
            if(error instanceof yup.ValidationError){
                //422 (Unprocessable Content)
                res.status(422).json({error: error.message})
            }
        }
    }
}

