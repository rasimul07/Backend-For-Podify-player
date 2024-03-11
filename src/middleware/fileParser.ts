import { RequestHandler,Request } from "express";
import formidable,{File} from "formidable";
import path from "path";

export interface RequestWithFiles extends Request{
    files?:{[key:string]:File}  //need to be optional
}
export const fileParser: RequestHandler = async(req:RequestWithFiles,res,next)=>{
    if (!req.headers["content-type"]?.startsWith("multipart/form-data;"))
      return res.status(422).json({ error: "Only accepts form-data!" });
    // const dir = path.join(__dirname, "../public/profiles");
    // try {
    //   await fs.readFileSync(dir);
    // } catch (error) {
    //   //if there is no folder throw an error
    //   await fs.mkdirSync(dir); //this time we are making the profiles directory inside public folder
    // }

    const form = formidable({multiples:false})
    const [fields,files] = await form.parse(req)
    // console.log(fields)
    // console.log(files)
    for(let key in fields){
        const field = fields[key];
        if(field){
            req.body[key] = field[0];
        }
    }
    for(let key in files){
        const file = files[key];
        if(!req.files){
            req.files= {}
        }
        if(file){
            req.files[key] = file[0];
        }
    }
    // console.log(".......................")
    // console.log(req.body)
    // console.log(req.files)
    next();
}
