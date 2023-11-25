type ProjectFile = {
  filename: string
};

type Project = {
  id: string;
  title: string;
  location?: string;
  status?: "completed" | "building" | "open";
  assignmentStatus?: AssignmentStatusType;
  constructionStatus?: ConstructionStatusType;
  coordinates?: [float,float];
  coverPhoto?: ProjectFile;
  files?: ProjectFile[];
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

type AssignmentStatusType = "WAITING" | "ONGOING" | "CONCLUDED";

type ConstructionStatusType = "ALLOTMENTPERMIT" | "BUILDINGPERMIT" | "CONCLUDED";