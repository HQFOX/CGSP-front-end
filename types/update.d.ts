type Update = {
  id?: string;
  title: string;
  content?: string;
  createdOn?: string;
  image?: string;
  files: {filename: string}[]
  project?: {
    projectId: string,
    title: string,
  } 
};
