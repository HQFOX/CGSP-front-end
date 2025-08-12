type EnrollRequest = {
	id?: string;
	firstName?: string;
	lastName?: string;
	telephoneNumber?: string;
	email?: string;
	projectId?: string;
	status?: 'Approved' | 'Waiting' | 'Refused';
	subscribedUpdates?: boolean;
	createdOn?: string;
};
