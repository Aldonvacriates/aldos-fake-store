// src/components/Checkout.jsx
/**
 * Checkout.jsx
 *
 * Purpose:
 * - Present a multi-section checkout form (contact, shipping, payment).
 * - Validate basic inputs, simulate an order placement, and clear the cart on success.
 * - Show an order summary on the right and a success screen when the order completes.
 *
 * Notes:
 * - This is a demo payment flow. No real payment processing is performed.
 * - Validation is intentionally basic (client-side only) to provide user feedback.
 * - Cart item shape may vary between components (e.g. `qty` vs `quantity`); the summary
 *   uses defensive fallbacks when reading quantities.
 * - Uses `useCart` for cart state/actions; wrap the app with CartProvider so this hook works.
 */

import React from "react";
import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Image from "react-bootstrap/Image";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";
import { useCart } from "../hooks";

export default function Checkout() {
  // Navigation helper (used after successful order or when routing)
  const navigate = useNavigate();

  // Cart context: items array and totals (cartTotal, cartCount) plus clearCart action
  const { items, cartTotal, cartCount, clearCart } = useCart();

  // Currency formatter used throughout the component
  const currency = useMemo(
    () =>
      new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }),
    []
  );

  // processing: true while simulating the payment API call
  const [processing, setProcessing] = useState(false);
  // success: holds an order id string after a successful simulated order
  const [success, setSuccess] = useState(null);
  // errors: keyed object of form validation errors, e.g. { email: "Invalid" }
  const [errors, setErrors] = useState({});

  // form: controlled form state for contact, shipping and payment fields
  // Group fields logically: contact, shipping, payment (helps when adding validation)
  const [form, setForm] = useState({
    // Contact
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    // Shipping
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    country: "United States",
    // Payment (mock)
    cardName: "",
    cardNumber: "",
    exp: "",
    cvc: "",
  });

  // Generic controlled input handler - updates matching form key by name
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  /**
   * validate()
   * - Runs a set of lightweight checks and returns an errors object.
   * - Each key maps to a field name and a short message (string).
   * - Caller should setErrors(result) and prevent submission when there are entries.
   *
   * Notes:
   * - This is client-side validation only. Server-side validation is still required
   *   in a real payment flow.
   */
  const validate = () => {
    const e = {};
    // Required field set (contact + shipping + payment essentials)
    const req = [
      "firstName",
      "lastName",
      "email",
      "address1",
      "city",
      "state",
      "zip",
      "country",
      "cardName",
      "cardNumber",
      "exp",
      "cvc",
    ];
    req.forEach((k) => {
      if (!String(form[k]).trim()) e[k] = "Required";
    });

    // Basic email format check
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email))
      e.email = "Invalid email";

    // Utility: strip non-digits for numeric card/CVC checks
    const digitsOnly = (s) => (s || "").replace(/\D/g, "");

    // Card number length sanity check (loose)
    const card = digitsOnly(form.cardNumber);
    if (card && (card.length < 12 || card.length > 19))
      e.cardNumber = "Card number looks wrong";

    // Expiry format MM/YY
    if (form.exp && !/^(0?[1-9]|1[0-2])\/\d{2}$/.test(form.exp))
      e.exp = "Use MM/YY";

    // CVC digits length 3-4
    const cvc = digitsOnly(form.cvc);
    if (cvc && (cvc.length < 3 || cvc.length > 4)) e.cvc = "3–4 digits";

    return e;
  };

  /**
   * placeOrder(e)
   * - Handles form submission: validate, show errors if any, simulate API call,
   *   create a mock order id, clear cart and show success screen.
   *
   * Notes:
   * - In production you would integrate with a payment provider and backend order API.
   * - This function intentionally delays briefly to simulate network latency.
   */
  const placeOrder = async (e) => {
    e.preventDefault();

    // Validate and show inline errors
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;

    setProcessing(true);
    try {
      // Simulate network/API latency
      await new Promise((r) => setTimeout(r, 900));

      // Create a short random order id for demonstration
      const orderId = `FS-${Math.random()
        .toString(36)
        .slice(2, 10)
        .toUpperCase()}`;
      setSuccess(orderId);

      // Clear the cart after successful order
      clearCart();
    } finally {
      setProcessing(false);
    }
  };

  /* -------------------------
     UI: success screen
     ------------------------- */
  if (success) {
    return (
      <Container className="py-4">
        <Card className="shadow-sm mx-auto" style={{ maxWidth: 860 }}>
          <Card.Body className="text-center">
            <div className="display-6 mb-2">Thank you!</div>
            <p className="text-muted">Your order has been placed.</p>

            {/* Order id box */}
            <div className="border rounded p-3 d-inline-block mb-3">
              <div className="fw-semibold">Order ID</div>
              <div className="fs-5">{success}</div>
            </div>

            <p className="mb-4">
              A confirmation email will be sent to{" "}
              <strong>{form.email || "your inbox"}</strong>.
            </p>

            {/* Action buttons: continue shopping or go home */}
            <div className="d-flex gap-2 justify-content-center">
              <Button
                as={Link}
                to="/products"
                variant="primary"
                style={{ backgroundColor: "#003366", borderColor: "#003366" }}
              >
                Continue Shopping
              </Button>

              {/* Example of inline hover style - consider CSS for production */}
              <Button
                variant="outline-secondary"
                onClick={() => navigate("/")}
                style={{ borderColor: "#003366", color: "#003366" }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#003366";
                  e.target.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "transparent";
                  e.target.style.color = "#003366";
                }}
              >
                Go Home
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  /* -------------------------
     If cart is empty -> prompt user to add items
     ------------------------- */
  if (!items || items.length === 0) {
    return (
      <Container className="py-4">
        <Alert
          variant="info"
          className="d-flex justify-content-between align-items-center"
        >
          <div>Your cart is empty. Add items before checking out.</div>
          <Button
            as={Link}
            to="/products"
            variant="primary"
            style={{ backgroundColor: "#003366", borderColor: "#003366" }}
          >
            Browse products
          </Button>
        </Alert>
      </Container>
    );
  }

  /* -------------------------
     Main checkout form + order summary
     ------------------------- */
  return (
    <Container className="py-4">
      <Row className="g-4">
        {/* Left: form (contact, shipping, payment) */}
        <Col lg={8}>
          <Form onSubmit={placeOrder} noValidate>
            {/* Contact section */}
            <Card className="shadow-sm mb-4">
              <Card.Body>
                <Card.Title className="mb-3">Contact</Card.Title>
                <Row className="g-3">
                  {/* First / Last name */}
                  <Col md={6}>
                    <Form.Label>First name</Form.Label>
                    <Form.Control
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      isInvalid={!!errors.firstName}
                      autoComplete="given-name"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.firstName}
                    </Form.Control.Feedback>
                  </Col>

                  <Col md={6}>
                    <Form.Label>Last name</Form.Label>
                    <Form.Control
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      isInvalid={!!errors.lastName}
                      autoComplete="family-name"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.lastName}
                    </Form.Control.Feedback>
                  </Col>

                  {/* Email and optional phone */}
                  <Col md={7}>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      isInvalid={!!errors.email}
                      autoComplete="email"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Col>

                  <Col md={5}>
                    <Form.Label>Phone (optional)</Form.Label>
                    <Form.Control
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      autoComplete="tel"
                    />
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Shipping section */}
            <Card className="shadow-sm mb-4">
              <Card.Body>
                <Card.Title className="mb-3">Shipping address</Card.Title>
                <Row className="g-3">
                  <Col xs={12}>
                    <Form.Label>Address line 1</Form.Label>
                    <Form.Control
                      name="address1"
                      value={form.address1}
                      onChange={handleChange}
                      isInvalid={!!errors.address1}
                      autoComplete="address-line1"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.address1}
                    </Form.Control.Feedback>
                  </Col>

                  <Col xs={12}>
                    <Form.Label>Address line 2 (optional)</Form.Label>
                    <Form.Control
                      name="address2"
                      value={form.address2}
                      onChange={handleChange}
                      autoComplete="address-line2"
                    />
                  </Col>

                  <Col md={6}>
                    <Form.Label>City</Form.Label>
                    <Form.Control
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      isInvalid={!!errors.city}
                      autoComplete="address-level2"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.city}
                    </Form.Control.Feedback>
                  </Col>

                  <Col md={3}>
                    <Form.Label>State/Province</Form.Label>
                    <Form.Control
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      isInvalid={!!errors.state}
                      autoComplete="address-level1"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.state}
                    </Form.Control.Feedback>
                  </Col>

                  <Col md={3}>
                    <Form.Label>ZIP/Postal</Form.Label>
                    <Form.Control
                      name="zip"
                      value={form.zip}
                      onChange={handleChange}
                      isInvalid={!!errors.zip}
                      autoComplete="postal-code"
                      inputMode="numeric"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.zip}
                    </Form.Control.Feedback>
                  </Col>

                  <Col md={6}>
                    <Form.Label>Country</Form.Label>
                    <Form.Control
                      name="country"
                      value={form.country}
                      onChange={handleChange}
                      isInvalid={!!errors.country}
                      autoComplete="country-name"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.country}
                    </Form.Control.Feedback>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Payment section (mock) */}
            <Card className="shadow-sm mb-4">
              <Card.Body>
                <Card.Title className="mb-3">Payment</Card.Title>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Label>Name on card</Form.Label>
                    <Form.Control
                      name="cardName"
                      value={form.cardName}
                      onChange={handleChange}
                      isInvalid={!!errors.cardName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.cardName}
                    </Form.Control.Feedback>
                  </Col>

                  <Col md={6}>
                    <Form.Label>Card number</Form.Label>
                    <Form.Control
                      name="cardNumber"
                      value={form.cardNumber}
                      onChange={handleChange}
                      isInvalid={!!errors.cardNumber}
                      inputMode="numeric"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.cardNumber}
                    </Form.Control.Feedback>
                  </Col>

                  <Col md={4}>
                    <Form.Label>Expiry (MM/YY)</Form.Label>
                    <Form.Control
                      name="exp"
                      value={form.exp}
                      onChange={handleChange}
                      isInvalid={!!errors.exp}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.exp}
                    </Form.Control.Feedback>
                  </Col>

                  <Col md={4}>
                    <Form.Label>CVC</Form.Label>
                    <Form.Control
                      name="cvc"
                      value={form.cvc}
                      onChange={handleChange}
                      isInvalid={!!errors.cvc}
                      inputMode="numeric"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.cvc}
                    </Form.Control.Feedback>
                  </Col>

                  {/* Pay button: shows processing spinner when submitting */}
                  <Col md={4} className="d-flex align-items-end">
                    <Button
                      type="submit"
                      variant="primary"
                      className="w-100"
                      disabled={processing}
                      style={{
                        backgroundColor: "#003366",
                        borderColor: "#003366",
                      }}
                    >
                      {processing ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                          />{" "}
                          Processing
                        </>
                      ) : (
                        `Pay ${currency.format(cartTotal)}`
                      )}
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Form>
        </Col>

        {/* Right: order summary */}
        <Col lg={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="mb-3">Order summary</Card.Title>

              {/* List of items in the cart */}
              <ListGroup variant="flush" className="mb-3">
                {items.map((it) => (
                  <ListGroup.Item
                    key={it.id}
                    className="d-flex align-items-center gap-3"
                  >
                    <Image
                      src={it.image}
                      rounded
                      style={{ width: 64, height: 64, objectFit: "cover" }}
                    />

                    {/* Defensive handling: some areas use `quantity`, others `qty` */}
                    <div className="flex-grow-1">
                      <div className="fw-semibold">{it.title}</div>
                      <div className="text-muted small">
                        Qty: {it.quantity || it.qty || 1}
                      </div>
                    </div>

                    <div className="fw-semibold">
                      {currency.format(
                        (it.price || 0) * (it.quantity || it.qty || 1)
                      )}
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>

              {/* Item count / subtotal (calculate defensively in case cartCount missing) */}
              <div className="d-flex justify-content-between fs-6 mb-2">
                <span>Items ({cartCount || items.length})</span>
                <span>
                  {currency.format(
                    items.reduce(
                      (s, it) =>
                        s + (it.price || 0) * (it.quantity || it.qty || 1),
                      0
                    )
                  )}
                </span>
              </div>

              {/* Total */}
              <div className="d-flex justify-content-between fs-5">
                <span>Total</span>
                <span className="fw-bold">{currency.format(cartTotal)}</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
