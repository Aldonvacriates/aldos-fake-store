// NavigationBar.jsx
// - Top-level navigation for the app.
// - Shows links to Products, Add Product and Cart with a cart item count badge.
// - Uses react-bootstrap Navbar for responsive collapse behavior.
// - Note: closeMenu is used to collapse the mobile menu after navigation.

import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import Badge from "react-bootstrap/Badge";
import { useCart } from "../hooks"; // import from centralized hooks index

function NavigationBar() {
  // Read cartCount from cart context to display item count in the header badge
  const { cartCount } = useCart();

  // Control whether the Navbar is expanded (mobile)
  const [expanded, setExpanded] = useState(false);

  // Close the responsive menu (useful after clicking a link)
  const closeMenu = () => setExpanded(false);

  return (
    <Navbar
      bg="light" // background color for the navbar
      expand="lg" // expand breakpoint (collapses on small screens)
      className="mb-3"
      expanded={expanded} // controlled expanded state so we can programmatically close it
      onToggle={(isExpanded) => setExpanded(isExpanded)} // keep state in sync with toggle
    >
      <Container>
        {/* Brand / Home link - closes menu when clicked */}
        <Navbar.Brand as={Link} to="/" onClick={closeMenu}>
          FakeStore
        </Navbar.Brand>

        {/* Toggle button visible on small screens */}
        <Navbar.Toggle aria-controls="main-nav" />

        {/* Collapsible nav links */}
        <Navbar.Collapse id="main-nav">
          {/* Left-aligned navigation links */}
          <Nav className="me-auto">
            {/* Link to product listing */}
            <Nav.Link as={Link} to="/products" onClick={closeMenu}>
              Products
            </Nav.Link>

            {/* Link to add product page */}
            <Nav.Link as={Link} to="/addproduct" onClick={closeMenu}>
              Add Product
            </Nav.Link>
          </Nav>

          {/* Right-aligned navigation: cart with badge */}
          <Nav>
            <Nav.Link
              as={Link}
              to="/cart"
              className="d-flex align-items-center"
              onClick={closeMenu}
            >
              {/* Accessible label and visible text */}
              Cart
              {/* Pill badge showing current cart count; uses dark background for contrast */}
              <Badge bg="dark" pill className="ms-2">
                {cartCount}
              </Badge>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
