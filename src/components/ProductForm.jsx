import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

/**
 * ProductForm
 *
 * Reusable form component for creating or editing a product.
 *
 * Props:
 *  - initialValues: object with { title, description, category, price, image? }
 *      The form is initialized from this object. Caller should provide a stable object.
 *  - onSubmit: function(formData) -> called when user submits the form
 *  - submitting: boolean -> disables the submit button while submitting
 *  - submitLabel: string -> optional label for the submit button
 *
 * Notes:
 *  - The component mirrors the native useState setter API for controlled inputs.
 *  - Keep validation in the parent or add additional validation here as needed.
 *  - Styling uses Bootstrap form controls and the app's dark-blue button color.
 */
export default function ProductForm({
  initialValues,
  onSubmit,
  submitting,
  submitLabel = "Submit",
}) {
  // Initialize local form state from props.
  // Keep a defensive fallback in case initialValues is undefined.
  const [formData, setFormData] = useState(
    initialValues ?? {
      title: "",
      description: "",
      category: "",
      price: "",
    }
  );

  /**
   * handleChange
   * Generic change handler for controlled inputs.
   * - Reads `name` and `value` from the target and updates the matching key in formData.
   * - Works with text, number, textarea inputs used in this form.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  /**
   * handleSubmit
   * - Prevents default form submission.
   * - Calls the provided onSubmit callback with the current formData.
   * - Parent component should handle async submission and error handling.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (typeof onSubmit === "function") {
      onSubmit(formData);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {/* Title */}
      <Form.Group className="mb-3">
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
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
          name="price"
          step="0.01"
          value={formData.price}
          onChange={handleChange}
          required
        />
        {/* Note: Price is kept as string/number from inputs; parent may want to cast to Number before sending */}
      </Form.Group>

      {/* Submit button
          - Uses the app's dark-blue color to match other CTAs.
          - Disabled while submitting to prevent duplicate requests.
      */}
      <Button
        variant="primary"
        type="submit"
        disabled={submitting}
        style={{ backgroundColor: "#003366", borderColor: "#003366" }}
        className="w-100"
      >
        {submitting ? "Submitting..." : submitLabel}
      </Button>
    </Form>
  );
}
