const Product = require("../models/productModels");

const createProduct = async (req, res) => {
  const { name, description, price, image } = req.body;

  //base case
  try {
    if (!name || !description || !price || !image) {
      return res.json({ message: "All fields are required" });
    }

    //add product to database
    const product = await Product.create({
      name,
      description,
      price,
      image,
    });

    console.log("Product created:", product);
    return res.status(200).json({ message: "Product created!" });
  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(500).json({ message: "Error creating product" });
  }
};

//fetch all products
async function getAllProducts(req, res) {
  try {
    const products = await Product.find({});
    return res.status(200).json(products);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching products" });
  }
}

async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    console.log("Product deleted:", id);
    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

async function editProduct(req, res) {
  console.log("Edit product called with ID:", req.params.id); // Debug
  console.log("Request body:", req.body); // Debug
  console.log("User from auth:", req.user); // Debug

  try {
    const { id } = req.params;
    const { name, description, price, image } = req.body;

    if (!name || !description || !price || !image) {
      console.log("Missing fields:", { name, description, price, image }); // Debug
      return res.status(400).json({ message: "All fields are required" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        description,
        price,
        image,
      },
      { new: true }
    );

    if (!updatedProduct) {
      console.log("Product not found for ID:", id); // Debug
      return res.status(404).json({ message: "Product not found" });
    }

    console.log("Product updated:", updatedProduct);
    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({ message: "Error updating product" });
  }
}

module.exports = { createProduct, getAllProducts, deleteProduct, editProduct };
