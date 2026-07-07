import {
	e2eNostrYouTubeOptionalDetailRoutePaths,
	VITALIK_ADDRESS,
} from '$/routes/api/e2e/assert-loaded-resolvers/_fixtures.ts'


/** Routes exercised by `route-views-smoke.e2e.ts` and boundary-settle checks. */
export const ADDR = VITALIK_ADDRESS

/** Detail routes depending on live NostrBand / YouTube / Piped payloads (not in default smoke set). */
export const routeViewSmokeOptionalDetailPathByLabel: Record<string, `/${string}`> = (
	e2eNostrYouTubeOptionalDetailRoutePaths
)

export const routeViewSmokePathByLabel: Record<string, `/${string}`> = {
	baseNetwork: '/network/eip155:1',
	evmAccount: `/network/eip155:1/account/${ADDR}`,
	polkadotPilot: '/network/polkadot/polkadot',
	zcashShieldedPool: '/network/zcash/utxo/shielded-pool/orchard',
	markets: '/markets',
} as const
