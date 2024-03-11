import { categories, categoriesTypes } from "#/utils/audio_category";
import { Model, ObjectId, Schema, model, models } from "mongoose";

export interface AudioDocument{
    title:string,
    about:string,
    owner: ObjectId;
    file:{
        url:string,
        publicId:string;
    },
    poster?:{
        url:string,
        publicId:string;
    },
    likes: ObjectId[];
    category: categoriesTypes
}

const AudioSchema = new Schema<AudioDocument>({
    title:{
        type:String,
        required:true
    },
    about:{
        type:String,
        required:true
    },
    owner:{
        type:Schema.Types.ObjectId,
        required:true
    },
    file:{
        type: Object,
        url: String,
        publicId:String,
       required:true
    },
    poster:{
        type: Object,
        url: String,
        publicId:String
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref:"User"
    }],
    category:{
        type:String,
        enum: categories,
        default: 'Others'
    }
},{timestamps:true})


const Audio = models.Audio || model("Audio",AudioSchema)  //this line means --> if i already have models.Audio we will use that if not the we will create new model
export default Audio as Model<AudioDocument>;