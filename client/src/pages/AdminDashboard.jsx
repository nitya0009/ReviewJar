import { useEffect, useState } from "react";
import api from "../api/axios";
import { resolveImageUrl } from "../api/config";

const emptyForm = { name: "", description: "", category: "", price: "" };

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    const { data } = await api.get("/products", { params: { limit: 100 } });
    setProducts(data.products);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const resetForm = () => {
    setForm(emptyForm);
    setImageFile(null);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("category", form.category);
      formData.append("price", form.price);
      if (imageFile) formData.append("image", imageFile);

      const config = { headers: { "Content-Type": "multipart/form-data" } };

      if (editingId) {
        await api.put(`/products/${editingId}`, formData, config);
      } else {
        await api.post("/products", formData, config);
      }
      resetForm();
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
    });
    setImageFile(null);
    setEditingId(product._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product? This also removes its reviews.")) return;
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded-lg shadow mb-8 grid grid-cols-1 md:grid-cols-2 gap-3"
      >
        <h2 className="md:col-span-2 font-semibold">
          {editingId ? "Edit Product" : "Add New Product"}
        </h2>
        {error && <p className="md:col-span-2 text-red-500 text-sm">{error}</p>}
        <input
          name="name"
          placeholder="Product name"
          value={form.name}
          onChange={handleChange}
          className="border rounded p-2"
          required
        />
        <input
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          className="border rounded p-2"
          required
        />
        <input
          name="price"
          type="number"
          step="0.01"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className="border rounded p-2"
          required
        />
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="border rounded p-2 w-full text-sm"
          />
          {editingId && !imageFile && (
            <p className="text-xs text-gray-400 mt-1">Leave blank to keep current image</p>
          )}
        </div>
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="border rounded p-2 md:col-span-2"
          rows={3}
          required
        />
        <div className="md:col-span-2 flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : editingId ? "Update Product" : "Add Product"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="border px-4 py-2 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <h2 className="font-semibold mb-3">All Products</h2>
      <div className="space-y-2">
        {products.map((product) => (
          <div key={product._id} className="bg-white p-3 rounded shadow flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img
                src={resolveImageUrl(product.image)}
                alt={product.name}
                className="w-12 h-12 object-cover rounded"
              />
              <div>
                <p className="font-semibold">{product.name}</p>
                <p className="text-sm text-gray-500">
                  {product.category} · ${product.price?.toFixed(2)} · {product.numReviews} reviews
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(product)} className="text-primary hover:underline text-sm">
                Edit
              </button>
              <button onClick={() => handleDelete(product._id)} className="text-red-500 hover:underline text-sm">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
