type Project = {
  id: string;
  title: string;
  location?: string;
  status?: "completed" | "building" | "open";
  coordinates?: any;
  lots?: number;
  assignedLots?: number;
  typologies?: TypologyDetails[];
  updates?: Updates[];
};

type TypologyDetails = {
  typology?: string;
  bedroomNumber?: string;
  bathroomNumber?: string; 
  garageNumber?: string; 
  price?: string; 
  plant?: string; 
}

type ProjectDetails = {
  typology: string;
  bedroomNumber: string;
  bathroomNumber: string;
}