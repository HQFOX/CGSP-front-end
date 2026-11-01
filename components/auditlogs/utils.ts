import { SortingState } from '@tanstack/react-table';

import { getGetAuditLogsUrl } from '../../api/audit-log-controller/audit-log-controller';
import { customFetch } from '../../api/custom-fetch';
import { AuditLogDTOOutcome, GetAuditLogsParams, PageAuditLogDTO } from '../../api/model';

export const AUDIT_LOGS_PAGE_SIZE = 25;

export type AuditLogFilters = {
	actor: string;
	action: string;
	entityType: string;
	entityId: string;
	outcome: AuditLogDTOOutcome | '';
	// datetime-local input values, interpreted in the browser's timezone
	from: string;
	to: string;
};

export const EMPTY_AUDIT_LOG_FILTERS: AuditLogFilters = {
	actor: '',
	action: '',
	entityType: '',
	entityId: '',
	outcome: '',
	from: '',
	to: ''
};

// Values recorded by the back-end @Audited annotations
export const AUDIT_ACTION_LABELS: Record<string, string> = {
	USER_CREATE: 'Criar utilizador',
	PROJECT_CREATE: 'Criar projeto',
	PROJECT_UPDATE: 'Editar projeto',
	PROJECT_DELETE: 'Apagar projeto',
	PROJECT_PRIORITY_UPDATE: 'Atualizar prioridades',
	ENROLL_REQUEST_UPDATE: 'Editar pedido de inscrição',
	ENROLL_REQUEST_DELETE: 'Apagar pedido de inscrição',
	ENROLL_REQUEST_STATUS_UPDATE: 'Alterar estado de inscrição',
	FILE_UPLOAD_URL_CREATE: 'Carregar ficheiro',
	UPDATE_CREATE: 'Criar atualização',
	UPDATE_EDIT: 'Editar atualização',
	UPDATE_DELETE: 'Apagar atualização'
};

export const AUDIT_ENTITY_TYPE_LABELS: Record<string, string> = {
	User: 'Utilizador',
	Project: 'Projeto',
	EnrollRequest: 'Pedido de Inscrição',
	File: 'Ficheiro',
	Update: 'Atualização'
};

export const AUDIT_OUTCOME_LABELS: Record<AuditLogDTOOutcome, string> = {
	SUCCESS: 'Sucesso',
	FAILURE: 'Falha',
	DENIED: 'Negado'
};

const toIsoString = (value: string) => {
	const date = new Date(value);
	return isNaN(date.getTime()) ? undefined : date.toISOString();
};

// Only defined values are set, so blank filters don't reach the API
export const toAuditLogsParams = (
	filters: AuditLogFilters,
	sorting: SortingState,
	pageIndex: number,
	pageSize: number
): GetAuditLogsParams => {
	const params: GetAuditLogsParams = { page: pageIndex, size: pageSize };
	if (filters.actor.trim()) params.actor = filters.actor.trim();
	if (filters.action) params.action = filters.action;
	if (filters.entityType) params.entityType = filters.entityType;
	if (filters.entityId.trim()) params.entityId = filters.entityId.trim();
	if (filters.outcome) params.outcome = filters.outcome;
	if (filters.from) params.from = toIsoString(filters.from);
	if (filters.to) params.to = toIsoString(filters.to);
	if (sorting.length > 0)
		params.sort = sorting.map(({ id, desc }) => `${id},${desc ? 'desc' : 'asc'}`);
	return params;
};

// The orval client never passes customFetch's auth flag, and this endpoint requires an admin token
export const fetchAuditLogsPage = (
	params: GetAuditLogsParams,
	options?: RequestInit
): Promise<PageAuditLogDTO> =>
	customFetch<PageAuditLogDTO>(getGetAuditLogsUrl(params), { ...options, method: 'GET' }, true);
