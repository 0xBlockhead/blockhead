import { describe, expect, it } from 'vitest'
import { networkBySlug } from '$/constants/Network.ts'
import {
	ProposalCategory,
	SpecificationRealm,
} from '$/constants/SpecificationProposal.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'

const { default: quilibriumDocs } = await import('$/resolvers/QuilibriumDocs-Rest.ts')

const proposalResolver = quilibriumDocs.resolvers[0]
const networkResolver = quilibriumDocs.resolvers[2]

describe('QuilibriumDocs-Rest', () => {
	it('resolves the published protocol document through Rest queries', async () => {
		await expect(
			proposalResolver.resolve.RealmCategoryNumber.resolve({
				realm: SpecificationRealm.Quilibrium,
				category: ProposalCategory.ProtocolDocument,
				number: 1,
			})
		).resolves.toMatchObject({
			documentCategory: 'Protocol document',
			documentStatus: 'Published',
			documentTitle: 'Quilibrium protocol documentation',
		})
	})

	it('rejects unknown protocol documents', async () => {
		await expect(
			proposalResolver.resolve.RealmCategoryNumber.resolve({
				realm: SpecificationRealm.Quilibrium,
				category: ProposalCategory.ProtocolDocument,
				number: 99,
			})
		).rejects.toThrow('QuilibriumDocs_Rest: document not found 99')
	})

	it('rejects a protocol network outside the resolver applicability slice', async () => {
		await expect(
			networkResolver.resolve.Slug.resolve({ slug: 'bitcoin' })
		).rejects.toThrow('QuilibriumDocs_Rest: unsupported network: bitcoin')
	})

	it('resolves Network Quilibrium facet rows from Rest queries', async () => {
		const snapshot = await networkResolver.resolve.Slug.resolve({
			slug: networkBySlug.quilibrium.slug,
		})

		expect(snapshot.docsEndpoints.some((endpoint: { url: string }) => (
			endpoint.url === 'https://docs.quilibrium.com'
		))).toBe(true)
		expect(snapshot.nodeInterfaces.map(({ label, port }: { label: string, port: number }) => ({
			label,
			port,
		}))).toEqual([
			{ label: 'Node gRPC', port: 8337 },
			{ label: 'Node REST', port: 8338 },
		])
		expect(snapshot.protocolFacts.map(({ label }: { label: string }) => label)).toEqual([
			'Frame cadence',
			'Consensus',
			'Execution',
			'Storage',
		])
		expect(snapshot.serviceLayers.map(({ label }: { label: string }) => label)).toEqual([
			'Hypergraph',
			'QCL',
			'QKMS',
			'QStorage',
		])
		expect(networkResolver.projections.Quilibrium.$protocolDocument(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				realm: SpecificationRealm.Quilibrium,
				category: ProposalCategory.ProtocolDocument,
				number: 1,
			},
		})
	})
})
