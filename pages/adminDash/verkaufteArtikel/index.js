import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { useProduct } from "../../../hooks/useProducts";
import { useSales } from "../../../hooks/useSales";
import ArticleList from "./components/ArtikelList";

export default function VerkauftetArtikelPage() {
  const { products } = useProduct();
  const { sales } = useSales();

  return (
    <DashboardLayout>
      <div className="container">
        <h1 className="title">📦 Artículos Vendidos</h1>
        <ArticleList products={products} sales={sales} />
      </div>

      <style jsx>{`
        .container { 
          padding: 20px; 
          max-width: 1900px;
          margin: 0 auto;
        }
        .title { 
          font-size: 32px; 
          text-align: center; 
          margin-bottom: 25px; 
          color: #333;
        }
      `}</style>
    </DashboardLayout>
  );
}
