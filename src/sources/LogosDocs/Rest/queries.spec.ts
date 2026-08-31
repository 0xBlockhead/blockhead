import { describe, expect, it } from 'vitest'
import {
	getNetworkSummary,
	getPages,
	getZoneSummary,
} from '$/sources/LogosDocs/Rest/queries.ts'

describe('LogosDocs Rest queries', () => {
	it('exposes fail-closed network summary primary components', () => {
		const summary = getNetworkSummary({ networkSlug: 'logos-testnet' })

		expect(summary.chainFramework).toBe('Substrate')
		expect(summary.networkRole).toBe('sub0layer')
		expect([...summary.primaryComponents]).toEqual([
			'DVCI',
			'Logos Chain',
			'Network Gatekeeper',
			'W3bI',
		])
	})

	it('rejects unsupported networks before returning a summary', () => {
		expect(() => getNetworkSummary({ networkSlug: 'ethereum' })).toThrow(
			'LogosDocs_Rest: unsupported network: ethereum'
		)
	})

	it('maps every documented zone to its closed summary kind', () => {
		expect(getZoneSummary({ networkSlug: 'logos-testnet', zoneId: 'DVCI' }).zoneKind).toBe(
			'distributed-virtual-computing-infrastructure'
		)
		expect(getZoneSummary({ networkSlug: 'logos-testnet', zoneId: 'Logos Chain' }).zoneKind).toBe(
			'blockchain'
		)
		expect(getZoneSummary({ networkSlug: 'logos-testnet', zoneId: 'Network Gatekeeper' }).zoneKind).toBe(
			'access-control'
		)
		expect(getZoneSummary({ networkSlug: 'logos-testnet', zoneId: 'W3bI' }).zoneKind).toBe(
			'computation-distribution-regulator'
		)
	})

	it('rejects unsupported zones instead of returning a soft empty summary', () => {
		expect(() => getZoneSummary({ networkSlug: 'logos-testnet', zoneId: 'unknown' })).toThrow(
			'LogosDocs_Rest: unsupported zone: unknown'
		)
	})

	it('lists docs pages under the Logos docs origin', () => {
		expect(getPages.length).toBeGreaterThan(0)
		expect(getPages.every((page) => page.url.startsWith('https://docs.logoslabs.io/'))).toBe(true)
	})
})
