import type {
	CosmosChainRegistryAssetList,
	CosmosChainRegistryChain,
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

export const getChain = ({
	chainName,
}: {
	chainName: string
}) => (
	sourceGetJson<CosmosChainRegistryChain>(
		binding,
		githubRawUrl({
			...target,
			path: `${chainName}/chain.json`,
		})
	)
)

export const getAssetList = ({
	chainName,
}: {
	chainName: string
}) => (
	sourceGetJson<CosmosChainRegistryAssetList>(
		binding,
		githubRawUrl({
			...target,
			path: `${chainName}/assetlist.json`,
		})
	)
)
