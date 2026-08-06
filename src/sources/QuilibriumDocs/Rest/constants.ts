import type {
	QuilibriumDocsPage,
	QuilibriumDocsProtocolDocument,
} from '$/sources/QuilibriumDocs/Rest/types.ts'


// Constants
// Docs catalog from https://docs.quilibrium.com (official Quilibrium docs).

/** Binding / page origin — https://docs.quilibrium.com */
export const quilibriumDocsBaseUrl = 'https://docs.quilibrium.com'

/**
 * Checked-in Quilibrium protocol document index for SpecificationProposal.
 * Body/title summarize the protocol docs surface (overview + consensus), not a separate PDF host.
 * @see https://docs.quilibrium.com/docs/protocol/overview/
 * @see https://docs.quilibrium.com/docs/protocol/consensus/
 */
export const quilibriumProtocolDocuments = [
	{
		number: 1,
		documentBody: 'Quilibrium protocol whitepaper and architecture reference.',
		documentCategory: 'Protocol document',
		documentStatus: 'Published',
		documentTitle: 'Quilibrium peer-to-peer MPC platform whitepaper',
	},
] as const satisfies readonly QuilibriumDocsProtocolDocument[]

/**
 * Stable docs pages under the Quilibrium docs origin.
 * @see https://docs.quilibrium.com/docs/discover/what-is-quilibrium/
 * @see https://docs.quilibrium.com/docs/protocol/overview/
 * @see https://docs.quilibrium.com/docs/protocol/consensus/
 * @see https://docs.quilibrium.com/docs/learn/oblivious-hypergraph/
 * @see https://docs.quilibrium.com/docs/api/q-kms/overview/
 * @see https://docs.quilibrium.com/docs/api/q-storage/overview/
 * @see https://docs.quilibrium.com/docs/build/q-service-apis/
 * @see https://docs.quilibrium.com/docs/run-node/quick-start/
 * @see https://docs.quilibrium.com/docs/run-node/qclient/setup/ (public RPC `:8337`)
 */
export const quilibriumDocsPages = [
	{
		url: `${quilibriumDocsBaseUrl}/docs/discover/what-is-quilibrium/`,
		title: 'What is Quilibrium',
	},
	{
		url: `${quilibriumDocsBaseUrl}/docs/protocol/overview/`,
		title: 'Protocol overview',
	},
	{
		url: `${quilibriumDocsBaseUrl}/docs/protocol/consensus/`,
		title: 'Consensus mechanism',
	},
	{
		url: `${quilibriumDocsBaseUrl}/docs/learn/oblivious-hypergraph/`,
		title: 'Oblivious hypergraph',
	},
	{
		url: `${quilibriumDocsBaseUrl}/docs/api/q-kms/overview/`,
		title: 'QKMS overview',
	},
	{
		url: `${quilibriumDocsBaseUrl}/docs/api/q-storage/overview/`,
		title: 'QStorage overview',
	},
	{
		url: `${quilibriumDocsBaseUrl}/docs/build/q-service-apis/`,
		title: 'Q service APIs',
	},
	{
		url: `${quilibriumDocsBaseUrl}/docs/run-node/quick-start/`,
		title: 'Node quick start',
	},
	{
		url: `${quilibriumDocsBaseUrl}/docs/run-node/qclient/setup/`,
		title: 'QClient setup',
	},
] as const satisfies readonly QuilibriumDocsPage[]
