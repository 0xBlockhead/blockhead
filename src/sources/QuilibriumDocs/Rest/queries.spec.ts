import { describe, expect, it } from 'vitest'
import { quilibriumDocsBaseUrl } from '$/sources/QuilibriumDocs/Rest/constants.ts'
import {
	getDocsEndpoints,
	getNodeInterfaces,
	getPage,
	getPages,
	getPrimaryProtocolDocument,
	getProtocolDocument,
	getProtocolFacts,
	getServiceLayers,
	listProtocolDocuments,
} from '$/sources/QuilibriumDocs/Rest/queries.ts'

describe('QuilibriumDocs Rest queries', () => {
	it('exposes the checked-in Quilibrium documentation surface and rejects foreign networks', () => {
		const endpoints = getDocsEndpoints()

		expect(endpoints.length).toBeGreaterThan(0)
		expect(endpoints.every((endpoint) => (
			endpoint.url.startsWith('https://')
			&& endpoint.providerName === 'Quilibrium docs'
		))).toBe(true)
		expect(endpoints.some((endpoint) => endpoint.url === quilibriumDocsBaseUrl)).toBe(true)
		expect(endpoints.some((endpoint) => endpoint.url === 'https://quilibrium.com')).toBe(false)
		const interfaces = getNodeInterfaces({ networkSlug: 'quilibrium' })

		expect(interfaces.map(({ label, port }) => ({ label, port }))).toEqual([
			{ label: 'Node gRPC', port: 8337 },
			{ label: 'Node REST', port: 8338 },
		])
		expect(() => getNodeInterfaces({ networkSlug: 'ethereum' })).toThrow(
			'QuilibriumDocs_Rest: unsupported network: ethereum',
		)

		const facts = getProtocolFacts({ networkSlug: 'quilibrium' })

		expect(facts.map(({ label }) => label)).toEqual([
			'Frame cadence',
			'Consensus',
			'Execution',
			'Storage',
		])
		expect(facts.find((fact) => fact.label === 'Consensus')?.value).toBe(
			'Proof of Meaningful Work',
		)
		expect(() => getProtocolFacts({ networkSlug: 'ethereum' })).toThrow(
			'QuilibriumDocs_Rest: unsupported network: ethereum',
		)

		expect(getServiceLayers({ networkSlug: 'quilibrium' }).map(({ label }) => label)).toEqual([
			'Hypergraph',
			'QCL',
			'QKMS',
			'QStorage',
		])
		expect(() => getServiceLayers({ networkSlug: 'ethereum' })).toThrow(
			'QuilibriumDocs_Rest: unsupported network: ethereum',
		)
	})

	it('selects the published protocol document and rejects unknown numbers', () => {
		expect(listProtocolDocuments()).toEqual([
			{
				number: 1,
				documentBody: 'Official Quilibrium protocol documentation covering the protocol overview and consensus mechanism.',
				documentCategory: 'Protocol document',
				documentStatus: 'Published',
				documentTitle: 'Quilibrium protocol documentation',
			},
		])
		expect(getProtocolDocument({ number: 1 }).documentTitle).toBe(
			'Quilibrium protocol documentation',
		)
		expect(getPrimaryProtocolDocument().number).toBe(1)
		expect(() => getProtocolDocument({ number: 99 })).toThrow(
			'QuilibriumDocs_Rest: document not found 99',
		)
	})

	it('lists only known pages under the documentation origin', () => {
		expect(getPages.length).toBeGreaterThan(0)
		expect(getPages.every((page) => page.url.startsWith(`${quilibriumDocsBaseUrl}/`))).toBe(true)
		expect(getPages.some((page) => page.url.includes('/docs/protocol/consensus/'))).toBe(true)
		expect(getPages.some((page) => page.url.includes('/docs/api/q-kms/overview/'))).toBe(true)
		expect(getPages.some((page) => page.url.includes('/docs/run-node/qclient/setup/'))).toBe(true)
		expect(() => getPage({ url: 'https://quilibrium.com/' })).toThrow(
			'QuilibriumDocs_Rest: url outside docs origin: https://quilibrium.com/',
		)
		expect(() => getPage({ url: `${quilibriumDocsBaseUrl}/docs/unknown/` })).toThrow(
			`QuilibriumDocs_Rest: unknown docs page: ${quilibriumDocsBaseUrl}/docs/unknown/`,
		)
	})
})
