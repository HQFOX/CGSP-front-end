import React from 'react';

import { css } from '@emotion/css';
import { Close, Search, Tune } from '@mui/icons-material';
import {
	Box,
	Button,
	Checkbox,
	FormControlLabel,
	FormGroup,
	Grid2,
	IconButton,
	Input,
	Paper,
	Popper,
	Slider,
	Stack,
	Typography
} from '@mui/material';
import { MapTrifoldIcon, SquaresFourIcon } from '@phosphor-icons/react';
import { useTranslation } from 'next-i18next/pages';

import { ViewType } from '../../pages/projects';
import { StyledButton } from '../Button';
import Dropdown from '../dropdown/Dropdown';
import { SearchParams } from '../projects/projectInventory/utils';
import { styles } from './styles';

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
	onApply?: (search: SearchParams) => void;
	onClear?: () => void;
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
	onDistrictChange,
	onApply,
	onClear
}: ControlProps) => {
	const { t } = useTranslation('projectpage');

	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(anchorEl ? null : event.currentTarget);
	};

	const open = Boolean(anchorEl);
	const id = open ? 'simple-popper' : undefined;

	// Draft state holds the filter selection while the user edits it. Changes are
	// only propagated to the parent when "Apply Changes" is clicked.
	const [draft, setDraft] = React.useState<SearchParams>(search);
	const [priceRangeState, setPriceRangeState] = React.useState<number[]>(
		search.priceRange.length === 2 ? search.priceRange : priceRange
	);

	// Sync the draft whenever the applied filters change externally (e.g. URL
	// initialization or after an apply/clear), without overriding in-progress edits.
	const appliedKeyRef = React.useRef<string>('');
	const appliedKey = JSON.stringify([
		search.assignmentStatus,
		search.constructionStatus,
		search.priceRange,
		search.typologies,
		search.types
	]);

	React.useEffect(() => {
		if (appliedKeyRef.current !== appliedKey) {
			appliedKeyRef.current = appliedKey;
			setDraft(search);
			if (search.priceRange.length === 2) setPriceRangeState(search.priceRange);
		}
	}, [appliedKey, search]);

	const handleConstructionStatusChange = (
		event: React.ChangeEvent<HTMLInputElement>,
		checked: boolean
	) => {
		const name = event.target.name;
		setDraft((prev) => {
			if (name === 'all')
				return { ...prev, constructionStatus: checked ? [...constructionsStatus] : [] };
			return {
				...prev,
				constructionStatus: checked
					? [...prev.constructionStatus, name as ConstructionStatusType]
					: prev.constructionStatus.filter((value) => value !== name)
			};
		});
	};

	const handleAssignmentStatusChange = (
		event: React.ChangeEvent<HTMLInputElement>,
		checked: boolean
	) => {
		const name = event.target.name;
		setDraft((prev) => {
			if (name === 'all')
				return { ...prev, assignmentStatus: checked ? [...assignmentStatus] : [] };
			return {
				...prev,
				assignmentStatus: checked
					? [...prev.assignmentStatus, name as AssignmentStatusType]
					: prev.assignmentStatus.filter((value) => value !== name)
			};
		});
	};

	const updateTypologyGroup = (type: 'typologies' | 'types', name: string, checked: boolean) => {
		setDraft((prev) => {
			if (name === 'all')
				return {
					...prev,
					typologies: checked ? [...typologies] : [],
					types: checked ? [...types] : []
				};
			return {
				...prev,
				[type]: checked ? [...prev[type], name] : prev[type].filter((value) => value !== name)
			};
		});
	};

	const handleTypologyChange = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
		updateTypologyGroup('typologies', event.target.name, checked);
	};

	const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
		updateTypologyGroup('types', event.target.name, checked);
	};

	const handlePriceCheck = (checked: boolean) => {
		setDraft((prev) => ({ ...prev, priceRange: checked ? priceRangeState : [] }));
	};

	const handlePriceSlider = (value: number | number[]) => {
		if (value instanceof Array) {
			setPriceRangeState(value);
			setDraft((prev) => ({ ...prev, priceRange: value }));
		}
	};

	const handleApplyChanges = () => {
		onApply?.(draft);
		setAnchorEl(null);
	};

	const handleClearFilters = () => {
		setDraft((prev) => ({
			...prev,
			assignmentStatus: [],
			constructionStatus: [],
			priceRange: [],
			typologies: [],
			types: []
		}));
		setPriceRangeState(priceRange);
		onClear?.();
	};

	return (
		<Paper className={styles.container}>
			<Grid2 container spacing={2}>
				{onWildCardChange && (
					<Grid2>
						<Button size={'large'} variant={'outlined'} startIcon={<Search />} disableRipple>
							<Input
								className={styles.input}
								placeholder={t('searchPlaceholder')}
								onChange={(e) => onWildCardChange(e.target.value)}
								value={search.wildcard}
								classes={{
									root: css({
										':before': { borderBottom: '0px' },
										':hover': { borderBottom: '0px' }
									})
								}}
							/>
						</Button>
					</Grid2>
				)}
				{onViewChange && (
					<Grid2 sx={{ ml: 'auto' }}>
						<IconButton
							aria-label="map view"
							onClick={() => onViewChange('map')}
							color={view === 'map' ? 'primary' : 'default'}>
							<MapTrifoldIcon />
						</IconButton>
						<IconButton
							aria-label="card view"
							onClick={() => onViewChange('card')}
							color={view === 'card' ? 'primary' : 'default'}>
							<SquaresFourIcon />
						</IconButton>
					</Grid2>
				)}
				{onDistrictChange && (
					<Grid2>
						<Typography sx={{ mr: 1, verticalAlign: 'middle' }} component={'span'} variant="body1">
							{t('locationFilterLabel')}:{' '}
						</Typography>
						<Dropdown
							label={'District'}
							displayValue={search.district}
							options={districts}
							valueChange={onDistrictChange}
						/>
					</Grid2>
				)}
				<Grid2>
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
												checked={draft.constructionStatus.length === constructionsStatus.length}
												indeterminate={
													draft.constructionStatus.length > 0 &&
													draft.constructionStatus.length < constructionsStatus.length
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
														checked={draft.constructionStatus.includes(status)}
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
												checked={draft.assignmentStatus.length === assignmentStatus.length}
												indeterminate={
													draft.assignmentStatus.length > 0 &&
													draft.assignmentStatus.length < assignmentStatus.length
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
														checked={draft.assignmentStatus.includes(status)}
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
													draft.typologies.length === typologies.length &&
													draft.types.length === types.length
												}
												indeterminate={
													(draft.typologies.length > 0 &&
														draft.typologies.length <= typologies.length) ||
													(draft.types.length > 0 && draft.types.length <= types.length)
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
												checked={draft.typologies.includes(typology)}
											/>
										))}
									</Box>
									<Box ml={3} component={FormGroup} row>
										{types.map((type, index) => (
											<FormControlLabel
												control={<Checkbox onChange={handleTypeChange} name={type} />}
												label={type}
												key={index}
												checked={draft.types.includes(type)}
											/>
										))}
									</Box>
								</div>
								<div>
									<FormControlLabel
										control={
											<Checkbox
												name=""
												onChange={(e, checked) => handlePriceCheck(checked)}
												checked={draft.priceRange.length > 0}
											/>
										}
										label={t('projectDetails.price')}
									/>
									<Slider
										getAriaLabel={() => 'price range'}
										value={priceRangeState}
										onChange={(event, value) => handlePriceSlider(value)}
										valueLabelDisplay="auto"
										marks={[
											{ value: priceRange[0], label: priceRange[0] },
											{ value: priceRange[1], label: priceRange[1] }
										]}
										min={priceRange[0]}
										max={priceRange[1]}
									/>
								</div>
								<Stack direction="row" spacing={2} justifyContent="flex-end">
									<StyledButton
										variant="outlined"
										onClick={handleClearFilters}
										startIcon={<Close />}>
										{t('clearFilters')}
									</StyledButton>
									<StyledButton variant="contained" onClick={handleApplyChanges}>
										{t('applyChanges')}
									</StyledButton>
								</Stack>
							</Stack>
						</Paper>
					</Popper>
				</Grid2>
			</Grid2>
		</Paper>
	);
};
