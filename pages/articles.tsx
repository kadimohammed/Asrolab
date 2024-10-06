import React from 'react';
import Header from '../src/components/Header';
import Article from '../src/components/Article';
import { articles } from '../src/data/articles';
import '../src/app/globals.css';
import '../src/app/Article.css';

const ArticlesPage: React.FC = () => {
  return (
    <>
      <Header 
        logoImageName="astrolab white png.png"
        showText={true}
        showHeaderWave={true}
      />
      <main className="articles-main">
        <Article articles={articles} />
      </main>
    </>
  );
};

export default ArticlesPage;