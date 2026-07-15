import { getJson } from '$/lib/http.ts'
import type {
	CosmosChainRegistryAssetList,
	CosmosChainRegistryChain,
} from '$/sources/CosmosChainRegistry/Github/types.ts'
import { githubRawUrl } from '$/sources/_shared/hosts/Github/Http/client.ts'
import { githubHttpEndpoints } from '$/sources/_shared/hosts/Github/Http/constants.ts'

const origins = githubHttpEndpoints.map((endpoint) => ({
	origin: endpoint.origin,
	corsEnabled: endpoint.corsEnabled,
}))

const cosmosChainRegistryRepo = {
	owner: 'cosmos',
	repo: 'chain-registry',
	path: '',
	ref: 'master',
} as const

export const getChain = ({ chainName }: { chainName: string }) => (
	getJson<CosmosChainRegistryChain>(
		githubRawUrl({
			...cosmosChainRegistryRepo,
			path: `${chainName}/chain.json`,
		}),
		{ origins }
	)
)

export const getAssetList = ({ chainName }: { chainName: string }) => (
	getJson<CosmosChainRegistryAssetList>(
		githubRawUrl({
			...cosmosChainRegistryRepo,
			path: `${chainName}/assetlist.json`,
		}),
		{ origins }
	)
)
