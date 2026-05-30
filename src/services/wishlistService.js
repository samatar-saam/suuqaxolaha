// src/services/wishlistService.js

// Get current user
const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user") || "null");
};

// Add to wishlist
export const addToWishlist = async (product) => {
  const user = getCurrentUser();
  
  if (user && user.id) {
    // Logged in user - save to database
    try {
      // Check if already exists
      const checkRes = await fetch(`http://localhost:5000/wishlists?userId=${user.id}&productId=${product.id}`);
      const existing = await checkRes.json();
      
      if (existing.length > 0) {
        return { success: false, message: "Item already in wishlist" };
      }
      
      const response = await fetch("http://localhost:5000/wishlists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: Date.now(),
          userId: user.id,
          productId: product.id,
          createdAt: new Date().toISOString()
        }),
      });
      
      if (response.ok) {
        return { success: true, message: "Added to wishlist" };
      }
    } catch (error) {
      console.error("Failed to add to wishlist:", error);
      return { success: false, message: "Failed to add to wishlist" };
    }
  } else {
    // Guest user - save to localStorage
    const wishlist = JSON.parse(localStorage.getItem("public_wishlist") || "[]");
    const exists = wishlist.some(item => item.id === product.id);
    
    if (exists) {
      return { success: false, message: "Item already in wishlist" };
    }
    
    const wishlistItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      addedAt: new Date().toISOString()
    };
    
    wishlist.push(wishlistItem);
    localStorage.setItem("public_wishlist", JSON.stringify(wishlist));
    return { success: true, message: "Added to wishlist" };
  }
};

// Remove from wishlist
export const removeFromWishlist = async (productId, wishlistItemId) => {
  const user = getCurrentUser();
  
  if (user && user.id) {
    // Logged in user - remove from database
    try {
      const response = await fetch(`http://localhost:5000/wishlists/${wishlistItemId}`, {
        method: "DELETE"
      });
      
      if (response.ok) {
        return { success: true, message: "Removed from wishlist" };
      }
    } catch (error) {
      console.error("Failed to remove from wishlist:", error);
      return { success: false, message: "Failed to remove" };
    }
  } else {
    // Guest user - remove from localStorage
    const wishlist = JSON.parse(localStorage.getItem("public_wishlist") || "[]");
    const updatedWishlist = wishlist.filter(item => item.id !== productId);
    localStorage.setItem("public_wishlist", JSON.stringify(updatedWishlist));
    return { success: true, message: "Removed from wishlist" };
  }
};

// Get wishlist items
export const getWishlist = async () => {
  const user = getCurrentUser();
  
  if (user && user.id) {
    // Logged in user - fetch from database
    try {
      const response = await fetch(`http://localhost:5000/wishlists?userId=${user.id}`);
      const wishlistItems = await response.json();
      
      // Fetch product details
      const enrichedWishlist = await Promise.all(
        wishlistItems.map(async (item) => {
          const productRes = await fetch(`http://localhost:5000/products/${item.productId}`);
          const product = await productRes.json();
          return {
            id: item.id,
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            category: product.category,
            inStock: product.stock > 0,
            addedAt: item.createdAt
          };
        })
      );
      
      return enrichedWishlist;
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
      return [];
    }
  } else {
    // Guest user - get from localStorage
    return JSON.parse(localStorage.getItem("public_wishlist") || "[]");
  }
};

// Check if product is in wishlist
export const isInWishlist = async (productId) => {
  const user = getCurrentUser();
  
  if (user && user.id) {
    try {
      const response = await fetch(`http://localhost:5000/wishlists?userId=${user.id}&productId=${productId}`);
      const items = await response.json();
      return items.length > 0;
    } catch (error) {
      return false;
    }
  } else {
    const wishlist = JSON.parse(localStorage.getItem("public_wishlist") || "[]");
    return wishlist.some(item => item.id === productId);
  }
};