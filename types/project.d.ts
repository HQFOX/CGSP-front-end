type Project = {
  id?: string;
  title: string;
  location?: string;
  status?: "completed" | "building" | "open";
  coordinates?: any;
};

type ProjectDetails = {
  typology: string;
  bedroomNumber: string;
  bathroomNumber: string;
}