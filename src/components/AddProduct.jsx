import axios from "axios";
import { useState } from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

/**
 * AddProduct
 *
 * Purpose:
 * - Provide a simple form to create a product via the FakeStore API.
 * - Show success / error feedback to the user after submission.
 *
 * Notes:
 * - Form is controlled via `formData` state.
 * - `handleSubmit` calls the API and stores the returned product in `product`.
 * - The FakeStore API used here is a demo API — created resources may not persist.
 * - Basic client-side validation is enforced using `required` on inputs.
 */
function AddProduct() {
  // Holds the API response for the created product (used for success UI)
  const [product, setProduct] = useState();

  // Tracks whether the form was successfully submitted
  const [submitted, setSubmitted] = useState(false);

  // Holds an error message string to show in the UI when submission fails
  const [error, setError] = useState(null);

  // Controlled form state for all inputs in the form
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    image: "",
  });

  /**
   * handleChange
   * - Generic change handler for controlled inputs.
   * - Updates the corresponding key in formData based on input name attribute.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * handleSubmit
   * - Prevents default form submission.
   * - Sends a POST request to the FakeStore API with the form payload.
   * - On success: save the returned product, show success message, clear errors.
   * - On failure: record an error message for the user.
   *
   * Notes:
   * - In production you'd validate and possibly sanitize/transform formData
   *   (e.g. ensure `price` is a number) before sending to the server.
   * - The API call is awaited so the UI waits for completion; consider adding
   *   a loading state for improved UX on slow networks.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Ensure price is sent as a number if the API expects numeric price
      const payload = { ...formData, price: Number(formData.price) };

      const response = await axios.post(
        "https://fakestoreapi.com/products",
        payload
      );

      // Save created product and mark submitted for showing success UI
      setProduct(response.data);
      setSubmitted(true);
      setError(null);
    } catch (err) {
      // Normalize and show a friendly error message
      setError(`Error submitting form. Please try again: ${err.message}`);
      setSubmitted(false);
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="mt-5">Add product</h2>

      {/* Success alert: only shown after a successful creation */}
      {submitted && product && (
        <Alert
          variant="success"
          dismissible
          onClose={() => setSubmitted(false)}
        >
          {/* product.title may be undefined if API response shape differs */}
          {product.title
            ? `${product.title} created successfully!`
            : "Product created successfully!"}
        </Alert>
      )}

      {/* Error alert: shows API/validation issues */}
      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

      {/* Form: controlled inputs bound to formData */}
      <Form onSubmit={handleSubmit}>
        {/* Image URL */}
        <Form.Group className="mb-3">
          <Form.Label>Image URL</Form.Label>
          <Form.Control
            type="text"
            placeholder="https://placehold.co/600x400"
            name="image"
            value={formData.image}
            onChange={handleChange}
            required
          />
        </Form.Group>

        {/* Title */}
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter a title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </Form.Group>

        {/* Description */}
        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter a description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </Form.Group>

        {/* Category */}
        <Form.Group className="mb-3">
          <Form.Label>Category</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter a category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          />
        </Form.Group>

        {/* Price */}
        <Form.Group className="mb-3">
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter a price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            step="0.01"
            min="0"
          />
          {/* Note: value is a string from the input; handleSubmit converts to Number */}
        </Form.Group>

        {/* Submit button */}
        <Button
          variant="primary"
          type="submit"
          style={{ backgroundColor: "#003366", borderColor: "#003366" }}
        >
          Add Product
        </Button>
      </Form>
    </Container>
  );
}

export default AddProduct;
