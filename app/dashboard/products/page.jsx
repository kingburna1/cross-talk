// app/dashboard/products/page.jsx (or wherever your product list page is)
"use client";
import React, { useState, useEffect, useMemo } from "react"; // 1. IMPORT useMemo
import { PlusIcon } from "@heroicons/react/24/outline";
import ProductCard from "../../../src/components/product-card/ProductCard";
import AddProductForm from "../../../src/components/product-card/AddProductForm";
import EditProductForm from "../../../src/components/product-card/EditProductForm";
import { useSearchStore } from "../../../src/store/searchStore";




// NOTE: Initial dummy data now ensures images are valid URLs
const initialSampleData = [
    {
        id: "static-1", // Add unique ID for stable editing
        imageSrc: "/image1.jpg",
        name: "Luxury Smartwatch Pro X900",
        buyPrice: 150.0,
        qtyBought: 50,
        supplierName: "TechCorp Global Inc.",
        supplierContact: "(555) 123-4567",
        supplierEmail: "contact@techcorp.com",
        sellPrice: 299.99,
        qtyLeft: 12,
    },
    {
        id: "static-2", // Add unique ID
        imageSrc: "/image2.jpg",
        name: "Wireless Ergonomic Mouse",
        buyPrice: 15.5,
        qtyBought: 200,
        supplierName: "Budget Electronics Ltd",
        supplierContact: "(555) 987-6543",
        supplierEmail: "sales@budgetelec.co",
        sellPrice: 35.99,
        qtyLeft: 98, 
    },
];

const ProductPage = () => {
    // --- STATES ---
    const [editingProduct, setEditingProduct] = useState(null);
    const [products, setProducts] = useState(initialSampleData);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // 2. CALL ZUSTAND HOOK (must be at the top level with other hooks)
    const { search } = useSearchStore(); 

    // --- EFFECT 1: Load products from localStorage on initial load ---
    useEffect(() => {
        try {
            const tempProducts =
                JSON.parse(localStorage.getItem("tempProducts")) || [];

            // Assign temporary IDs to local storage items for editing
            const productsWithIds = tempProducts.map((product, index) => ({
                ...product,
                id: `temp-${index}-${product.name.replace(/\s/g, "")}`,
            }));

            // Assign static IDs to initial data if not present (crucial for keys)
            const staticProducts = initialSampleData.map((p, i) => ({
                ...p,
                id: p.id || `static-${i}`,
            }));

            setProducts([...productsWithIds, ...staticProducts]);
        } catch (error) {
            console.error("Could not load products from local storage:", error);
        }
        setIsLoading(false);
    }, []);

    // --- HANDLERS (omitted for brevity, they remain unchanged) ---
    const handleProductAdded = (newProduct) => {
        // Add a temporary ID for the new item before saving
        const productWithId = {
            ...newProduct,
            id: `temp-${Date.now()}-${newProduct.name.replace(/\s/g, "")}`,
        };
        setProducts((prevProducts) => [productWithId, ...prevProducts]);

        // Update local storage
        const currentTempProducts =
            JSON.parse(localStorage.getItem("tempProducts")) || [];
        localStorage.setItem(
            "tempProducts",
            JSON.stringify([newProduct, ...currentTempProducts])
        );
    };

    const startEditing = (product) => {
        setEditingProduct(product);
    };

    const handleProductUpdated = (updatedProduct) => {
        const newProducts = products.map((p) =>
            p.id === updatedProduct.id ? updatedProduct : p
        );
        setProducts(newProducts);
        setEditingProduct(null); // Close the edit form

        // Update Local Storage: Only save the items that originated from temp storage
        const tempProductsToSave = newProducts.filter(
            (p) => p.id && p.id.startsWith("temp-")
        );
        localStorage.setItem("tempProducts", JSON.stringify(tempProductsToSave));
    };

    // 3. FILTERING LOGIC using useMemo
    const filteredProducts = useMemo(() => {
        if (!search) {
            return products; // Show all products if search is empty
        }

        const lowerCaseSearch = search.toLowerCase();

        return products.filter(product => 
            // Filter logic: Check if the product name OR supplier name contains the search text
            product.name.toLowerCase().includes(lowerCaseSearch) ||
            product.supplierName.toLowerCase().includes(lowerCaseSearch)
        );
    }, [search, products]);


    if (isLoading) {
        return (
            <div className="p-5 text-center text-gray-500">Loading products...</div>
        );
    }
    
    const showNoResults = filteredProducts.length === 0 && search;

    return (
        <div className="p-5 ">
            {/* --- Dashboard Header and Add Button --- */}
            <div className='flex justify-between items-center p-5'>
                <h1 className='text-md md:text-2xl font-bold text-green-700'>
                    Products Dashboard ({filteredProducts.length}) {/* Display filtered count */}
                </h1>
                <button
                    onClick={() => setIsFormOpen(true)}
                    className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-all duration-300 text-xs md:text-sm flex items-center'
                >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add New Product
                </button>
            </div>
            
            {search && (
                <p className="text-sm text-gray-500 mb-4 px-5">
                    Showing results for: <span className="font-semibold text-green-600">"{search}"</span>
                </p>
            )}

            {/* --- Product List --- */}
            <div className="space-y-3">
                
                {showNoResults ? (
                    <div className="text-center p-10 bg-white rounded-xl shadow-md mx-5">
                        <p className="text-lg font-medium text-red-500">
                            No products found matching **"{search}"**.
                        </p>
                    </div>
                ) : (
                    // 4. MAP OVER FILTERED PRODUCTS
                    filteredProducts.map((product, index) => (
                        <ProductCard
                            // Use the unique 'id' for the key, falling back to index
                            key={product.id || `${product.name}-${index}`}
                            product={product}
                            // PASS THE EDIT FUNCTION DOWN
                            onEdit={startEditing}
                        />
                    ))
                )}
                
            </div>
            
            {isFormOpen && (
                <AddProductForm
                    onClose={() => setIsFormOpen(false)}
                    onProductAdded={handleProductAdded}
                />
            )}
            {/* --- Edit Product Form Modal --- */}
            {editingProduct && (
                <EditProductForm
                    product={editingProduct}
                    onClose={() => setEditingProduct(null)}
                    onUpdate={handleProductUpdated}
                />
            )}
        </div>
    );
};

export default ProductPage;