import { RequestHandler } from "express";
import mongoose from "mongoose";
import Products from "../models/products.model";
import { assertValueExist } from "../util/assertValueExist";

export const getProducts: RequestHandler = async (req, res, next) => {
  try {
    const products = await Products.find().exec();

    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

type GetProductParams = {
  productId: string;
};

export const getProductById: RequestHandler<GetProductParams> = async (
  req,
  res,
  next
) => {
  const productId = req.params.productId;

  try {
    if (!mongoose.isValidObjectId(productId)) {
      throw new Error("Invalid id");
    }

    const product = await Products.findById(productId).exec();

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

type GetFilteredProductsParams = {
  query: string;
};

type GetFilteredProductsQuery = {
  minPrice?: number;
  maxPrice?: number;
};

export const getFilteredProducts: RequestHandler<
  GetFilteredProductsParams,
  unknown,
  unknown,
  GetFilteredProductsQuery
> = async (req, res, next) => {
  const query = req.params.query;
  const { minPrice, maxPrice } = req.query;
  try {
    const queryConditions = query
      ? { name: { $regex: query, $options: "i" } }
      : {};

    let priceRange = {};
    if (minPrice && maxPrice) {
      priceRange = {
        price: { $gte: minPrice.toString(), $lte: maxPrice.toString() },
      };
    }

    const conditions = { $and: [queryConditions, priceRange] };

    const filterProducts = await Products.find(conditions).sort({
      createdAt: "asc",
    });

    res.status(200).json(filterProducts);
  } catch (error) {
    next(error);
  }
};

type CreateProductBody = {
  name: string;
  description: string;
  cuantity: number;
  price: number;
  image: string;
  category: string;
};

export const createProduct: RequestHandler<
  unknown,
  unknown,
  CreateProductBody,
  unknown
> = async (req, res, next) => {
  const authenticatedUser = req.session.userId;
  const newName = req.body.name;
  const description = req.body.description;
  const price = req.body.price;
  const image = req.body.image;
  const category = req.body.category;
  const cuantity = req.body.cuantity;

  try {
    assertValueExist(authenticatedUser);

    const newProduct = await Products.create({
      userId: authenticatedUser,
      name: newName,
      description,
      cuantity,
      price,
      image,
      category,
    });

    if (!newName || !description)
      throw new Error("The product most have name and description");

    res.status(200).json(newProduct);
  } catch (error) {
    next(error);
  }
};

type UpdateProductParams = {
  productId: string;
};

type UpdateProductBody = {
  name: string;
  description: string;
  cuantity: number;
  price: number;
  image: string;
  category: string;
};

export const updateProduct: RequestHandler<
  UpdateProductParams,
  unknown,
  UpdateProductBody,
  unknown
> = async (req, res, next) => {
  const authenticatedUser = req.session.userId;
  const productId = req.params.productId;

  try {
    assertValueExist(authenticatedUser);

    const productToUpdate = await Products.findById(productId).exec();

    if (!productToUpdate) {
      throw new Error("Invalid product id");
    }

    if (!productToUpdate.userId.equals(authenticatedUser)) {
      throw new Error("You can't edit this product");
    }

    productToUpdate.name = req.body.name;
    productToUpdate.description = req.body.description;
    productToUpdate.cuantity = req.body.cuantity;
    productToUpdate.price = req.body.price;
    productToUpdate.image = req.body.image;
    productToUpdate.category = req.body.category;

    const updatedProduct = await productToUpdate.save();

    res.status(200).json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

export const deleteProduct: RequestHandler = async (req, res, next) => {
  const productId = req.params.productId;

  try {
    if (!mongoose.isValidObjectId(productId)) {
      throw new Error("Invalid product id");
    }

    const productToDelete = await Products.findByIdAndDelete(productId).exec();

    if (!productToDelete) {
      throw new Error("product not found");
    }

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};
