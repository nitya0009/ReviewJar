import { useEffect, useState } from "react";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { userInfo, updateUser } = useAuth();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const wishlist = (userInfo?.wishlist || []).map((id) =>
    typeof id === "string" ? id : id._id
  );

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/products", {
        params: { search, category, sort, page, limit: 6 },
      });
      setProducts(data.products);
      setPages(data.pages);
      if (allCategories.length === 0) {
        // build category list once from a broader fetch on first load
      }
    } catch (err) {
      setError("Could not load products");
    } finally {
      setLoading(false);
    }
  };

  // Fetch all categories once (separate light call, no filters) for the dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get("/products", { params: { limit: 1000 } });
        setAllCategories([...new Set(data.products.map((p) => p.category))]);
      } catch (err) {
        // non-critical
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, category, sort]);

  useEffect(() => {
    const delay = setTimeout(fetchProducts, 300);
    return () => clearTimeout(delay);
    // eslint-disable-next-line
  }, [search, category, sort, page]);

  const handleWishlistChange = (newWishlist) => {
    updateUser({ wishlist: newWishlist });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Browse Products</h1>

      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded p-2 flex-1 min-w-[200px]"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border rounded p-2"
        >
          <option value="">All Categories</option>
          {allCategories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border rounded p-2"
        >
          <option value="">Sort: Newest</option>
          <option value="rating">Sort: Highest Rated</option>
          <option value="price-asc">Sort: Price Low to High</option>
          <option value="price-desc">Sort: Price High to Low</option>
        </select>
      </div>

      {error && <p className="text-red-500">{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                wishlist={wishlist}
                onWishlistChange={handleWishlistChange}
              />
            ))}
          </div>
          <Pagination page={page} pages={pages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
};

export default Home;
