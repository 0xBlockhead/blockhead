import {
	owner,
	rawOrigin,
	ref,
	repo,
} from '$/sources/TrustWalletAssets/Github/constants.ts'

export const getChainLogoUrl = (chain: string): string => (
	`${rawOrigin}/${owner}/${repo}/${ref}/blockchains/${encodeURIComponent(chain)}/info/logo.png`
)

export const getTokenLogoUrl = (chain: string, address: string): string => (
	`${rawOrigin}/${owner}/${repo}/${ref}/blockchains/${encodeURIComponent(chain)}/assets/${encodeURIComponent(address)}/logo.png`
)
