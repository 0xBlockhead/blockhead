import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import { getJson } from '$/lib/http.ts'
import Eip8004Scan from '$/sources/Eip8004Scan/index.ts'
import { eip8004ScanPublicBase } from '$/sources/Eip8004Scan/Rest/constants.ts'
import type {
	Eip8004ScanAgentDetailResponse,
	Eip8004ScanAgentsListResponse,
	NormalizedEip8004ScanAgentDetail,
	NormalizedEip8004ScanAgent,
} from '$/sources/Eip8004Scan/Rest/types.ts'

const contractAddressFromWire = (
	value: string | null | undefined
): `0x${string}` | undefined => (
	hexLowerOfByteSize(value ?? '', 20)
)

const listRowFromWire = (
	row: Eip8004ScanAgentsListResponse['data'] extends (infer Item)[] | undefined ?
		Item
	:
		never
): NormalizedEip8004ScanAgent | undefined => {
	const chainId = row.chain_id
	const tokenId = String(row.token_id).trim()
	const contractAddress = contractAddressFromWire(row.contract_address)
	const agentWallet = contractAddressFromWire(row.agent_wallet)
	const ownerAddress = contractAddressFromWire(row.owner_address)
	if (
		tokenId === ''
		|| contractAddress == null
	) {
		return undefined
	}
	return {
		chainId,
		tokenId,
		contractAddress,
		...(row.agent_id != null && row.agent_id !== '' && { agentId: row.agent_id }),
		...(agentWallet != null && { agentWallet }),
		...(ownerAddress != null && { ownerAddress }),
	}
}

const contactEndpointFromDetail = (
	row: NonNullable<Eip8004ScanAgentDetailResponse['data']>
): string | undefined => (
	Object.values(row.services ?? {})
		.map((service) => service.endpoint?.trim())
		.find((endpoint) => endpoint != null && endpoint !== '')
)

const agentUriFromDetail = (
	row: NonNullable<Eip8004ScanAgentDetailResponse['data']>
): string | undefined => {
	const offchainUri = row.raw_metadata?.offchain_uri?.trim()
	if (offchainUri != null && offchainUri !== '') {
		return offchainUri
	}
	const serviceEndpoint = (
		Object.values(row.services ?? {})
			.map((service) => service.endpoint?.trim())
			.find((endpoint) => endpoint != null && endpoint !== '')
	)
	if (serviceEndpoint != null) {
		return serviceEndpoint
	}
	return undefined
}

export const fetchAgentList = async ({
	limit = 100,
	page = 1,
}: {
	limit?: number
	page?: number
} = {}): Promise<NormalizedEip8004ScanAgent[]> => {
	const url = `${eip8004ScanPublicBase}/agents?limit=${String(limit)}&page=${String(page)}`
	const wire = await getJson<Eip8004ScanAgentsListResponse>(url, {
		origins: Eip8004Scan.origins,
	})
	const rows = wire.data ?? []
	return (
		rows
			.map((row) => listRowFromWire(row))
			.filter((row): row is NormalizedEip8004ScanAgent => row != null)
	)
}

export const fetchAgentDetail = async ({
	chainId,
	tokenId,
}: {
	chainId: number
	tokenId: string
}): Promise<NormalizedEip8004ScanAgentDetail | undefined> => {
	const url = `${eip8004ScanPublicBase}/agents/${String(chainId)}/${encodeURIComponent(tokenId)}`
	const wire = await getJson<Eip8004ScanAgentDetailResponse>(url, {
		origins: Eip8004Scan.origins,
	})
	const row = wire.data
	if (row == null) {
		return undefined
	}
	const listRow = listRowFromWire(row)
	const agentUri = agentUriFromDetail(row)
	if (listRow == null || agentUri == null) {
		return undefined
	}
	return {
		...listRow,
		agentUri,
		fetchedAt: Date.now(),
		...(row.name != null && row.name !== '' && { name: row.name }),
		...(row.description != null && row.description !== '' && { description: row.description }),
		...(row.image_url != null && row.image_url !== '' && { image: row.image_url }),
		...(row.raw_metadata?.offchain_content?.type != null && {
			registrationTypeIri: row.raw_metadata.offchain_content.type,
		}),
		...(row.x402_supported != null && { x402Support: row.x402_supported }),
		...(row.is_active != null && { active: row.is_active }),
		...(row.supported_trust_models != null && row.supported_trust_models.length > 0 && {
			supportedTrust: row.supported_trust_models,
		}),
		...((contactEndpoint) => (
			contactEndpoint != null ?
				{ contactEndpoint }
			:
				{}
		))(contactEndpointFromDetail(row)),
	}
}
