import React from "react";
import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function Home() {
  return (
    <Container className="text-center">
      <h1 className="mt-5">Welcome to Aldo's Store</h1>
      <p>Your one-stop shop for the best placeholder items!</p>
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
            e.target.style.backgroundColor = "#002244";
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 6px 16px rgba(0, 51, 102, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#003366";
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 4px 12px rgba(0, 51, 102, 0.3)";
          }}
        >
          Browse Products
        </Button>
      </Link>
    </Container>
  );
}

export default Home;
