import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Alert from "react-bootstrap/Alert";
import { Link } from "react-router-dom";
import { useCart } from "../hooks/useCart";

export default function CartPage() {
  const { items, cartTotal, cartCount, updateQty, removeItem, clearCart } =
    useCart();

  // ensure cartCount is a number; fallback to computed total from items
  const safeCartCount =
    typeof cartCount === "number"
      ? cartCount
      : (items || []).reduce((sum, it) => sum + (it.qty || 0), 0);

  const currency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  if (!items || items.length === 0) {
    return (
      <Container className="py-4">
        <Alert
          variant="info"
          className="d-flex justify-content-between align-items-center"
        >
          <div>Your cart is empty.</div>
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
        <Col lg={8}>
          <ListGroup variant="flush" className="shadow-sm">
            {items.map((item) => (
              <ListGroup.Item key={item.id}>
                <Row className="align-items-center g-3">
                  <Col xs={3} md={2}>
                    <Image
                      src={item.image}
                      alt={item.title}
                      fluid
                      rounded
                      style={{ maxHeight: 90, objectFit: "contain" }}
                    />
                  </Col>
                  <Col xs={9} md={5}>
                    <div className="fw-semibold">{item.title}</div>
                    <div className="text-muted">
                      {currency.format(item.price)}
                    </div>
                  </Col>
                  <Col xs={7} md={3}>
                    <Form.Label className="text-muted small mb-1">
                      Qty
                    </Form.Label>
                    <Form.Control
                      type="number"
                      min={1}
                      value={item.qty}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        updateQty(item.id, isNaN(val) ? 1 : val);
                      }}
                    />
                  </Col>
                  <Col xs={5} md={2} className="text-end">
                    <div className="mb-2 fw-semibold">
                      {currency.format(item.price * item.qty)}
                    </div>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                    >
                      Remove
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>

        <Col lg={4}>
          <div className="mb-3 text-end">
            <span className="fw-semibold">{safeCartCount}</span>
          </div>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="mb-3">Order Summary</Card.Title>
              <div className="d-flex justify-content-between mb-2">
                <span>Items</span>
                <span className="fw-semibold">{cartCount}</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span>Subtotal</span>
                <span className="fw-semibold">
                  {currency.format(cartTotal)}
                </span>
              </div>
              <Button
                as={Link}
                to="/checkout"
                variant="success"
                className="w-100 mb-2"
                style={{ backgroundColor: '#003366', borderColor: '#003366' }}
              >
                Checkout
              </Button>
              <Button
                variant="outline-secondary"
                className="w-100"
                onClick={clearCart}
              >
                Clear cart
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
