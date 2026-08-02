import bindings from '$/sources/Eip8004Scan/bindings.ts'
import {
	firstHttpUrlForBinding,
	sourceGetJson,
} from '$/sources/_runtime/http.ts'
import type {
	Eip8004ScanAgentDetailResponse,
	Eip8004ScanAgentsListResponse,
} from '$/sources/Eip8004Scan/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.Eip8004Scan_Rest][0]

export const fetchAgentList = (
	{
		limit = 100,
		page = 1,
	}: {
		limit?: number
		page?: number
	} = {}
) => (
	sourceGetJson<Eip8004ScanAgentsListResponse>(
		binding,
		`${firstHttpUrlForBinding(binding)}/agents?limit=${String(limit)}&page=${String(page)}`
	)
)

export const fetchAgentDetail = (
	{
		chainId,
		tokenId,
	}: {
		chainId: number
		tokenId: string
	}
) => (
	sourceGetJson<Eip8004ScanAgentDetailResponse>(
		binding,
		`${firstHttpUrlForBinding(binding)}/agents/${String(chainId)}/${encodeURIComponent(tokenId)}`
	)
)
