import type { ResolverContext } from '$/resolvers/$resolvers.ts'
import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import { defineResolver } from '$/resolvers/defineResolver.ts'
import type { RegisteredSourceResolverModule } from '$/resolvers/defineResolver.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import type {
	TallyGovernor,
	TallyProposal,
} from '$/sources/Tally/Graphql/types.ts'
import { Source } from '$/sources/Source.ts'


const zeroExAddress = (
	value: string
): `0x${string}` => (
	`0x${value.slice(2).toLowerCase()}`
)

const parseAccountId = (
	accountId: string
) => {
	const match = /^eip155:(0|[1-9][0-9]*):(0x[0-9a-fA-F]{40})$/.exec(accountId)
	if (match == null)
		throw new Error('Tally: AccountID is not an EVM CAIP-10 id')

	return {
		chainId: match[1],
		address: zeroExAddress(match[2]),
	}
}

const evmNetworkSelector = (
	chainId: string
) => ({
	caip2: {
		namespace: 'eip155' as const,
		reference: chainId,
	},
})

const evmContractFromAccountId = (
	accountId: string
) => {
	const {
		chainId,
		address,
	} = parseAccountId(accountId)

	return {
		[EntityMetaKey.Selector]: {
			$network: evmNetworkSelector(chainId),
			address,
		},
	}
}

const governorSelector = (
	governorId: string
) => ({
	governorId,
})

const proposalSelector = (
	proposalId: string
) => ({
	proposalId,
})

const timestampMsFromWire = (
	value: string | null | undefined
) => {
	if (value == null || value === '')
		return undefined
	if (!/^(0|[1-9][0-9]*)$/.test(value))
		throw new Error('Tally: invalid block timestamp')
	return Number(value) * 1000
}

export const tallyGovernorFields = (
	governor: TallyGovernor
) => {
	const {
		chainId,
		address,
	} = parseAccountId(governor.id)
	const $network = evmNetworkSelector(chainId)

	return {
		[EntityMetaKey.Selector]: governorSelector(governor.id),
		governorId: governor.id,
		...(governor.name != null && {
			name: governor.name,
		}),
		...(governor.slug != null && {
			slug: governor.slug,
		}),
		...(governor.type != null && {
			governorType: governor.type,
		}),
		...(governor.kind != null && {
			kind: governor.kind,
		}),
		$network: {
			[EntityMetaKey.Selector]: $network,
		},
		$contract: {
			[EntityMetaKey.Selector]: {
				$network,
				address,
			},
		},
		...(governor.timelockId != null && {
			$timelock: evmContractFromAccountId(governor.timelockId),
		}),
		...(governor.tokenId != null && {
			tokenId: governor.tokenId,
		}),
		...(governor.organization != null && {
			organizationId: String(governor.organization.id),
			...(governor.organization.name != null && {
				organizationName: governor.organization.name,
			}),
			...(governor.organization.slug != null && {
				organizationSlug: governor.organization.slug,
			}),
		}),
		...(governor.proposalStats != null && {
			proposalStats: governor.proposalStats,
		}),
		...(governor.parameters != null && {
			parameters: governor.parameters,
		}),
		...(governor.quorum != null && {
			quorum: governor.quorum,
		}),
		...(governor.delegatesCount != null && {
			delegatesCount: governor.delegatesCount,
		}),
		...(governor.delegatesVotesCount != null && {
			delegatesVotesCount: governor.delegatesVotesCount,
		}),
		...(governor.tokenOwnersCount != null && {
			tokenOwnersCount: governor.tokenOwnersCount,
		}),
		...(governor.metadata?.description != null && {
			description: governor.metadata.description,
		}),
		...(governor.isPrimary != null && {
			isPrimary: governor.isPrimary,
		}),
	}
}

export const tallyProposalFields = (
	proposal: TallyProposal
) => {
	const chainId = /^eip155:(0|[1-9][0-9]*)$/.exec(proposal.chainId)?.[1]
	if (chainId == null)
		throw new Error('Tally: proposal chain is not an EVM CAIP-2 id')

	const startAtMs = timestampMsFromWire(proposal.start?.timestamp)
	const endAtMs = timestampMsFromWire(proposal.end?.timestamp)

	return {
		[EntityMetaKey.Selector]: proposalSelector(proposal.id),
		proposalId: String(proposal.id),
		...(proposal.onchainId != null && {
			onchainId: proposal.onchainId,
		}),
		status: proposal.status,
		$network: {
			[EntityMetaKey.Selector]: evmNetworkSelector(chainId),
		},
		$governor: {
			[EntityMetaKey.Selector]: governorSelector(proposal.governor.id),
		},
		$governorContract: evmContractFromAccountId(proposal.governor.id),
		...(proposal.organization != null && {
			organizationId: String(proposal.organization.id),
			...(proposal.organization.name != null && {
				organizationName: proposal.organization.name,
			}),
			...(proposal.organization.slug != null && {
				organizationSlug: proposal.organization.slug,
			}),
		}),
		...(proposal.metadata != null && {
			title: proposal.metadata.title,
			description: proposal.metadata.description,
			...(proposal.metadata.eta != null && {
				etaMs: proposal.metadata.eta * 1000,
			}),
			...(proposal.metadata.ipfsHash != null && {
				ipfsHash: proposal.metadata.ipfsHash,
			}),
			...(proposal.metadata.txHash != null && {
				txHash: `0x${proposal.metadata.txHash.slice(2).toLowerCase()}`,
			}),
			...(proposal.metadata.discourseURL != null && {
				discourseUrl: proposal.metadata.discourseURL,
			}),
			...(proposal.metadata.snapshotURL != null && {
				snapshotUrl: proposal.metadata.snapshotURL,
			}),
		}),
		...(proposal.proposer != null && {
			$proposer: {
				[EntityMetaKey.Selector]: {
					$network: evmNetworkSelector(chainId),
					$actor: {
						address: zeroExAddress(proposal.proposer.address),
					},
				},
			},
			...(proposal.proposer.ens != null && {
				proposerEns: proposal.proposer.ens,
			}),
			...(proposal.proposer.name != null && {
				proposerName: proposal.proposer.name,
			}),
		}),
		...(proposal.quorum != null && {
			quorum: proposal.quorum,
		}),
		...(proposal.voteStats != null && {
			voteStats: proposal.voteStats,
		}),
		...(startAtMs != null && {
			startAtMs,
		}),
		...(endAtMs != null && {
			endAtMs,
		}),
	}
}

