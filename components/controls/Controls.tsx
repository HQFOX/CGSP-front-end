import React from 'react';

import styled from '@emotion/styled';
import { Close, GridView, MapOutlined, Search, Tune } from '@mui/icons-material';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  Paper,
  Popper,
  Slider,
  Stack,
  Typography
} from '@mui/material';
import { useTranslation } from 'next-i18next';

import { ViewType } from '../../pages/projects';
import Dropdown from '../dropdown/Dropdown';
import { SearchParams } from '../projects/projectInventory/utils';

const StyledInput = styled.input({
  fontSize: '1rem',
  border: 0,
  borderBottom: 1,
  boxShadow: 'none',
  ':focus': {
    outline: 'none'
  }
});

export interface ControlProps {
  search: SearchParams;
  view?: ViewType;
  districts?: string[];
  assignmentStatus?: AssignmentStatusType[];
  constructionsStatus?: ConstructionStatusType[];
  priceRange?: number[];
  typologies?: string[];
  types?: string[];
  onWildCardChange?: (wildcard: string) => void;
  onViewChange?: (view: ViewType) => void;
  onStatusChange?: (status: string) => void;
  onDistrictChange?: (district: string) => void;
  onPriceRangeChange?: (checked: boolean, range?: number[]) => void;
  onTypologyChange?: (typology: string, checked: boolean, type: 'typologies' | 'types') => void;
  // onTypeChange?: (type: string, checked: boolean) => void,
  onAssignmentStatusChange?: (status: AssignmentStatusType, checked: boolean) => void;
  onConstructionStatusChange?: (status: ConstructionStatusType, checked: boolean) => void;
}

