// src/components/Checkout.jsx
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
import { useCart } from "../hooks/useCart";

export default function Checkout() {
  const navigate = useNavigate();
  const { items, cartTotal, cartCount, clearCart } = useCart();

  const currency = useMemo(
    () => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }),
    []
  );

  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(null); // will hold order id string
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    country: "United States",
    cardName: "",
    cardNumber: "",
    exp: "",
    cvc: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    const e = {};
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

    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Invalid email";
    const digitsOnly = (s) => (s || "").replace(/\D/g, "");

    // Basic mock checks
    const card = digitsOnly(form.cardNumber);
    if (card && (card.length < 12 || card.length > 19)) e.cardNumber = "Card number looks wrong";
    if (form.exp && !/^(0?[1-9]|1[0-2])\/\d{2}$/.test(form.exp)) e.exp = "Use MM/YY";
    const cvc = digitsOnly(form.cvc);
    if (cvc && (cvc.length < 3 || cvc.length > 4)) e.cvc = "3–4 digits";

    return e;
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;

    setProcessing(true);
    try {
      // Simulate API call
      await new Promise((r) => setTimeout(r, 900));
      const orderId = `FS-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
      setSuccess(orderId);
      clearCart();
    } finally {
      setProcessing(false);
    }
  };

  // Success screen
  if (success) {
    return (
      <Container className="py-4">
        <Card className="shadow-sm mx-auto" style={{ maxWidth: 860 }}>
          <Card.Body className="text-center">
            <div className="display-6 mb-2">Thank you!</div>
            <p className="text-muted">Your order has been placed.</p>
            <div className="border rounded p-3 d-inline-block mb-3">
              <div className="fw-semibold">Order ID</div>
              <div className="fs-5">{success}</div>
            </div>
            <p className="mb-4">
              A confirmation email will be sent to <strong>{form.email || "your inbox"}</strong>.
            </p>
            <div className="d-flex gap-2 justify-content-center">
              <Button 
                as={Link} 
                to="/products" 
                variant="primary"
                style={{ backgroundColor: '#003366', borderColor: '#003366' }}
              >
                Continue Shopping
              </Button>
              <Button 
                variant="outline-secondary" 
                onClick={() => navigate("/")}
                style={{ borderColor: '#003366', color: '#003366' }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#003366';
                  e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#003366';
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

  // No items = bounce back
  if (!items || items.length === 0) {
    return (
      <Container className="py-4">
        <Alert variant="info" className="d-flex justify-content-between align-items-center">
          <div>Your cart is empty. Add items before checking out.</div>
          <Button 
            as={Link} 
            to="/products" 
            variant="primary"
            style={{ backgroundColor: '#003366', borderColor: '#003366' }}
          >
            Browse products
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="g-4">
        {/* Form */}
        <Col lg={8}>
          <Form onSubmit={placeOrder} noValidate>
            {/* Contact */}
            <Card className="shadow-sm mb-4">
              <Card.Body>
                <Card.Title className="mb-3">Contact</Card.Title>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Label>First name</Form.Label>
                    <Form.Control
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      isInvalid={!!errors.firstName}
                      autoComplete="given-name"
                    />
                    <Form.Control.Feedback type="invalid">{errors.firstName}</Form.Control.Feedback>
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
                    <Form.Control.Feedback type="invalid">{errors.lastName}</Form.Control.Feedback>
                  </Col>
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
                    <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                  </Col>
                  <Col md={5}>
                    <Form.Label>Phone (optional)</Form.Label>
                    <Form.Control name="phone" value={form.phone} onChange={handleChange} autoComplete="tel" />
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Shipping */}
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
                    <Form.Control.Feedback type="invalid">{errors.address1}</Form.Control.Feedback>
                  </Col>
                  <Col xs={12}>
                    <Form.Label>Address line 2 (optional)</Form.Label>
                    <Form.Control name="address2" value={form.address2} onChange={handleChange} autoComplete="address-line2" />
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
                    <Form.Control.Feedback type="invalid">{errors.city}</Form.Control.Feedback>
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
                    <Form.Control.Feedback type="invalid">{errors.state}</Form.Control.Feedback>
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
                    <Form.Control.Feedback type="invalid">{errors.zip}</Form.Control.Feedback>
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
                    <Form.Control.Feedback type="invalid">{errors.country}</Form.Control.Feedback>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Payment */}
            <Card className="shadow-sm mb-4">
              <Card.Body>
                <Card.Title className="mb-3">Payment</Card.Title>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Label>Name on card</Form.Label>
                    <Form.Control name="cardName" value={form.cardName} onChange={handleChange} isInvalid={!!errors.cardName} />
                    <Form.Control.Feedback type="invalid">{errors.cardName}</Form.Control.Feedback>
                  </Col>
                  <Col md={6}>
                    <Form.Label>Card number</Form.Label>
                    <Form.Control name="cardNumber" value={form.cardNumber} onChange={handleChange} isInvalid={!!errors.cardNumber} inputMode="numeric" />
                    <Form.Control.Feedback type="invalid">{errors.cardNumber}</Form.Control.Feedback>
                  </Col>
                  <Col md={4}>
                    <Form.Label>Expiry (MM/YY)</Form.Label>
                    <Form.Control name="exp" value={form.exp} onChange={handleChange} isInvalid={!!errors.exp} />
                    <Form.Control.Feedback type="invalid">{errors.exp}</Form.Control.Feedback>
                  </Col>
                  <Col md={4}>
                    <Form.Label>CVC</Form.Label>
                    <Form.Control name="cvc" value={form.cvc} onChange={handleChange} isInvalid={!!errors.cvc} inputMode="numeric" />
                    <Form.Control.Feedback type="invalid">{errors.cvc}</Form.Control.Feedback>
                  </Col>
                  <Col md={4} className="d-flex align-items-end">
                    <Button 
                      type="submit" 
                      variant="primary" 
                      className="w-100" 
                      disabled={processing}
                      style={{ backgroundColor: '#003366', borderColor: '#003366' }}
                    >
                      {processing ? (
                        <><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> Processing</>
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

        {/* Summary */}
        <Col lg={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="mb-3">Order summary</Card.Title>
              <ListGroup variant="flush" className="mb-3">
                {items.map((it) => (
                  <ListGroup.Item key={it.id} className="d-flex align-items-center gap-3">
                    <Image src={it.image} rounded style={{ width: 64, height: 64, objectFit: "cover" }} />
                    <div className="flex-grow-1">
                      <div className="fw-semibold">{it.title}</div>
                      <div className="text-muted small">Qty: {it.quantity || 1}</div>
                    </div>
                    <div className="fw-semibold">{currency.format((it.price || 0) * (it.quantity || 1))}</div>
                  </ListGroup.Item>
                ))}
              </ListGroup>

              <div className="d-flex justify-content-between fs-6 mb-2">
                <span>Items ({cartCount || items.length})</span>
                <span>{currency.format(items.reduce((s, it) => s + (it.price || 0) * (it.quantity || 1), 0))}</span>
              </div>
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