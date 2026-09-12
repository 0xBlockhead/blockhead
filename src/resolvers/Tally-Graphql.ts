import type { ResolverContext } from '$/resolvers/$resolvers.ts'
import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import { defineResolver } from '$/resolvers/defineResolver.ts'
import type { RegisteredSourceResolverModule } from '$/resolvers/defineResolver.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import type {
	TallyGovernor,
	TallyProposal,
	TallyProposalExecutableCall,
} from '$/sources/Tally/Graphql/types.ts'
import { Source } from '$/sources/Source.ts'


const zeroExHex = (
	value: string
): `0x${string}` => (
	`0x${value.slice(2).toLowerCase()}`
)

const zeroExAddress = zeroExHex

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

const proposalExecutableCallSelector = (
	proposalId: string,
	index: number
) => ({
	$proposal: proposalSelector(proposalId),
	index,
})

export const tallyProposalExecutableCallFields = (
	proposalId: string,
	call: TallyProposalExecutableCall
) => {
	const chainId = /^eip155:(0|[1-9][0-9]*)$/.exec(call.chainId)?.[1]
	if (chainId == null)
		throw new Error('Tally: executable call chain is not an EVM CAIP-2 id')
	const $network = evmNetworkSelector(chainId)

	return {
		[EntityMetaKey.Selector]: proposalExecutableCallSelector(proposalId, call.index),
		$proposal: {
			[EntityMetaKey.Selector]: proposalSelector(proposalId),
		},
		index: call.index,
		$network: {
			[EntityMetaKey.Selector]: $network,
		},
		$target: {
			[EntityMetaKey.Selector]: {
				$network,
				$actor: {
					address: zeroExAddress(call.target),
				},
			},
		},
		value: BigInt(call.value),
		calldata: zeroExHex(call.calldata),
		...(call.signature != null && {
			signature: call.signature,
		}),
		...(call.type != null && {
			callType: call.type,
		}),
	}
}

const tallyProposalExecutableCallReference = (
	proposalId: string,
	call: TallyProposalExecutableCall
) => {
	const fields = tallyProposalExecutableCallFields(proposalId, call)
	return {
		[EntityMetaKey.Selector]: proposalExecutableCallSelector(proposalId, call.index),
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.TallyProposalExecutableCall, [], '$network')]: fields.$network,
			[entityFieldAddressKey(EntityType.TallyProposalExecutableCall, [], '$target')]: fields.$target,
			[entityFieldAddressKey(EntityType.TallyProposalExecutableCall, [], 'value')]: fields.value,
			[entityFieldAddressKey(EntityType.TallyProposalExecutableCall, [], 'calldata')]: fields.calldata,
			...(fields.signature != null && {
				[entityFieldAddressKey(EntityType.TallyProposalExecutableCall, [], 'signature')]: fields.signature,
			}),
			...(fields.callType != null && {
				[entityFieldAddressKey(EntityType.TallyProposalExecutableCall, [], 'callType')]: fields.callType,
			}),
		},
	}
}

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

export const tallyProposalExecutionIdentity = (
	proposal: TallyProposal
) => {
	const chainId = /^eip155:(0|[1-9][0-9]*)$/.exec(proposal.chainId)?.[1]
	if (chainId == null)
		throw new Error('Tally: proposal chain is not an EVM CAIP-2 id')

	const timelockAccountId = proposal.metadata?.timelockId
	const executionHash = proposal.metadata?.txHash
	if (timelockAccountId == null || executionHash == null)
		return undefined

	const timelock = parseAccountId(timelockAccountId)
	if (timelock.chainId !== chainId)
		throw new Error('Tally: proposal timelock chain disagrees with proposal')

	return {
		chainId: Number(chainId),
		timelockAddress: timelock.address,
		executionHash: `0x${executionHash.slice(2).toLowerCase()}`,
	}
}

