type Project = {
  title: string;
  location?: string;
  status?: "completed" | "building" | "open"
};

type ProjectDetails = {
  tipology: string;
  bedroomNumber: string;
  bathroomNumber: string;
}