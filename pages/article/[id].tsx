import React from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Header from '../../src/components/Header';
import { articles } from '../../src/data/articles';
import '../../src/app/globals.css';
import '../../src/app/Article.css';

const ArticleDetail: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  // Trouvez l'article correspondant à l'ID
  const article = articles.find(a => a.id === Number(id));

  if (!article) {
    return <div>Article non trouvé</div>;
  }

  return (
    <>
      <Header 
        logoImageName="astrolab white png.png"
        showText={true}
        showHeaderWave={true}
      />
      <main className="article-detail-main">
        <h1 className="article-detail-title">{article.title}</h1>
        <div className="article-detail-image">
          <Image src={article.image} alt={article.title} layout="fill" objectFit="cover" />
        </div>
        <div className="article-detail-content">
          <h2>Summary</h2>
          <p>{article.content}</p>
          <h2>Project Details</h2>
          <p>{article.details}</p>
        </div>
      </main>
    </>
  );
};

export default ArticleDetail;