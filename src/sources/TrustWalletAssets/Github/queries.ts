import bindings from '$/sources/TrustWalletAssets/bindings.ts'
import {
	githubRawUrl,
	githubRepositoryTargetFromKey,
} from '$/sources/_shared/hosts/Github/Http/client.ts'
import { Source } from '$/sources/Source.ts'

const target = githubRepositoryTargetFromKey(bindings[Source.TrustWalletAssets_Github][0].target.key)

export const getChainLogoUrl = (chain: string) => (
	githubRawUrl({
		...target,
		path: `${target.path}/${encodeURIComponent(chain)}/info/logo.png`,
	})
)

export const getTokenLogoUrl = (chain: string, address: string) => (
	githubRawUrl({
		...target,
		path: `${target.path}/${encodeURIComponent(chain)}/assets/${encodeURIComponent(address)}/logo.png`,
	})
)
