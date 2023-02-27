import mongoose from "mongoose";

export async function main() {
    const schema = new mongoose.Schema({
        title: {
            type: String,
            required: true,
            index: true
        }
    });

    const Model = mongoose.model('Product', schema) // products

    await mongoose.connect('mongodb://127.0.0.1:27017/ecommerce-2')

    // find in db
    const products = await Model.find();
    console.log(products)

    await Model.create({title: 'apple'})
    await Model.create({title: 'peach'})

    const allProducts = await Model.find();
    console.log(allProducts);

    const apple = await Model.find({title: 'apple'})
}

