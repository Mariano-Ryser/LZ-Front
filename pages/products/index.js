import { useState, useContext } from 'react';
import { AuthContext } from '../../components/auth/AuthProvider';
import { useProduct } from '../../services/useProducts';
import { ProductCreator } from './productCreator';
import { ProductEditor } from './productEditor';

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

  const filteredProducts = products.filter((p) =>
    `${p.artikelName} ${p.artikelNumber}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      <div className="products-table">
        <div className="table-header">
          <div className="table-cell">A-Name</div>
          <div className="table-cell">A-Number</div>
          <div className="table-cell">L-Platz</div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="table-row">
            <div className="table-cell" colSpan="4">
              No se encontraron productos
            </div>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <div
              key={product._id}
              className="table-row"
              onClick={() => {
                setEditingProduct(product);
                setProductToEdit(product);
              }}
            >
              <div className="table-cell">{product.artikelName}</div>
              <div className="table-cell">{product.artikelNumber}</div>
              <div className="table-cell">{product.lagerPlatz}</div>
        
            </div>
          ))
        )}
      </div>

     
     
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
    padding: 0rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  .new-product-button {
    margin-bottom: 1rem;
    padding: 0.5rem 1rem;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
  }

  .new-product-button:hover {
    background: #0056b3;
  }

  .filters-container {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
    align-items: center;
  }

  .search-input {
    flex: 1;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    min-width: 200px;
    font-size: 1rem;
  }

  .products-table {
    width: 100%;
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
  }

  .table-header {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    background: #e0e0e0;
    font-weight: bold;
    padding: 0.5rem;
  }

  .table-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    padding: 0.5rem;
    border-bottom: 1px solid #eee;
    cursor: pointer;
    transition: background 0.2s ease;
  }

  .table-row:hover {
    background: #fafafa;
  }

  .table-cell {
    padding: 0.5rem;
    
    text-align: center;
  }

  @media (max-width: 768px) {
    .table-header,
    .table-row {
      grid-template-columns: 2fr 1fr 1fr;
    }

    .filters-container {
      flex-direction: column;
      align-items: stretch;
    }
  }

  @media (max-width: 780px) {
    .table-header,
    .table-row {
      grid-template-columns: 1fr 1fr 1fr;
      font-size: 0.75rem;
    }

    .table-cell {
      padding: 0.20rem;
     font-size: 0.76rem;
    text-align: center;
    }
    

    .search-input {
      font-size: 0.85rem;
      padding: 0.5rem;
    }

    .new-product-button {
      padding: 0.4rem 0.8rem;
      font-size: 0.85rem;
    }
  }
`}</style>
    </div>
  );
}

export default ListProduct;
