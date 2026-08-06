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
	it('exposes binding-backed docs endpoints', () => {
		const endpoints = getDocsEndpoints()

		expect(endpoints.length).toBeGreaterThan(0)
		expect(endpoints.every((endpoint) => (
			endpoint.url.startsWith('https://')
			&& endpoint.providerName === 'Quilibrium docs'
		))).toBe(true)
		expect(endpoints.some((endpoint) => endpoint.url === quilibriumDocsBaseUrl)).toBe(true)
	})

	it('returns checked-in node interfaces only for quilibrium', () => {
		const interfaces = getNodeInterfaces({ networkSlug: 'quilibrium' })

		expect(interfaces.map(({ label, port }) => ({ label, port }))).toEqual([
			{ label: 'Node gRPC', port: 8337 },
			{ label: 'Node REST', port: 8338 },
		])
	})

	it('rejects unsupported networks before returning node interfaces', () => {
		expect(() => getNodeInterfaces({ networkSlug: 'ethereum' })).toThrow(
			'QuilibriumDocs_Rest: unsupported network: ethereum',
		)
	})

	it('returns checked-in protocol facts for quilibrium', () => {
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
	})

	it('rejects unsupported networks before returning protocol facts', () => {
		expect(() => getProtocolFacts({ networkSlug: 'ethereum' })).toThrow(
			'QuilibriumDocs_Rest: unsupported network: ethereum',
		)
	})

	it('returns checked-in service layers for quilibrium', () => {
		expect(getServiceLayers({ networkSlug: 'quilibrium' }).map(({ label }) => label)).toEqual([
			'Hypergraph',
			'QCL',
			'QKMS',
			'QStorage',
		])
	})

	it('rejects unsupported networks before returning service layers', () => {
		expect(() => getServiceLayers({ networkSlug: 'ethereum' })).toThrow(
			'QuilibriumDocs_Rest: unsupported network: ethereum',
		)
	})

	it('lists the published protocol document', () => {
		expect(listProtocolDocuments()).toEqual([
			{
				number: 1,
				documentBody: 'Quilibrium protocol whitepaper and architecture reference.',
				documentCategory: 'Protocol document',
				documentStatus: 'Published',
				documentTitle: 'Quilibrium peer-to-peer MPC platform whitepaper',
			},
		])
		expect(getProtocolDocument({ number: 1 }).documentTitle).toBe(
			'Quilibrium peer-to-peer MPC platform whitepaper',
		)
		expect(getPrimaryProtocolDocument().number).toBe(1)
	})

	it('rejects unknown protocol document numbers', () => {
		expect(() => getProtocolDocument({ number: 99 })).toThrow(
			'QuilibriumDocs_Rest: document not found 99',
		)
	})

	it('lists docs pages under the Quilibrium docs origin', () => {
		expect(getPages.length).toBeGreaterThan(0)
		expect(getPages.every((page) => page.url.startsWith(`${quilibriumDocsBaseUrl}/`))).toBe(true)
		expect(getPages.some((page) => page.url.includes('/docs/protocol/consensus/'))).toBe(true)
		expect(getPages.some((page) => page.url.includes('/docs/api/q-kms/overview/'))).toBe(true)
		expect(getPages.some((page) => page.url.includes('/docs/run-node/qclient/setup/'))).toBe(true)
	})

	it('rejects page fetches outside the docs origin', () => {
		expect(() => getPage({ url: 'https://quilibrium.com/' })).toThrow(
			'QuilibriumDocs_Rest: url outside docs origin: https://quilibrium.com/',
		)
	})

	it('rejects unknown docs pages under the docs origin', () => {
		expect(() => getPage({ url: `${quilibriumDocsBaseUrl}/docs/unknown/` })).toThrow(
			`QuilibriumDocs_Rest: unknown docs page: ${quilibriumDocsBaseUrl}/docs/unknown/`,
		)
	})
})
