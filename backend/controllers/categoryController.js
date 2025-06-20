import Category from "../models/Category.js";


export const createCategory = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Category name is required", success: false });
        }

        const existing = await Category.findOne({ name });
        if (existing) {
            return res.status(409).json({ message: "Category already exists", success: false });
        }

        const category = await Category.create({ name });
        res.status(201).json({ message: "Category created successfully", category, success: true });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", success: false });
    }
};



export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json({ categories, success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", success: false });
    }
};
