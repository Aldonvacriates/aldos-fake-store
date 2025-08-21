import React from "react";
import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

/*
  Home.jsx
  - Simple landing page for the app.
  - Presents a headline, short description and a prominent CTA button.
  - CTA navigates to /products and uses the app's dark-blue theme.
  - Notes:
    * Inline styles are used here for a quick visual polish. For larger projects
      prefer a CSS/SCSS module, styled-components, or a global theme.
    * Hover effects are implemented via event handlers to keep the demo self-contained.
    * Keep accessibility in mind: Link wraps the Button to provide correct navigation.
*/

function Home() {
  return (
    <Container className="text-center">
      {/* Page heading */}
      <h1 className="mt-5">Welcome to Aldo's Store</h1>

      {/* Short description / subtitle */}
      <p>Your one-stop shop for the best placeholder items!</p>

      {/* Primary call-to-action: Browse Products
          - Uses Link for client-side navigation (react-router)
          - Button styled to match dark-blue theme used across the app
          - Hover handlers update inline styles for a subtle lift effect
          - Consider moving styles to CSS for better separation of concerns */}
      <Link to="/products">
        <Button
          variant="primary"
          size="lg"
          style={{
            backgroundColor: "#003366",
            borderColor: "#003366",
            padding: "12px 30px",
            fontSize: "1.2rem",
            fontWeight: "600",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 51, 102, 0.3)",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            // Hover: slightly darker + lift
            // Use style changes sparingly; consider CSS :hover for better perf
            e.currentTarget.style.backgroundColor = "#002244";
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow =
              "0 6px 16px rgba(0, 51, 102, 0.4)";
          }}
          onMouseLeave={(e) => {
            // Revert hover styles
            e.currentTarget.style.backgroundColor = "#003366";
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow =
              "0 4px 12px rgba(0, 51, 102, 0.3)";
          }}
          // Accessibility note: keep the button label clear and concise
        >
          Browse Products
        </Button>
      </Link>
    </Container>
  );
}

export default Home;
