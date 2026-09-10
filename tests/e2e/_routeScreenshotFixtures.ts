import { activityPubNetworkSeedActors } from '../../src/constants/Social/ActivityPub.ts'
import { atprotoNetworkSeedActors } from '../../src/constants/Social/Atproto.ts'

import type { E2eDomQualityProbeOverlay } from './_routeParamFixtures.ts'


/** Dedicated representative data for social-family screenshot probes. */
export const e2eSocialScreenshotFixtures = {
	activityPubActors: {
		pathname: '/activitypub/actors',
		fixture: activityPubNetworkSeedActors,
		overlay: {
			routeTitle: 'ActivityPub actors',
			minEntityRows: activityPubNetworkSeedActors.length,
			minLinks: activityPubNetworkSeedActors.length,
		},
	},
	atprotoAccounts: {
		pathname: '/atproto/actors',
		fixture: atprotoNetworkSeedActors,
		overlay: {
			routeTitle: 'AT Protocol accounts',
			minEntityRows: atprotoNetworkSeedActors.length,
			minLinks: atprotoNetworkSeedActors.length,
		},
	},
} as const satisfies Readonly<Record<string, {
	pathname: string
	fixture: readonly unknown[]
	overlay: E2eDomQualityProbeOverlay
}>>

export const e2eSocialScreenshotOverlays: Readonly<Record<string, E2eDomQualityProbeOverlay>> = Object.fromEntries(
	Object.values(e2eSocialScreenshotFixtures).map(({ pathname, overlay }) => [pathname, overlay]),
)
