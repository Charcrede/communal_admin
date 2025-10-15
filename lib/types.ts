export interface Rubric {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  rubric_id: string;
  head: string;
  rubric?: Rubric;
  media: Media[];
  created_at: string;
  updated_at: string;
}

export interface Media {
  id: string;
  title: string;
  description: string;
  type: 'image' | 'video' | 'audio';
  url: string;
  youtubeUrl?: string;
  filename: string;
  size: number;
  created_at: string;
  updated_at: string;
}

export interface Admin {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'super_admin';
  created_at: string;
  updated_at: string;
}

export interface CreateArticleData {
  title: string;
  content: string;
  rubricId: string;
  head: string;
  media?: File[];
}

export interface CreateRubricData {
  name: string;
  description: string;
}

export interface CreateMediaData {
  title: string;
  description: string;
  youtubeUrl: string;
  file: File;
}

export interface CreateAdminData {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'super_admin';
}

export interface DashboardOverview {
  overview: {
    counts : [
      {
        title : string,
        value : string,
        change : string,
        icon : any,
        color : string,
        trend : string,
      }
    ], 
    lasts : [
      {
        title : string,
        type : string,
        action: string,
        time : string,
      }
    ]
}
}

