import { useState, useEffect, useRef, useContext } from 'react';
import { AuthContext } from '../../components/auth/AuthProvider';
import { useProduct } from '../../services/useProducts';
import { ProductCreator } from './productCreator';
import { ProductEditor } from './productEditor';
import Loader from '../../utils/loader'

export function ListProduct() {
  const {
    product,
    products,
    loading,
    error,
    updateProduct,
    handleChange,
    createProduct,
    deleteProduct,
    setProductToEdit,
  } = useProduct();

  const { isAuthenticated } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleCount, setVisibleCount] = useState(50);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadMoreRef = useRef(null);

  const filteredProducts = products.filter((p) =>
    `${p.artikelName} ${p.artikelNumber}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  // Infinite scroll con IntersectionObserver
  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && visibleCount < filteredProducts.length) {
          setLoadingMore(true);
          setTimeout(() => {
            setVisibleCount((prev) => prev + 50);
            setLoadingMore(false);
          }, 500); // simula carga
        }
      },
      { rootMargin: '200px' } // empieza a cargar un poco antes
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [visibleCount, filteredProducts.length]);

  return (
    <div className="container">
      {isAuthenticated && (
        <button onClick={() => setShowModal(true)} className="new-product-button">
          + Nuevo Producto
        </button>
      )}

      <div className="filters-container">
        <input
          type="text"
          placeholder="Buscar por nombre o número"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      <div className="product-grid">
        {visibleProducts.length === 0 ? (
          <p className="no-products">No se encontraron productos</p>
        ) : (
          visibleProducts.map((product) => (
           <div
  key={product._id}
  className="product-card"
  onClick={() => {
    setEditingProduct(product);
    setProductToEdit(product);
  }}
>
  <div className="image-wrapper">
    {product.imagen ? (
      <img src={product.imagen} alt={product.artikelName} />
    ) : (
      <div className="placeholder">  <img
    src="/img/moving-box.png"
    alt="Logo"
    style={{ width: '8rem', height: '7rem', cursor: 'pointer' }}
  /></div>
    )}
  </div>

  <div className="product-content">
    <h3 className="product-name">{product.artikelName}</h3>
    <p className="lager">Lagerplatz: {product.lagerPlatz || '-'}</p>
   
  </div>
</div>
          ))
        )}
      </div>

      {/* Sentinela para cargar más productos */}
      {visibleCount < filteredProducts.length && (
        <div ref={loadMoreRef} className="load-more-trigger">
          {loadingMore ? <Loader></Loader> : 'Baja para ver más'}
        </div>
      )}

      {editingProduct && (
        <ProductEditor
          product={editingProduct}
          handleChange={handleChange}
          updateProduct={(e, updatedProduct) => {
            updateProduct(e, updatedProduct).then(() => {
              if (!error) setEditingProduct(null);
            });
          }}
          deleteProduct={deleteProduct}
          loading={loading}
          error={error}
          onClose={() => setEditingProduct(null)}
        />
      )}

      {showModal && (
        <ProductCreator
          product={product}
          handleChange={handleChange}
          createProduct={async (e) => {
            e.preventDefault();
            const result = await createProduct(e);
            if (result?.success) {
              setShowModal(false);
            }
          }}
          loading={loading}
          error={error}
          onClose={() => setShowModal(false)}
        />
      )}

     <style jsx>{`
  .container {
    padding: 1rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  /* === BOTÓN NUEVO PRODUCTO === */
  .new-product-button {
    margin-bottom: 1rem;
    padding: 0.6rem 1.2rem;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s ease, transform 0.1s ease;
  }

  .new-product-button:hover {
    background: #0056b3;
    transform: translateY(-2px);
  }

  .new-product-button:active {
    transform: translateY(0);
  }

  /* === CONTENEDOR FILTROS (BUSCADOR) === */
  .filters-container {
    display: flex;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
    align-items: center;
  }

  .search-input {
    flex: 1;
    padding: 0.6rem 1rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    min-width: 240px;
    font-size: 1rem;
    transition: border 0.2s ease, box-shadow 0.2s ease;
  }

  .search-input:focus {
    outline: none;
    border: 1px solid #007bff;
    box-shadow: 0 0 0 3px rgba(0,123,255,0.2);
  }

  /* === GRID PRODUCTOS === */
  .product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 1rem;
  }

  .product-card {
  border: 1px solid #ddd;
  border-radius: 2px;
  padding: 0.75rem;
  background: white;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* empuja el lagerplatz al fondo */
  height: 260px; /* altura fija para alineación */
}
.product-card:hover {
  transform: translateY(-6px);              /* levanta un poco la tarjeta */
  box-shadow: 0 6px 18px rgba(0,0,0,0.12); /* sombra suave */
  border-color: #007bff;                   /* resalta el borde */
}
.image-wrapper {
  flex: 1; /* ocupa el espacio principal */
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
  overflow: hidden;
}

.image-wrapper img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.product-content {
  display: flex;
  flex-direction: column;
}

.product-name {
  font-size: 0.95rem;
  font-weight: 500;
  margin: 0 0 0.5rem 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-wrap: break-word;
  overflow-wrap: anywhere;
  text-align: center;
}

.lager {
  font-size: 0.8rem;
  color: #666;
  text-align: center;
  margin-top: auto; /* se pega abajo */
}
  .load-more-trigger {
    margin: 2rem 0;
    text-align: center;
    color: #555;
  }

  @media (max-width: 768px) {
    .filters-container {
      flex-direction: column;
      align-items: stretch;
    }

    .search-input {
      width: 100%;
    }

    .new-product-button {
      width: 100%;
      text-align: center;
    }
  }
`}</style>
    </div>
  );
}

export default ListProduct;