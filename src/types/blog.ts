export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  coverImage: string;
  author: string;
  date: string;
  readTime?: string;
  isFeatured?: boolean;
  tags?: string[];
}

export type ArticleInput = Omit<Article, 'id' | 'date'> & {
  date?: string;
};
