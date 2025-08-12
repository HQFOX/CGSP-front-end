import React from 'react';
import { useMemo, useState } from 'react';

import { Circle, FlagCircle } from '@mui/icons-material';
import { Button, Dialog, Grid } from '@mui/material';

import UpdateCard from '../updates/UpdateCard';

export const UpdateStepper = ({ updates }: { updates?: Update[] }) => {
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [updateDialog, setUpdateDialog] = useState<Update>();

  const handleShowUpdateDialog = (update: Update) => {
    setUpdateDialog(update);
    setUpdateDialogOpen(true);
  };

  const Seperator = () => (
    <>
      <Grid item xs={6} height={50} borderRight={'1px solid black'} alignItems="center"></Grid>
      <Grid item xs={6} height={50} alignItems="center"></Grid>
    </>
  );

  const LeftRow = ({
    post,
    icon,
    index
  }: {
    post: Update;
    icon: React.ReactNode;
    index: number;
  }) => (
    <>
      <Grid item xs={6} display={'flex'} justifyContent="right" height={40} alignItems="center">
        <Button
          style={{ textTransform: 'none' }}
          onClick={() => handleShowUpdateDialog(post)}>{`${index}. ${post.title}`}</Button>
        {icon}
      </Grid>
      <Grid item xs={6} alignItems="center"></Grid>
    </>
  );

  const RightRow = ({
    post,
    icon,
    index
  }: {
    post: Update;
    icon: React.ReactNode;
    index: number;
  }) => (
    <>
      <Grid item xs={6} display={'flex'} height={40} alignItems="center"></Grid>
      <Grid item xs={6} display={'flex'} height={40} alignItems="center">
        {icon}
        <Button
          style={{ textTransform: 'none' }}
          onClick={() => handleShowUpdateDialog(post)}>{`${index}. ${post.title}`}</Button>
      </Grid>
    </>
  );

  const test = useMemo(() => {
    const updateRender: JSX.Element[] = [];

    updates != null &&
      updates.map((update, index) => {
        index % 2 == 0
          ? updateRender.push(
              <LeftRow
                post={update}
                key={index + 'row'}
                icon={
                  index === 0 ? (
                    <FlagCircle color="primary" style={{ position: 'relative', right: '-11px' }} />
                  ) : (
                    <Circle color="primary" style={{ position: 'relative', right: '-11px' }} />
                  )
                }
                index={index + 1}
              />
            )
          : updateRender.push(
              <RightRow
                post={update}
                key={index + 'row'}
                icon={<Circle color="primary" style={{ position: 'relative', left: '-13px' }} />}
                index={index + 1}
              />
            );

        updateRender.push(<Seperator key={index + 'seperator'} />);
      });
    return updateRender;
  }, [updates]);

  return (
    <Grid container>
      {test}
      <Dialog open={updateDialogOpen} onClose={() => setUpdateDialogOpen(false)} maxWidth="lg">
        {updateDialog && <UpdateCard post={updateDialog} />}
      </Dialog>
    </Grid>
  );
};
