import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import '../app/Article.css';

interface ArticleProps {
  articles: {
    id: number;
    image: string;
    title: string;
    content: string;
  }[];
}

const Article: React.FC<ArticleProps> = ({ articles }) => {
  return (
    <div className="article-container">
      <h1 className="analytics-title">Analytics</h1>
      <div className="article-grid">
        {articles.map((article) => (
          <Link href={`/article/${article.id}`} key={article.id}>
            <div className="article-item">
              <div className="article-image">
                <Image src={article.image} alt={article.title} layout="fill" objectFit="cover" />
              </div>
              <div className="article-content">
                <h2>{article.title}</h2>
                <p>{article.content}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Article;