type ProjectFile = {
	filename: string;
};

type Project = {
	id: string;
	title: string;
	district?: string;
	county?: string;
	status?: 'completed' | 'building' | 'open';
	assignmentStatus?: AssignmentStatusType;
	constructionStatus?: ConstructionStatusType;
	coordinates?: [float, float];
	coverPhoto?: ProjectFile;
	files?: ProjectFile[];
	lots?: number;
	assignedLots?: number;
	typologies?: TypologyDetails[];
	updates?: Updates[];
	createdOn?: string;
	enrollRequests?: EnrollRequest[];
	enrollRequestsCount?: number;
	priority?: number;
};

type TypologyDetails = {
	typology?: string;
	type?: string;
	bedroomNumber?: number;
	bathroomNumber?: number;
	garageNumber?: number;
	price?: float;
	plant?: ProjectFile;
	totalLotArea?: number;
	livingArea?: number;
	lots?: number;
	assignedLots?: number;
};

type ProjectDetails = {
	typology: string;
	bedroomNumber: number;
	bathroomNumber: number;
};

type AssignmentStatusType = 'WAITING' | 'ONGOING' | 'CONCLUDED';

type ConstructionStatusType = 'ALLOTMENTPERMIT' | 'BUILDINGPERMIT' | 'CONCLUDED';
