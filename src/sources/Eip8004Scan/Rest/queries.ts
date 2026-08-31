import bindings from '$/sources/Eip8004Scan/bindings.ts'
import {
	firstHttpUrlForBinding,
	sourceGetJson,
} from '$/sources/_runtime/http.ts'
import {
	eip8004ScanAgentDetailResponseWire,
	eip8004ScanAgentsListResponseWire,
	type Eip8004ScanAgentDetail,
} from '$/sources/Eip8004Scan/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.Eip8004Scan_Rest][0]

const omitUndefinedJson = (
	value: unknown
): unknown => {
	if (Array.isArray(value))
		return value.map(omitUndefinedJson)
	if (value != null && typeof value === 'object')
		return Object.fromEntries(
			Object.entries(value)
				.filter(([, entry]: [string, unknown]) => entry !== undefined)
				.map(([key, entry]) => [
					key,
					omitUndefinedJson(entry),
				])
		)
	return value
}

const assertEnvelope = <_Value>(
	label: string,
	wire: { assert: (value: unknown) => _Value },
	response: unknown
) => {
	try {
		return wire.assert(omitUndefinedJson(response))
	} catch {
		throw new Error(`Eip8004Scan_Rest: invalid ${label} response envelope`)
	}
}

export const fetchAgentList = async (
	{
		limit = 100,
		page = 1,
	}: {
		limit?: number
		page?: number
	} = {}
) => (
	assertEnvelope(
		'agent list',
		eip8004ScanAgentsListResponseWire,
		await sourceGetJson(
			binding,
			`${firstHttpUrlForBinding(binding)}/agents?limit=${String(limit)}&page=${String(page)}`
		)
	)
)

export const fetchAgentDetail = async (
	{
		chainId,
		tokenId,
	}: {
		chainId: number
		tokenId: string
	}
): Promise<Eip8004ScanAgentDetail> => (
	assertEnvelope(
		'agent detail',
		eip8004ScanAgentDetailResponseWire,
		await sourceGetJson(
			binding,
			`${firstHttpUrlForBinding(binding)}/agents/${String(chainId)}/${encodeURIComponent(tokenId)}`
		)
	).data
)
