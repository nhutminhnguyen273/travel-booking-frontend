export enum BlogCategory {
  NEWS = 'news',
  TRAVEL = 'travel',
  TIPS = 'tips',
  REVIEWS = 'reviews',
  OTHER = 'other'
}

export enum BlogStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

export interface Blog {
  _id: string;
  title: string;
  content: string;
  summary: string;
  thumbnail: string;
  author: string;
  category: BlogCategory;
  tags: string[];
  status: BlogStatus;
  viewCount: number;
  isDeleted: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBlogData {
  title: string;
  content: string;
  summary: string;
  thumbnail: string | File;
  category: BlogCategory;
  tags: string[];
  status: BlogStatus;
}

export interface UpdateBlogData extends Partial<CreateBlogData> {
  isDeleted?: boolean;
} 