export const resolveTallyGovernanceExecutionSafeSnapshot = async ({
	proposalId,
}: {
	proposalId: string
}) => {
	const { getProposal } = await import('$/sources/Tally/Graphql/queries.ts')
	const { findSafeMultisigTransaction } = await import('$/sources/SafeTransactionService/Rest/queries.ts')
	const proposal = await getProposal({
		proposalId,
	})
	const executionIdentity = tallyProposalExecutionIdentity(proposal)
	if (executionIdentity == null)
		throw new Error('Tally: proposal has no timelock execution identity')

	const transaction = await findSafeMultisigTransaction({
		chainId: executionIdentity.chainId,
		safeAddress: executionIdentity.timelockAddress,
		txHash: executionIdentity.executionHash,
	})
	const executionHash = (
		transaction.transactionHash == null ?
			undefined
		:
			`0x${transaction.transactionHash.slice(2).toLowerCase()}`
	)
	if (executionHash == null)
		throw new Error('Tally: governance execution transaction is not executed on-chain')

	return {
		executionIdentity,
		transaction,
		$executionTransaction: {
			[EntityMetaKey.Selector]: {
				$network: evmNetworkSelector(executionIdentity.chainId.toString()),
				txHash: executionHash,
			},
		},
		$timelockAccount: {
			[EntityMetaKey.Selector]: {
				$network: evmNetworkSelector(executionIdentity.chainId.toString()),
				$actor: {
					address: executionIdentity.timelockAddress,
				},
			},
		},
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
			...(proposal.metadata.timelockId != null && {
				$timelockAccount: {
					[EntityMetaKey.Selector]: {
						$network: evmNetworkSelector(chainId),
						$actor: {
							address: parseAccountId(proposal.metadata.timelockId).address,
						},
					},
				},
			}),
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
		...(proposal.executableCalls != null && {
			$$executableCalls: proposal.executableCalls.map((call) => (
				tallyProposalExecutableCallReference(String(proposal.id), call)
			)),
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
		count: page.pageInfo.count ?? undefined,
		rows: page.nodes.map((proposal) => {
			const fields = tallyProposalFields(proposal)
			return {
				[EntityMetaKey.Selector]: proposalSelector(proposal.id),
				[EntityMetaKey.Fields]: {
					...(fields.onchainId != null && {
						[entityFieldAddressKey(EntityType.TallyProposal, [], 'onchainId')]: fields.onchainId,
					}),
					[entityFieldAddressKey(EntityType.TallyProposal, [], 'status')]: fields.status,
					[entityFieldAddressKey(EntityType.TallyProposal, [], '$governor')]: fields.$governor,
					[entityFieldAddressKey(EntityType.TallyProposal, [], '$network')]: fields.$network,
					...(fields.$proposer != null && {
						[entityFieldAddressKey(EntityType.TallyProposal, [], '$proposer')]: fields.$proposer,
					}),
					...(fields.title != null && {
						[entityFieldAddressKey(EntityType.TallyProposal, [], 'title')]: fields.title,
					}),
					...(fields.description != null && {
						[entityFieldAddressKey(EntityType.TallyProposal, [], 'description')]: fields.description,
					}),
					...(fields.organizationName != null && {
						[entityFieldAddressKey(EntityType.TallyProposal, [], 'organizationName')]: fields.organizationName,
					}),
					...(fields.quorum != null && {
						[entityFieldAddressKey(EntityType.TallyProposal, [], 'quorum')]: fields.quorum,
					}),
					...(fields.voteStats != null && {
						[entityFieldAddressKey(EntityType.TallyProposal, [], 'voteStats')]: fields.voteStats,
					}),
					...(fields.startAtMs != null && {
						[entityFieldAddressKey(EntityType.TallyProposal, [], 'startAtMs')]: fields.startAtMs,
					}),
					...(fields.endAtMs != null && {
						[entityFieldAddressKey(EntityType.TallyProposal, [], 'endAtMs')]: fields.endAtMs,
					}),
					...(fields.discourseUrl != null && {
						[entityFieldAddressKey(EntityType.TallyProposal, [], 'discourseUrl')]: fields.discourseUrl,
					}),
					...(fields.snapshotUrl != null && {
						[entityFieldAddressKey(EntityType.TallyProposal, [], 'snapshotUrl')]: fields.snapshotUrl,
					}),
				},
			}
		}),
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
			entityType: EntityType.TallyGovernor,
			resolve: {
				GovernorId: {
					resolve: async ({ governorId }) => {
						const { getProposalsPage } = await import('$/sources/Tally/Graphql/queries.ts')
						const count = (await getProposalsPage({
							governorId,
							limit: 1,
						})).pageInfo.count
						if (count == null)
							throw new Error('Tally: proposal count is unavailable')

						return count
					},
				},
			},
		})({
			$$proposals: {
				resolveCount: (count) => count,
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
			$$executableCalls: (proposal) => proposal.$$executableCalls,
		}),

		defineResolver({
			entityType: EntityType.TallyProposalExecutableCall,
			resolve: {
				ProposalIndex: {
					resolve: async ({ $proposal, index }) => {
						const { getProposal } = await import('$/sources/Tally/Graphql/queries.ts')
						const proposal = await getProposal({
							proposalId: $proposal.proposalId,
						})
						const call = proposal.executableCalls?.find((candidate) => candidate.index === index)
						if (call == null)
							throw new Error('Tally: executable call not found')
						return tallyProposalExecutableCallFields($proposal.proposalId, call)
					},
				},
			},
		})({
			$proposal: (call) => call.$proposal,
			index: (call) => call.index,
			$network: (call) => call.$network,
			$target: (call) => call.$target,
			value: (call) => call.value,
			calldata: (call) => call.calldata,
			signature: (call) => call.signature,
			callType: (call) => call.callType,
		}),
	],
} satisfies RegisteredSourceResolverModule
