import { AddPhotoAlternate, Cancel } from '@mui/icons-material';
import { Box, Grid, IconButton, Typography } from '@mui/material';
import Dropzone, { FileError, FileRejection } from 'react-dropzone';
import Image from 'next/image';
import { useState } from 'react';
import theme from '../../theme';

export type CGSPDropzoneProps = {
  label?: string;
  maxContent?: number;
  files?: File[];
  onDeleteFile?: any;
  onAddFile?: any;
};

export const CGSPDropzone = ({
  label = 'Arraste ou clique para adicionar um ficheiro',
  maxContent = 1,
  files,
  onDeleteFile,
  onAddFile
}: CGSPDropzoneProps) => {
  const [errors, setErrors] = useState<FileError[]>([]);

  const handleAddFile = (acceptedFiles: File[], fileRejections: FileRejection[]) => {
    console.log(acceptedFiles);
    setErrors([]);
    if (acceptedFiles.length > 0) onAddFile(acceptedFiles);
    if (fileRejections.length > 0) setErrors(fileRejections[0].errors);
  };

  const handleDeleteFile = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onDeleteFile();
  };

  return (
    <>
      <Dropzone
        onDrop={handleAddFile}
        maxFiles={maxContent}
        accept={{ 'image/jpeg': [], 'image/png': [] }}>
        {({ getRootProps, getInputProps }) => (
          <Box
            {...getRootProps()}
            sx={{
              border: `2px dashed`,
              borderColor: theme.palette.primary.main,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: theme.palette.background.paper,
              minHeight: "250px",
            }}
            padding={4}>
            <input {...getInputProps()} />
            {files && files?.length > 0 ? (
              <div style={{ position: 'relative' }}>
                <Image
                  src={URL.createObjectURL(files[0])}
                  objectFit='cover'
                  width={300}
                  height={300}
                />
                <IconButton
                  aria-label="delete"
                  sx={{
                    position: 'absolute',
                    top: '-15px',
                    right: '-15px',
                    backgroundColor: '#F5F5F580'
                  }}
                  color="secondary"
                  onClick={(e) => handleDeleteFile(e)}>
                  <Cancel />
                </IconButton>
              </div>
            ) : (
              <Grid container justifyContent={'center'} textAlign={'center'}>
                <Grid item>
                  <Typography variant="h6" color={theme.palette.text.secondary}>
                    {label}
                  </Typography>
                </Grid>
                <Grid item md={12}>
                  <AddPhotoAlternate fontSize="large" color={'action'} />
                </Grid>
              </Grid>
            )}
          </Box>
        )}
      </Dropzone>
      {errors.map((error) => (
        <Typography color={'error'}>{error.message}</Typography>
      ))}
    </>
  );
};