export const Controls = ({
  search,
  view = 'card',
  districts = [],
  assignmentStatus = ['WAITING', 'ONGOING', 'CONCLUDED'],
  constructionsStatus = ['ALLOTMENTPERMIT', 'BUILDINGPERMIT', 'CONCLUDED'],
  priceRange = [0, 0],
  typologies = [],
  types = [],
  onWildCardChange,
  onViewChange,
  onDistrictChange: onDistrictChange,
  onPriceRangeChange = () => {},
  onTypologyChange = () => {},
  // onTypeChange = () => {},
  onAssignmentStatusChange = () => {},
  onConstructionStatusChange = () => {}
}: ControlProps) => {
  const { t } = useTranslation('projectpage');

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;

  const [priceRangeState, setPriceRangeState] = React.useState<number[]>(priceRange);

  const handleChange = (event: unknown, checked: boolean, newValue?: number | number[]) => {
    if (newValue instanceof Array) setPriceRangeState(newValue);
    onPriceRangeChange(checked, priceRangeState);
  };

  const handleTypologyChange = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    onTypologyChange(event.target.name, checked, 'typologies');
  };

  const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    onTypologyChange(event.target.name, checked, 'types');
  };

  const handleAssignmentStatusChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    onAssignmentStatusChange(event.target.name as AssignmentStatusType, checked);
  };

  const handleConstructionStatusChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    onConstructionStatusChange(event.target.name as ConstructionStatusType, checked);
  };

  return (
    <Paper sx={{ ml: 1, mr: 1, p: 2, mb: 2, border: '1px solid rgb(237, 237, 237)', boxShadow: 0 }}>
      <Grid container spacing={2}>
        {onWildCardChange && (
          <Grid item>
            <Button size={'large'} variant={'outlined'} startIcon={<Search />} disableRipple>
              <StyledInput
                placeholder={t('searchPlaceholder')}
                onChange={(e) => onWildCardChange(e.target.value)}
                value={search.wildcard}
              />
            </Button>
          </Grid>
        )}
        {onViewChange && (
          <Grid item sx={{ ml: 'auto' }}>
            <IconButton
              aria-label="map view"
              onClick={() => onViewChange('map')}
              color={view === 'map' ? 'primary' : 'default'}>
              <MapOutlined />
            </IconButton>
            <IconButton
              aria-label="card view"
              onClick={() => onViewChange('card')}
              color={view === 'card' ? 'primary' : 'default'}>
              <GridView />
            </IconButton>
          </Grid>
        )}
        {onDistrictChange && (
          <Grid item>
            <Typography sx={{ mr: 1, verticalAlign: 'middle' }} component={'span'} variant="body1">
              {t('locationFilterLabel')}:{' '}
            </Typography>
            <Dropdown
              label={'District'}
              displayValue={search.district}
              options={districts}
              valueChange={onDistrictChange}
            />
          </Grid>
        )}
        <Grid item>
          <Button startIcon={<Tune />} sx={{ textTransform: 'capitalize' }} onClick={handleClick}>
            {t('filters')}
          </Button>
          <Popper id={id} open={open} anchorEl={anchorEl} placement="bottom">
            <Paper sx={{ p: 6 }}>
              <IconButton
                aria-label="close"
                onClick={() => setAnchorEl(null)}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8
                }}>
                <Close />
              </IconButton>
              <Stack spacing={2}>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name={'all'}
                        checked={search.constructionStatus.length === constructionsStatus.length}
                        indeterminate={
                          search.constructionStatus.length > 0 &&
                          search.constructionStatus.length < constructionsStatus.length
                        }
                        onChange={handleConstructionStatusChange}
                      />
                    }
                    label={t('projectDetails.constructionStatus')}
                  />
                  <Box ml={3} component={FormGroup}>
                    {constructionsStatus.map((status, index) => (
                      <FormControlLabel
                        control={
                          <Checkbox
                            name={status}
                            onChange={handleConstructionStatusChange}
                            checked={search.constructionStatus.includes(status)}
                          />
                        }
                        label={t(`constructionStatus.${status}`)}
                        key={index}
                      />
                    ))}
                  </Box>
                </FormGroup>
                <div>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name={'all'}
                        checked={search.assignmentStatus.length === assignmentStatus.length}
                        indeterminate={
                          search.assignmentStatus.length > 0 &&
                          search.assignmentStatus.length < assignmentStatus.length
                        }
                        onChange={handleAssignmentStatusChange}
                      />
                    }
                    label={t('projectDetails.assignmentStatus')}
                  />
                  <Box ml={3} component={FormGroup}>
                    {assignmentStatus.map((status, index) => (
                      <FormControlLabel
                        control={
                          <Checkbox
                            name={status}
                            onChange={handleAssignmentStatusChange}
                            checked={search.assignmentStatus.includes(status)}
                          />
                        }
                        label={t(`assignmentStatus.${status}`)}
                        key={index}
                      />
                    ))}
                  </Box>
                </div>
                <div>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name={'all'}
                        onChange={handleTypologyChange}
                        checked={
                          search.typologies.length === typologies.length &&
                          search.types.length === types.length
                        }
                        indeterminate={
                          (search.typologies.length > 0 &&
                            search.typologies.length <= typologies.length) ||
                          (search.types.length > 0 && search.types.length <= types.length)
                        }
                      />
                    }
                    label={t('projectDetails.typologies')}
                  />
                  <Box ml={3} component={FormGroup} row>
                    {typologies.map((typology, index) => (
                      <FormControlLabel
                        control={<Checkbox onChange={handleTypologyChange} name={typology} />}
                        label={typology}
                        key={index}
                        checked={search.typologies.includes(typology)}
                      />
                    ))}
                  </Box>
                  <Box ml={3} component={FormGroup} row>
                    {types.map((type, index) => (
                      <FormControlLabel
                        control={<Checkbox onChange={handleTypeChange} name={type} />}
                        label={type}
                        key={index}
                        checked={search.types.includes(type)}
                      />
                    ))}
                  </Box>
                </div>
                <div>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name=""
                        onChange={(e, checked) => handleChange(e, checked)}
                        checked={search.priceRange.length > 0}
                      />
                    }
                    label={t('projectDetails.price')}
                  />
                  <Slider
                    getAriaLabel={() => 'price range'}
                    value={priceRangeState}
                    onChange={(event, value) => handleChange(event, true, value)}
                    valueLabelDisplay="auto"
                    marks={[
                      { value: priceRange[0], label: priceRange[0] },
                      { value: priceRange[1], label: priceRange[1] }
                    ]}
                    min={priceRange[0]}
                    max={priceRange[1]}
                  />
                </div>
              </Stack>
            </Paper>
          </Popper>
        </Grid>
      </Grid>
    </Paper>
  );
};
