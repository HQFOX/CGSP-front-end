export const normalizeString = (value: string): string => {
  return value.normalize('NFD').replace(/\p{Diacritic}/gu, '');
};

export type SearchParams = {
  title: string;
  district: string;
  assignmentStatus: AssignmentStatusType[];
  constructionStatus: ConstructionStatusType[];
  priceRange: number[];
  typologies: string[];
  types: string[];
  wildcard: string;
};

export type ViewType = 'card' | 'list' | 'map';

export const getPriceRange = (projects: Project[]) => {
  const priceRange: (number | undefined)[] = [undefined, undefined];

  projects.map((project) => {
    project.typologies?.map((typology) => {
      if (typology.price) {
        if (priceRange[0] == undefined || priceRange[0] > typology.price)
          priceRange[0] = typology.price;
        if (priceRange[1] == undefined || priceRange[1] < typology.price)
          priceRange[1] = typology.price;
      }
    });
  });
  return priceRange as number[];
};

export const getTypologies = (projects: Project[]) => {
  const typologies = new Set<string>();

  projects.map((project) => {
    project.typologies?.map((typology) => {
      if (typology.typology) {
        typologies.add(typology.typology);
      }
    });
  });

  return [...typologies];
};

export const getTypes = (projects: Project[]) => {
  const types = new Set<string>();

  projects.map((project) => {
    project.typologies?.map((typology) => {
      if (typology.type) {
        types.add(typology.type);
      }
    });
  });

  return [...types];
};
