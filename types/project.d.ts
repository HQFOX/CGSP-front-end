type Project = {
  id?: string;
  title: string;
  location?: string;
  status?: "completed" | "building" | "open";
  coordinates?: any;
  lots?: number;
  assignedLots?: number;
  typologies?: TypologyDetails[];
};

type TypologyDetails = {
  typology?: string;
  bedroomNumber?: string;
  bathroomNumber?: string; 
}

type ProjectDetails = {
  typology: string;
  bedroomNumber: string;
  bathroomNumber: string;
}