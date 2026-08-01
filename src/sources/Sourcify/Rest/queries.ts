import { zeroExLowerCase } from '$/lib/hexLowerOfByteSize.ts'
import { sourcifyGetJsonOrNull } from '$/sources/Sourcify/Rest/client.ts'
import type { SourcifyContractLookup } from '$/sources/Sourcify/Rest/types.ts'

const sourcifyContractLookupFields = 'abi,compilation,deployment,metadata,sources,storageLayout,proxyResolution'

export const getContractLookupPath = ({
	chainId,
	address,
}: {
	chainId: number
	address: `0x${string}`
}) => (
	`/contract/${chainId}/${address}?${new URLSearchParams({ fields: sourcifyContractLookupFields })}`
)

export const getContractLookup = async ({
	chainId,
	address,
}: {
	chainId: number
	address: `0x${string}`
}) => {
	const json = await sourcifyGetJsonOrNull<SourcifyContractLookup>({
		path: getContractLookupPath({
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
