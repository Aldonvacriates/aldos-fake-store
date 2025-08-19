import React, { useEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Loader from "../components/Loader";
import ProductForm from "../components/ProductForm";
import { getProduct, updateProduct } from "../api/api";
import { useParams } from "react-router-dom";

export default function EditProduct() {
  const { id } = useParams();
  const [initial, setInitial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getProduct(id)
      .then(
        (data) =>
          mounted &&
          setInitial({
            title: data.title ?? "",
            price: String(data.price ?? ""),
            description: data.description ?? "",
            category: data.category ?? "",
          })
      )
      .catch((err) => mounted && setError(err.message))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [id]);

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    setSuccess("");
    setError("");
    try {
      const res = await updateProduct(id, payload);
      setSuccess(
        `Updated! (id: ${
          res.id || id
        }) — FakeStore API will not persist changes after refresh.`
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader label="Loading product..." />;

  if (error) return <Alert variant="danger">{error}</Alert>;

  if (!initial) return <Alert variant="warning">Product not found.</Alert>;

  return (
    <>
      <h2 className="mb-3">Edit Product</h2>
      {success && (
        <Alert variant="success" onClose={() => setSuccess("")} dismissible>
          {success}
        </Alert>
      )}
      {error && (
        <Alert variant="danger" onClose={() => setError("")} dismissible>
          {error}
        </Alert>
      )}
      <ProductForm
        initialValues={initial}
        onSubmit={handleSubmit}
        submitting={submitting}
        submitLabel="Update"
      />
    </>
  );
}
