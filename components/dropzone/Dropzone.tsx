import React, { useEffect, useState } from "react";

import { AddPhotoAlternate, Cancel } from "@mui/icons-material";
import { Grid, IconButton, Typography } from "@mui/material";

import styled from "@emotion/styled";

import { FileError, FileRejection, useDropzone } from "react-dropzone";
import Image from "next/image";
import theme from "../../theme";
import { AbstractFile } from "../forms/types";


// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getColor = (props: any) => {
	if (props.isDragAccept) {
		return theme.palette.success.main;
	}
	if (props.isDragReject) {
		return theme.palette.error.main;
	}
	if (props.isFocused) {
		return "#2196f3";
	}
	return theme.palette.primary.main;
};
  
const Container = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 20px;
	border-width: 2px;
	border-radius: 2px;
	border-color: ${props => getColor(props)};
	border-style: dashed;
	background-color: #fafafa;
	color: #bdbdbd;
	outline: none;
	transition: border .24s ease-in-out;
	min-height: 200px;
  `;

export type CGSPDropzoneProps = {
  label?: string;
  maxContent?: number;
  files?: AbstractFile[];
  onDeleteFile: (file: AbstractFile) => void;
  onAddFile: (files: File[]) => void;
};

export const CGSPDropzone = ({
	label = "Arraste ou clique para adicionar um ficheiro",
	maxContent = 1,
	files,
	onDeleteFile,
	onAddFile
}: CGSPDropzoneProps) => {
	const [errors, setErrors] = useState<FileError[]>([]);

	const [disabled, setDisabled] = useState(false);

	useEffect(() => {
		setDisabled(files && files.length >= maxContent ? true : false);
	},[files]);

	const handleAddFile = (acceptedFiles: File[], fileRejections: FileRejection[]) => {
		console.log(acceptedFiles);
		setErrors([]);
		if (acceptedFiles.length > 0) onAddFile(acceptedFiles);
		if (fileRejections.length > 0) setErrors(fileRejections[0].errors);
	};

	const {
		// acceptedFiles, 
		getRootProps, 
		getInputProps, 
		isFocused,
		isDragAccept,
		isDragReject} = useDropzone({
		onDrop: handleAddFile,
		maxFiles: maxContent,
		disabled: disabled,
		accept: {
			  "image/jpeg": [],
			  "image/png": []
		}
		  });



	const handleDeleteFile = (e: React.MouseEvent<HTMLButtonElement>, file: AbstractFile) => {
		e.stopPropagation();
		onDeleteFile(file);
	};


	return (
		<Grid container rowSpacing={2}>
			<Grid item xs={12}>
				<Container  {...getRootProps({isFocused, isDragAccept, isDragReject})}>
					<input {...getInputProps()} />
					<Typography color={theme.palette.text.secondary}>
						{ disabled ? "Número máximo de ficheiros atingido" : isDragAccept ? "Solte o ficheiro" : label}
					</Typography>
					{!disabled && <AddPhotoAlternate fontSize="large" color={"action"} />}
					{errors.map((error,i) => (
						<Typography key={i} color={"error"}>{error.message}</Typography>
					))}
				</Container>
			</Grid>
			<Grid item>
				{ files && files?.length > 0 && files.map( (file, index) =>
					<div key={index} style={{ position: "relative" }}>
						<div style={{ position: "relative", width: 100, height: 100 , border: "1px solid #F5F5F5"}}>
							<Image
								src={file.file ? URL.createObjectURL(file.file) : `${process.env.NEXT_PUBLIC_S3_URL}${file.filename}`}
								fill
								style={{objectFit: "contain"}}
								alt="submitted image" />
							<IconButton
								aria-label="delete"
								sx={{
									position: "absolute",
									top: "-16px",
									right: "-16px",
									backgroundColor: "#F5F5F580"
								}}
								color="secondary"
								onClick={(e) => handleDeleteFile(e, file)}>
								<Cancel />
							</IconButton>
						</div>
					</div>
				)}
			</Grid>
		</Grid>
	);
};
