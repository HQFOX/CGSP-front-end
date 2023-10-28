type Project = {
  id: string;
  title: string;
  location?: string;
  status?: "completed" | "building" | "open";
  assignmentStatus?: string;
  constructionStatus?: string;
  coordinates?: any;
  coverPhoto?: string;
  lots?: number;
  assignedLots?: number;
  typologies?: TypologyDetails[];
  updates?: Updates[];
};

type TypologyDetails = {
  typology?: string;
  type?: string;
  bedroomNumber?: string;
  bathroomNumber?: string; 
  garageNumber?: string; 
  price?: number; 
  plant?: string; 
}

type ProjectDetails = {
  typology: string;
  bedroomNumber: string;
  bathroomNumber: string;
}