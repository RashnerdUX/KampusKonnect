import React from 'react'

export const meta = () => {
    return [
        { title: "Products - Campex" },
        { name: "description", content: "Products page for Campex" },
        { name : "keywords", content: "Campex, Products, Vendor" },
    ]
}

export const loader =  async () => {
    return null;
}

export const Products = () => {
  return (
    <div>Products</div>
  )
}

export default Products;