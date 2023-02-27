import mongoose from "mongoose";
import mongooseUniquePlugin from "mongoose-beautiful-unique-validation"

mongoose.plugin(mongooseUniquePlugin);

export default mongoose.createConnection('mongodb://127.0.0.1:27017/test-app')