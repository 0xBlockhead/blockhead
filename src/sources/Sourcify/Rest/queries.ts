import { zeroExLowerCase } from '$/lib/hexLowerOfByteSize.ts'
import { sourcifyGetJsonOrNull } from '$/sources/Sourcify/Rest/client.ts'
import type { SourcifyContractLookup } from '$/sources/Sourcify/Rest/types.ts'

const sourcifyContractLookupFields = 'abi,compilation,deployment,metadata,sources,storageLayout,proxyResolution'

export const sourcifyContractLookupPath = ({
	chainId,
	address,
}: {
	chainId: number
	address: `0x${string}`
}) => (
	`/contract/${chainId}/${address}?${new URLSearchParams({ fields: sourcifyContractLookupFields })}`
)

export const getSourcifyContractLookup = async ({
	chainId,
	address,
}: {
	chainId: number
	address: `0x${string}`
}): Promise<SourcifyContractLookup | null> => {
	const json = await sourcifyGetJsonOrNull<SourcifyContractLookup>({
		path: sourcifyContractLookupPath({
			chainId,
			address: zeroExLowerCase(address),
		}),
	})
	if (
		json == null
		|| (
			json.match == null
			&& json.creationMatch == null
			&& json.runtimeMatch == null
		)
	) return null
	return json
}
