type Update = {
  id?: string;
  title: string;
  content?: string;
  creationDate?: string;
  image?: string;
  files: {filename: string}[]
  project?: {
    projectId: string,
    title: string,
  } 
};