export const resolveTallyGovernor = async ({
	governorId,
}: {
	governorId: string
}) => {
	const { getGovernor } = await import('$/sources/Tally/Graphql/queries.ts')
	return tallyGovernorFields(await getGovernor({
		governorId,
	}))
}

export const resolveTallyGovernors = async ({
	organizationId,
}: {
	organizationId: string
},
	context: ResolverContext
) => {
	const { getGovernorsPage } = await import('$/sources/Tally/Graphql/queries.ts')
	const page = await getGovernorsPage({
		organizationId,
		limit: Math.min(resolverContextRowLimit(context), 20),
	})
	return page.nodes.map((governor) => ({
		[EntityMetaKey.Selector]: governorSelector(governor.id),
	}))
}

export const resolveTallyProposal = async ({
	proposalId,
}: {
	proposalId: string
}) => {
	const { getProposal } = await import('$/sources/Tally/Graphql/queries.ts')
	return tallyProposalFields(await getProposal({
		proposalId,
	}))
}

export const resolveTallyProposals = async ({
	governorId,
}: {
	governorId: string
},
	context: ResolverContext
) => {
	const { getProposalsPage } = await import('$/sources/Tally/Graphql/queries.ts')
	const page = await getProposalsPage({
		governorId,
		limit: Math.min(resolverContextRowLimit(context), 20),
		afterCursor: context.providerContinuationToken,
	})
	return {
		rows: page.nodes.map((proposal) => ({
			[EntityMetaKey.Selector]: proposalSelector(proposal.id),
		})),
		nextCursor: page.pageInfo.lastCursor,
	}
}

export default {
	source: Source.Tally,
	resolvers: [
		defineResolver({
			entityType: EntityType.TallyGovernor,
			resolve: {
				GovernorId: {
					resolve: async ({ governorId }) => (
						resolveTallyGovernor({
							governorId,
						})
					),
				},
			},
		})({
			governorId: (governor) => governor.governorId,
			name: (governor) => governor.name,
			slug: (governor) => governor.slug,
			governorType: (governor) => governor.governorType,
			kind: (governor) => governor.kind,
			$network: (governor) => governor.$network,
			$contract: (governor) => governor.$contract,
			organizationId: (governor) => governor.organizationId,
			organizationName: (governor) => governor.organizationName,
			organizationSlug: (governor) => governor.organizationSlug,
			quorum: (governor) => governor.quorum,
			delegatesCount: (governor) => governor.delegatesCount,
			description: (governor) => governor.description,
			isPrimary: (governor) => governor.isPrimary,
		}),

		defineResolver({
			entityType: EntityType.TallyGovernor,
			resolve: {
				GovernorId: {
					resolve: async ({ governorId }, context) => (
						resolveTallyProposals({
							governorId,
						}, context)
					),
				},
			},
		})({
			$$proposals: {
				select: (snapshot) => snapshot.rows,
				continuation: (snapshot) => (
					snapshot.nextCursor == null ?
						{
							operation: 'proposals',
							target: 'tally-api',
							terminal: true,
						}
					:
						{
							operation: 'proposals',
							target: 'tally-api',
							terminal: false,
							token: snapshot.nextCursor,
						}
				),
			},
		}),

		defineResolver({
			entityType: EntityType.TallyProposal,
			resolve: {
				ProposalId: {
					resolve: async ({ proposalId }) => (
						resolveTallyProposal({
							proposalId,
						})
					),
				},
			},
		})({
			proposalId: (proposal) => proposal.proposalId,
			onchainId: (proposal) => proposal.onchainId,
			status: (proposal) => proposal.status,
			$governor: (proposal) => proposal.$governor,
			$network: (proposal) => proposal.$network,
			$proposer: (proposal) => proposal.$proposer,
			title: (proposal) => proposal.title,
			description: (proposal) => proposal.description,
			organizationName: (proposal) => proposal.organizationName,
			quorum: (proposal) => proposal.quorum,
			voteStats: (proposal) => proposal.voteStats,
			startAtMs: (proposal) => proposal.startAtMs,
			endAtMs: (proposal) => proposal.endAtMs,
			discourseUrl: (proposal) => proposal.discourseUrl,
			snapshotUrl: (proposal) => proposal.snapshotUrl,
		}),
	],
} satisfies RegisteredSourceResolverModule
