import type {
	CosmosChainRegistryAssetList,
	CosmosChainRegistryChain,
} from '$/sources/CosmosChainRegistry/Github/types.ts'
import bindings from '$/sources/CosmosChainRegistry/bindings.ts'
import {
	sourceGetJson,
} from '$/sources/_runtime/http.ts'
import { githubRawUrl } from '$/sources/_shared/hosts/Github/Http/client.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.CosmosChainRegistry_Github]

const cosmosChainRegistryRepo = {
	owner: 'cosmos',
	repo: 'chain-registry',
	path: '',
	ref: 'master',
}

export const getChain = ({
	chainName,
}: {
	chainName: string
}) => (
	sourceGetJson<CosmosChainRegistryChain>(
		binding,
		githubRawUrl({
			...cosmosChainRegistryRepo,
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
			...cosmosChainRegistryRepo,
			path: `${chainName}/assetlist.json`,
		})
	)
)
