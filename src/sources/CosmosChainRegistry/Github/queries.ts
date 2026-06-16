import { getJson } from '$/lib/http.ts'
import CosmosChainRegistry from '$/sources/CosmosChainRegistry/index.ts'
import { getRawUserContentUrl } from '$/sources/Github/Rest/queries.ts'
import type {
	CosmosChainRegistryAssetList,
	CosmosChainRegistryChain,
} from '$/sources/CosmosChainRegistry/Github/types.ts'

const owner = 'cosmos'
const repo = 'chain-registry'
const ref = 'master'

export const getChain = ({ chainName }: { chainName: string }) => (
	getJson<CosmosChainRegistryChain>(
		getRawUserContentUrl({
			owner,
			repo,
			ref,
			pathInRepo: `${chainName}/chain.json`,
		}),
		{ origins: CosmosChainRegistry.origins  }
	)
)

export const getAssetList = ({ chainName }: { chainName: string }) => (
	getJson<CosmosChainRegistryAssetList>(
		getRawUserContentUrl({
			owner,
			repo,
			ref,
			pathInRepo: `${chainName}/assetlist.json`,
		}),
		{ origins: CosmosChainRegistry.origins  }
	)
)
