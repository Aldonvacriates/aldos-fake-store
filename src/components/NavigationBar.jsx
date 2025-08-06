function NavigationBar() {
  return (
    <nav className="navigation-bar">
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/products">Products</a></li>
        <li><a href="/add-product">Add Product</a></li>
        <li><a href="/product-details">Product Details</a></li>
      </ul>
    </nav>
  );
}

export default NavigationBar;