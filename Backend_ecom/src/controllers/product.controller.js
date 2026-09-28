import Product from "../models/product.model.js";

export const createProduct = async (request, response, next) => {
  try {
    const product = await Product.create(request.body);

    return response.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const getProducts = async (request, response, next) => {
  try {
    const products = await Product.find();

    return response.status(200).json({
      success: true,
      message: "Products retrieved successfully",
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (request, response, next) => {
  try {
    const product = await Product.findById(request.params.id);

    if (!product) {
      return response.status(404).json({
        success: false,
        message: "Product not found",
        data: null,
      });
    }

    return response.status(200).json({
      success: true,
      message: "Product retrieved successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (request, response, next) => {
  try {
    const product = await Product.findById(request.params.id);

    if (!product) {
      return response.status(404).json({
        success: false,
        message: "Product not found",
        data: null,
      });
    }

    Object.assign(product, request.body);
    await product.save();

    return response.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (request, response, next) => {
  try {
    const product = await Product.findById(request.params.id);

    if (!product) {
      return response.status(404).json({
        success: false,
        message: "Product not found",
        data: null,
      });
    }

    await product.deleteOne();

    return response.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
