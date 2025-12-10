// app/dashboard/products/page.jsx (or wherever your product list page is)
"use client";
import React, { useState, useEffect, useMemo } from "react"; // 1. IMPORT useMemo
import { PlusIcon } from "@heroicons/react/24/outline";
import ProductCard from "../../../src/components/product-card/ProductCard";
import AddProductForm from "../../../src/components/product-card/AddProductForm";
import EditProductForm from "../../../src/components/product-card/EditProductForm";
import { useSearchStore } from "../../../src/store/searchStore";






const ProductPage = () => {
    // --- STATES ---
    const [editingProduct, setEditingProduct] = useState(null);
    const [products, setProducts] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    //  CALL ZUSTAND HOOK 
    const { search } = useSearchStore(); 

    // --- EFFECT: Load products from backend MongoDB ---
    useEffect(() => {
        const loadFromServer = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000"}/api/products`,
                    { credentials: "include" }
                );

                console.log("Fetch /api/products status:", res.status);

                if (!res.ok) {
                    console.error("Failed to fetch products:", await res.text());
                    setIsLoading(false);
                    return;
                }

                const dbProducts = await res.json();
                console.log("Fetched products:", dbProducts);

                // Map products to include id field from _id
                const mapped = dbProducts.map(p => ({
                    ...p,
                    id: p._id,
                }));

                setProducts(mapped);
            } catch (err) {
                console.error("Network error loading products:", err);
            } finally {
                setIsLoading(false);
            }
        };

        loadFromServer();
    }, []);



    // --- HANDLERS ---
    const handleProductAdded = (newProduct) => {
        const productWithId = {
            ...newProduct,
            id: newProduct._id,
        };
        setProducts((prevProducts) => [productWithId, ...prevProducts]);
    };


    const startEditing = (product) => {
        setEditingProduct(product);
    };

    const handleProductUpdated = (updatedProduct) => {
        // Map the updated product with proper id field
        const productWithId = {
            ...updatedProduct,
            id: updatedProduct._id || updatedProduct.id,
        };
        
        const newProducts = products.map((p) =>
            p.id === productWithId.id ? productWithId : p
        );
        setProducts(newProducts);
        setEditingProduct(null);
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
                    // Map over filtered products with unique keys
                    filteredProducts.map((product) => (
                        <ProductCard
                            // Use the unique '_id' from MongoDB for the key
                            key={product.id}
                            product={product}
                            // Pass the edit function down
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