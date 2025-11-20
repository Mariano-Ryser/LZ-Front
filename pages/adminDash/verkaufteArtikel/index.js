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
        <header className="header">
          <div className="header-content">
            <h1 className="page-title">Verkaufte Artikel</h1>
            <p className="page-subtitle">Übersicht aller verkauften Artikel und Verkaufsstatistiken</p>
          </div>
        </header>
        <ArticleList products={products} sales={sales} />
      </div>

      <style jsx>{`
        .container {
         margin: 0px;
          padding: 0px;
          min-height: 100vh;
        }

        .header {
          margin-bottom: 30px;
        }

        .page-title {
          font-size: 2rem;
          font-weight: 700;
          color: #333;
          margin: 0 0 8px 0;
          line-height: 1.2;
        }

        .page-subtitle {
          color: #6c757d;
          font-size: 1rem;
          margin: 0;
          font-weight: 400;
        }

        @media (max-width: 768px) {
          .container {
            padding: 15px;
          }

          .page-title {
            font-size: 1.75rem;
          }
        }

        @media (max-width: 480px) {
          .container {
            padding: 10px;
          }

          .page-title {
            font-size: 1.5rem;
          }

          .page-subtitle {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </DashboardLayout>
  );
}