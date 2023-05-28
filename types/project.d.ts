type Project = {
  id?: string;
  title: string;
  location?: string;
  status?: "completed" | "building" | "open"
};

type ProjectDetails = {
  typology: string;
  bedroomNumber: string;
  bathroomNumber: string;
}