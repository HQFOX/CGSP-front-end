type Update = {
  id?: string;
  title: string;
  content?: string;
  creationDate?: string;
  image?: string;
  project?: {
    projectId: string,
    title: string,
  } 
};
