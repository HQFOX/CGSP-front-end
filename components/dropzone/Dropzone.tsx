import React, { useMemo, useState } from 'react';
import { FileError, FileRejection, useDropzone } from 'react-dropzone';

import styled from '@emotion/styled';
import { AddPhotoAlternate, Cancel } from '@mui/icons-material';
import { Grid, IconButton, Typography } from '@mui/material';
import Image from 'next/image';

import theme from '../../theme';
import { AbstractFile } from '../forms/types';

const getColor = (props: any) => {
  if (props.isDragAccept) {
    return theme.palette.success.main;
  }
  if (props.isDragReject) {
    return theme.palette.error.main;
  }
  if (props.isFocused) {
    return '#2196f3';
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
  border-color: ${(props) => getColor(props)};
  border-style: dashed;
  background-color: #fafafa;
  color: #bdbdbd;
  outline: none;
  transition: border 0.24s ease-in-out;
  min-height: 200px;
`;

const DeleteButton = styled(IconButton)({
  position: 'absolute',
  top: '-16px',
  right: '-16px',
  backgroundColor: '#F5F5F580'
});

const ImageFrame = styled('div')({
  position: 'relative',
  width: 100,
  height: 100,
  border: '1px solid #F5F5F5'
});

export type CGSPDropzoneProps = {
  label?: string;
  maxContent?: number;
  files?: AbstractFile[];
  onDeleteFile: (file: AbstractFile) => void;
  onAddFile: (files: File[]) => void;
};

export const CGSPDropzone = ({
  label = 'Arraste ou clique para adicionar um ficheiro',
  maxContent = 1,
  files,
  onDeleteFile,
  onAddFile
}: CGSPDropzoneProps) => {
  const [errors, setErrors] = useState<FileError[]>([]);

  const [disabled, setDisabled] = useState(false);

  useMemo(() => {
    setDisabled(files && files.length >= maxContent ? true : false);
  }, [maxContent, files]);

  const handleAddFile = (acceptedFiles: File[], fileRejections: FileRejection[]) => {
    setErrors([]);
    if (acceptedFiles.length > 0) onAddFile(acceptedFiles);
    if (fileRejections.length > 0) setErrors(fileRejections[0].errors as any);
  };

  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } = useDropzone({
    onDrop: handleAddFile,
    maxFiles: maxContent,
    disabled: disabled,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/jpg': []
    }
  });

  const handleDeleteFile = (e: React.MouseEvent<HTMLButtonElement>, file: AbstractFile) => {
    e.stopPropagation();
    onDeleteFile(file);
  };

  return (
    <Grid container rowSpacing={2}>
      <Grid item xs={12}>
        <Container {...getRootProps({ isFocused, isDragAccept, isDragReject })}>
          <input {...getInputProps()} />
          <Typography color={theme.palette.text.secondary}>
            {disabled
              ? 'Número máximo de ficheiros atingido'
              : isDragAccept
                ? 'Solte o ficheiro'
                : label}
          </Typography>
          {!disabled && <AddPhotoAlternate fontSize="large" color={'action'} />}
          {errors.map((error, i) => (
            <Typography key={i} color={'error'}>
              {error.message}
            </Typography>
          ))}
        </Container>
      </Grid>
      {files &&
        files?.length > 0 &&
        files.map((file, index) => (
          <Grid item xs={2} key={index}>
            <div style={{ position: 'relative' }}>
              <ImageFrame>
                <Image
                  src={
                    file.file
                      ? URL.createObjectURL(file.file)
                      : `${process.env.NEXT_PUBLIC_S3_URL}${file.filename}`
                  }
                  fill
                  style={{ objectFit: 'contain' }}
                  alt="submitted image"
                />
                <DeleteButton
                  aria-label="delete"
                  color="secondary"
                  onClick={(e) => handleDeleteFile(e, file)}>
                  <Cancel />
                </DeleteButton>
              </ImageFrame>
            </div>
          </Grid>
        ))}
    </Grid>
  );
};
