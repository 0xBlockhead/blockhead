import {
	assertCosmosChainRegistryEnvelope,
	cosmosChainRegistryAssetListWire,
	cosmosChainRegistryChainWire,
} from '$/sources/CosmosChainRegistry/Github/types.ts'
import bindings from '$/sources/CosmosChainRegistry/bindings.ts'
import {
	sourceGetJson,
} from '$/sources/_runtime/http.ts'
import {
	githubRawUrl,
	githubRepositoryTargetFromKey,
} from '$/sources/_shared/hosts/Github/Http/client.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.CosmosChainRegistry_Github][0]
const target = githubRepositoryTargetFromKey(binding.target.key)

const assertChainName = (chainName: string) => {
	if (
		chainName.length < 1
		|| chainName.length > 128
		|| chainName.includes('/')
		|| chainName.includes('\\')
		|| chainName.includes('..')
	)
		throw new Error(`CosmosChainRegistry_Github: invalid chain name ${chainName}`)
}

export const getChain = async ({
	chainName,
}: {
	chainName: string
}) => {
	assertChainName(chainName)
	const chain = assertCosmosChainRegistryEnvelope(
		cosmosChainRegistryChainWire,
		await sourceGetJson(
			binding,
			githubRawUrl({
				...target,
				path: `${chainName}/chain.json`,
			})
		),
		'chain'
	)
	if (chain.chain_name !== chainName)
		throw new Error(`CosmosChainRegistry_Github: mismatched chain_name ${chain.chain_name}`)

	return chain
}

export const getAssetList = async ({
	chainName,
}: {
	chainName: string
}) => {
	assertChainName(chainName)
	const assetList = assertCosmosChainRegistryEnvelope(
		cosmosChainRegistryAssetListWire,
		await sourceGetJson(
			binding,
			githubRawUrl({
				...target,
				path: `${chainName}/assetlist.json`,
			})
		),
		'asset list'
	)
	if (assetList.chain_name !== chainName)
		throw new Error(`CosmosChainRegistry_Github: mismatched asset list chain_name ${assetList.chain_name}`)
	if (new Set(assetList.assets.map((asset) => asset.base)).size !== assetList.assets.length)
		throw new Error('CosmosChainRegistry_Github: asset list contains duplicate base denoms')

	return assetList
}
