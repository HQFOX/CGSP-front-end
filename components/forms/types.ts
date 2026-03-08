import { AbstractFile } from '../FileUploader/utils';

export interface TypologyDetailsForm extends Omit<TypologyDetails, 'plant'> {
	index: number;
	plant?: AbstractFile;
}
