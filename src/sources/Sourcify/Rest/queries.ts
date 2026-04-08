import { sourcifyGetJsonOrNull } from '$/sources/Sourcify/Rest/client.ts'
import type {
	SourcifyContractLookupWire,
	SourcifyContractSourceMetadata,
} from '$/sources/Sourcify/Rest/types.ts'

const sourcifyContractLookupFields = 'abi,compilation,deployment,metadata,sources'

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
}): Promise<SourcifyContractLookupWire | null> => {
	const json = await sourcifyGetJsonOrNull<SourcifyContractLookupWire>({
		path: sourcifyContractLookupPath({
			chainId,
			address,
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

export const sourcifyContractAbiString = (
	wire: SourcifyContractLookupWire,
) => (
	Array.isArray(wire.abi) ?
		JSON.stringify(wire.abi)
	:	undefined
)

export const sourcifyContractSourceFiles = (
	wire: SourcifyContractLookupWire,
) => (
	Object.fromEntries(
		Object.entries(wire.sources ?? wire.metadata?.sources ?? {})
			.flatMap(([path, source]) => (
				typeof source?.content === 'string' && source.content.length > 0 ?
					[[path, source.content]]
				:
					[]
			)),
	)
)

export const sourcifyContractSourceMetadata = (
	wire: SourcifyContractLookupWire,
): SourcifyContractSourceMetadata => {
	const compiler = (
		wire.metadata?.compiler?.version
		?? wire.compilation?.compilerVersion
		?? wire.compilation?.compiler
	)
	const language = wire.metadata?.language ?? wire.compilation?.language
	const sources = wire.metadata?.sources ?? wire.sources
	const fullyQualifiedName = (
		wire.metadata?.fullyQualifiedName
		?? wire.compilation?.fullyQualifiedName
	)
	return {
		...(compiler != null && compiler !== '' ? { compiler } : {}),
		...(language != null && language !== '' ? { language } : {}),
		...(sources != null ? { sources } : {}),
		...(fullyQualifiedName != null && fullyQualifiedName !== '' ?
			{ fullyQualifiedName }
		:	{}),
	}
}

export const sourcifyContractDeployer = (
	wire: SourcifyContractLookupWire,
) => (
	wire.deployment?.deployer
)
