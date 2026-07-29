import { firstHttpUrlForBinding } from '$/sources/_runtime/http.ts'
import { graphql as queryGraphql } from '$/sources/_shared/wire/Graphql/client.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'
import type {
	TallyAccount,
	TallyBlockOrTimestamp,
	TallyExecutableCall,
	TallyExecutableCallType,
	TallyGovernor,
	TallyGovernorReference,
	TallyIntId,
	TallyObservation,
	TallyOrganization,
	TallyOrganizationReference,
	TallyPage,
	TallyPageInfo,
	TallyProposal,
	TallyProposalEvent,
	TallyProposalEventType,
	TallyProposalStatus,
	TallyUint256,
	TallyVoteStats,
	TallyVoteType,
} from '$/sources/Tally/Graphql/types.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

export const maximumTallyGraphqlResponseBytes = 2_000_000

const maximumUint64 = (1n << 64n) - 1n
const maximumUint256 = (1n << 256n) - 1n

const governorKinds = new Set<string>([
	'single',
	'multiprimary',
	'multisecondary',
	'multiother',
	'hub',
	'spoke',
])

const governorTypes = new Set<string>([
	'governoralpha',
	'governorbravo',
	'openzeppelingovernor',
	'aave',
	'nounsfork',
	'nomineeelection',
	'memberelection',
	'hub',
	'spoke',
])

const blockOrTimestampTypes = new Set<string>([
	'Block',
	'BlocklessTimestamp',
])

const proposalStatuses = new Set<TallyProposalStatus>([
	'active',
	'archived',
	'canceled',
	'callexecuted',
	'defeated',
	'draft',
	'executed',
	'expired',
	'extended',
	'pending',
	'queued',
	'pendingexecution',
	'submitted',
	'succeeded',
	'crosschainexecuted',
	'vetovoteopen',
	'vetoquorummet',
	'vetoed',
])

const proposalEventTypes = new Set<TallyProposalEventType>([
	'activated',
	'canceled',
	'created',
	'defeated',
	'drafted',
	'executed',
	'expired',
	'extended',
	'pendingexecution',
	'queued',
	'succeeded',
	'callexecuted',
	'crosschainexecuted',
])

const voteTypes = new Set<TallyVoteType>([
	'abstain',
	'against',
	'for',
	'pendingabstain',
	'pendingagainst',
	'pendingfor',
])

const executableCallTypes = new Set<TallyExecutableCallType>([
	'custom',
	'erc20transfer',
	'erc20transferarbitrum',
	'empty',
	'nativetransfer',
	'orcamanagepod',
	'other',
	'reward',
	'swap',
])

const accountFields = `
	id
	address
	name
`

const organizationReferenceFields = `
	id
	slug
	name
`

const organizationFields = `
	${organizationReferenceFields}
	chainIds
	governorIds
	metadata {
		description
		icon
	}
	hasActiveProposals
	proposalsCount
`

const governorReferenceFields = `
	id
	chainId
	slug
	name
`

const governorFields = `
	${governorReferenceFields}
	isIndexing
	isBehind
	isPrimary
	kind
	organization {
		${organizationReferenceFields}
	}
	proposalStats {
		total
		active
		failed
		passed
	}
	parameters {
		quorumVotes
		proposalThreshold
		votingDelay
		votingPeriod
		gracePeriod
		quorumNumerator
		quorumDenominator
		clockMode
		countingMode
	}
	quorum
	timelockId
	tokenId
	type
`

const blockOrTimestampFields = `
	__typename
	... on Block {
		id
		number
		timestamp
	}
	... on BlocklessTimestamp {
		timestamp
	}
`

const proposalFields = `
	id
	onchainId
	chainId
	creator {
		${accountFields}
	}
	end {
		${blockOrTimestampFields}
	}
	events {
		block {
			id
			number
			timestamp
		}
		chainId
		createdAt
		type
		txHash
	}
	executableCalls {
		calldata
		chainId
		index
		signature
		target
		type
		value
	}
	governor {
		${governorReferenceFields}
	}
	metadata {
		title
		description
		eta
		ipfsHash
		previousEnd
		timelockId
		txHash
		discourseURL
		snapshotURL
	}
	organization {
		${organizationReferenceFields}
	}
	proposer {
		${accountFields}
	}
	quorum
	status
	start {
		${blockOrTimestampFields}
	}
	voteStats {
		type
		votesCount
		votersCount
		percent
	}
`

const assertOpaqueIdentity = (
	value: string,
	label: string,
	maximumLength = 256
) => {
	if (
		value.length < 1
		|| value.length > maximumLength
		|| /[\u0000-\u001f\u007f]/.test(value)
	)
		throw new Error(`Tally_Graphql: invalid ${label}`)
}

const assertText = (
	value: string,
	label: string,
	maximumLength: number
) => {
	if (value.length > maximumLength || value.includes('\u0000'))
		throw new Error(`Tally_Graphql: invalid ${label}`)
}

const assertSafeNonnegativeInteger = (
	value: number,
	label: string
) => {
	if (!Number.isSafeInteger(value) || value < 0)
		throw new Error(`Tally_Graphql: invalid ${label}`)
}

const assertFinitePercentage = (
	value: number,
	label: string
) => {
	if (!Number.isFinite(value) || value < 0 || value > 100)
		throw new Error(`Tally_Graphql: invalid ${label}`)
}

const assertUnsignedDecimal = (
	value: string,
	label: string,
	maximum: bigint
) => {
	if (
		!/^(0|[1-9][0-9]*)$/.test(value)
		|| BigInt(value) > maximum
	)
		throw new Error(`Tally_Graphql: invalid ${label}`)
}

const assertIntId = (
	value: TallyIntId,
	label: string
) => assertUnsignedDecimal(value, label, maximumUint64)

const assertUint256 = (
	value: TallyUint256,
	label: string
) => assertUnsignedDecimal(value, label, maximumUint256)

const assertChainId = (
	value: string,
	label: string
) => {
	if (!/^eip155:(0|[1-9][0-9]*)$/.test(value))
		throw new Error(`Tally_Graphql: invalid ${label}`)
}

const assertAddress = (
	value: string,
	label: string
) => {
	if (!/^0x[0-9a-fA-F]{40}$/.test(value))
		throw new Error(`Tally_Graphql: invalid ${label}`)
}

const assertAccountId = (
	value: string,
	label: string
) => {
	if (!/^eip155:(0|[1-9][0-9]*):0x[0-9a-fA-F]{40}$/.test(value))
		throw new Error(`Tally_Graphql: invalid ${label}`)
}

const assertAccountIdChain = (
	value: string,
	chainId: string,
	label: string
) => {
	assertAccountId(value, label)
	if (!value.toLowerCase().startsWith(`${chainId.toLowerCase()}:`))
		throw new Error(`Tally_Graphql: ${label} belongs to a foreign chain`)
}

const assertHash = (
	value: string,
	label: string
) => {
	if (!/^0x[0-9a-fA-F]{64}$/.test(value))
		throw new Error(`Tally_Graphql: invalid ${label}`)
}

const assertAssetId = (
	value: string,
	chainId: string,
	label: string
) => {
	if (
		!value.startsWith(`${chainId}/`)
		|| !/^eip155:(0|[1-9][0-9]*)\/[-a-zA-Z0-9]{3,8}:[-.%a-zA-Z0-9]{1,128}$/.test(value)
	)
		throw new Error(`Tally_Graphql: invalid ${label}`)
}

const assertPageInput = ({
	afterCursor,
	limit,
}: {
	afterCursor?: string
	limit: number
}) => {
	if (!Number.isSafeInteger(limit) || limit < 1 || limit > 20)
		throw new Error('Tally_Graphql: page limit must be from 1 through 20')
	if (afterCursor != null)
		assertOpaqueIdentity(afterCursor, 'pagination cursor', 1_024)
}

const graphql = async <_Data>({
	binding,
	query,
	variables,
}: {
	binding: SourceBinding
	query: string
	variables: JsonValue
}) => {
	const data = await queryGraphql<_Data>({
		binding,
		maximumResponseBytes: maximumTallyGraphqlResponseBytes,
		query,
		variables,
	})
	if (data == null)
		throw new Error('Tally_Graphql: response is missing data')

	return data
}

const observation = <_Value>(
	binding: SourceBinding,
	value: _Value
): TallyObservation<_Value> => ({
	value,
	observedBy: 'Tally_Graphql',
	endpoint: firstHttpUrlForBinding(binding),
	resolvedAtMs: Date.now(),
})

const assertAccount = (
	account: TallyAccount
) => {
	assertOpaqueIdentity(account.id, 'account ID')
	assertAddress(account.address, 'account address')
	assertText(account.name, 'account name', 1_000)
}

const assertOrganizationReference = (
	organization: TallyOrganizationReference
) => {
	assertIntId(organization.id, 'organization ID')
	assertOpaqueIdentity(organization.slug, 'organization slug')
	assertText(organization.name, 'organization name', 1_000)
}

const assertOrganization = (
	organization: TallyOrganization
) => {
	assertOrganizationReference(organization)
	assertSafeNonnegativeInteger(organization.proposalsCount, 'organization proposal count')
	const chainIds = new Set<string>()
	for (const chainId of organization.chainIds) {
		assertChainId(chainId, 'organization chain ID')
		if (chainIds.has(chainId))
			throw new Error('Tally_Graphql: duplicate organization chain')
		chainIds.add(chainId)
	}
	const governorIds = new Set<string>()
	for (const governorId of organization.governorIds) {
		assertAccountId(governorId, 'organization governor ID')
		if (governorIds.has(governorId.toLowerCase()))
			throw new Error('Tally_Graphql: duplicate organization governor')
		governorIds.add(governorId.toLowerCase())
	}
	if (organization.metadata != null) {
		if (organization.metadata.description != null)
			assertText(organization.metadata.description, 'organization description', 100_000)
		if (organization.metadata.icon != null)
			assertOpaqueIdentity(organization.metadata.icon, 'organization icon', 4_096)
	}
}

const assertGovernorReference = (
	governor: TallyGovernorReference
) => {
	assertChainId(governor.chainId, 'governor chain ID')
	assertAccountIdChain(governor.id, governor.chainId, 'governor ID')
	assertOpaqueIdentity(governor.slug, 'governor slug')
	assertText(governor.name, 'governor name', 1_000)
}

const assertGovernor = (
	governor: TallyGovernor
) => {
	assertGovernorReference(governor)
	assertOrganizationReference(governor.organization)
	if (!governorKinds.has(governor.kind))
		throw new Error('Tally_Graphql: invalid governor kind')
	if (!governorTypes.has(governor.type))
		throw new Error('Tally_Graphql: invalid governor type')
	for (const [value, label] of [
		[governor.proposalStats.total, 'total proposal count'],
		[governor.proposalStats.active, 'active proposal count'],
		[governor.proposalStats.failed, 'failed proposal count'],
		[governor.proposalStats.passed, 'passed proposal count'],
	])
		assertSafeNonnegativeInteger(value, label)
	if (
		governor.proposalStats.active > governor.proposalStats.total
		|| governor.proposalStats.failed > governor.proposalStats.total
		|| governor.proposalStats.passed > governor.proposalStats.total
	)
		throw new Error('Tally_Graphql: governor proposal stats exceed total')
	for (const [value, label] of [
		[governor.parameters.quorumVotes, 'governor quorum votes'],
		[governor.parameters.proposalThreshold, 'governor proposal threshold'],
		[governor.parameters.votingDelay, 'governor voting delay'],
		[governor.parameters.votingPeriod, 'governor voting period'],
		[governor.parameters.gracePeriod, 'governor grace period'],
		[governor.parameters.quorumNumerator, 'governor quorum numerator'],
		[governor.parameters.quorumDenominator, 'governor quorum denominator'],
	])
		if (value != null)
			assertUint256(value, label)
	assertUint256(governor.quorum, 'governor quorum')
	if (governor.timelockId != null)
		assertAccountIdChain(governor.timelockId, governor.chainId, 'governor timelock ID')
	assertAssetId(governor.tokenId, governor.chainId, 'governor token ID')
}

const assertBlockOrTimestamp = (
	value: TallyBlockOrTimestamp,
	label: string
) => {
	if (!blockOrTimestampTypes.has(value.__typename))
		throw new Error(`Tally_Graphql: invalid ${label} kind`)
	assertSafeNonnegativeInteger(value.timestamp, `${label} timestamp`)
	if (value.__typename === 'Block') {
		assertSafeNonnegativeInteger(value.number, `${label} block number`)
		if (!/^eip155:(0|[1-9][0-9]*):(0|[1-9][0-9]*)$/.test(value.id))
			throw new Error(`Tally_Graphql: invalid ${label} block ID`)
	}
}

const assertProposalEvent = (
	event: TallyProposalEvent
) => {
	assertChainId(event.chainId, 'proposal event chain ID')
	assertSafeNonnegativeInteger(event.createdAt, 'proposal event timestamp')
	if (!proposalEventTypes.has(event.type))
		throw new Error('Tally_Graphql: invalid proposal event type')
	if (event.txHash != null)
		assertHash(event.txHash, 'proposal event transaction hash')
	if (event.block != null) {
		assertSafeNonnegativeInteger(event.block.number, 'proposal event block number')
		assertSafeNonnegativeInteger(event.block.timestamp, 'proposal event block timestamp')
		if (!event.block.id.startsWith(`${event.chainId}:`))
			throw new Error('Tally_Graphql: proposal event block belongs to a foreign chain')
	}
}

const assertExecutableCall = (
	call: TallyExecutableCall
) => {
	assertChainId(call.chainId, 'executable call chain ID')
	assertSafeNonnegativeInteger(call.index, 'executable call index')
	if (!/^0x(?:[0-9a-fA-F]{2})*$/.test(call.calldata))
		throw new Error('Tally_Graphql: invalid executable call calldata')
	assertAddress(call.target, 'executable call target')
	assertUint256(call.value, 'executable call value')
	if (call.signature != null)
		assertOpaqueIdentity(call.signature, 'executable call signature', 1_000)
	if (call.type != null && !executableCallTypes.has(call.type))
		throw new Error('Tally_Graphql: invalid executable call type')
}

const assertVoteStats = (
	stats: TallyVoteStats
) => {
	if (!voteTypes.has(stats.type))
		throw new Error('Tally_Graphql: invalid vote type')
	assertUint256(stats.votesCount, 'vote total')
	assertSafeNonnegativeInteger(stats.votersCount, 'voter count')
	assertFinitePercentage(stats.percent, 'vote percentage')
}

const assertProposal = (
	proposal: TallyProposal
) => {
	assertIntId(proposal.id, 'proposal ID')
	if (proposal.onchainId == null || proposal.onchainId === '')
		throw new Error('Tally_Graphql: onchain proposal ID is missing')
	assertOpaqueIdentity(proposal.onchainId, 'onchain proposal ID', 1_024)
	if (proposal.chainId == null)
		throw new Error('Tally_Graphql: proposal chain ID is missing')
	assertChainId(proposal.chainId, 'proposal chain ID')
	if (proposal.creator == null)
		throw new Error('Tally_Graphql: proposal creator is missing')
	assertAccount(proposal.creator)
	assertBlockOrTimestamp(proposal.start, 'proposal start')
	assertBlockOrTimestamp(proposal.end, 'proposal end')
	if (proposal.start.timestamp > proposal.end.timestamp)
		throw new Error('Tally_Graphql: invalid proposal voting window')
	if (proposal.governor == null)
		throw new Error('Tally_Graphql: proposal governor is missing')
	assertGovernorReference(proposal.governor)
	if (proposal.governor.chainId !== proposal.chainId)
		throw new Error('Tally_Graphql: proposal governor belongs to a foreign chain')
	assertOrganizationReference(proposal.organization)
	if (proposal.proposer != null)
		assertAccount(proposal.proposer)
	if (!proposalStatuses.has(proposal.status))
		throw new Error('Tally_Graphql: invalid proposal status')
	if (proposal.quorum != null)
		assertUint256(proposal.quorum, 'proposal quorum')
	assertText(proposal.metadata.title, 'proposal title', 100_000)
	assertText(proposal.metadata.description, 'proposal description', 1_500_000)
	for (const [timestamp, label] of [
		[proposal.metadata.eta, 'proposal execution timestamp'],
		[proposal.metadata.previousEnd, 'proposal previous end'],
	])
		if (timestamp != null)
			assertSafeNonnegativeInteger(timestamp, label)
	if (proposal.metadata.timelockId != null)
		assertAccountId(proposal.metadata.timelockId, 'proposal timelock ID')
	if (proposal.metadata.txHash != null)
		assertHash(proposal.metadata.txHash, 'proposal transaction hash')
	for (const [url, label] of [
		[proposal.metadata.discourseURL, 'proposal discourse URL'],
		[proposal.metadata.snapshotURL, 'proposal Snapshot URL'],
	])
		if (url != null)
			assertOpaqueIdentity(url, label, 4_096)
	const eventIdentities = new Set<string>()
	for (const event of proposal.events ?? []) {
		assertProposalEvent(event)
		const identity = `${event.chainId}:${event.createdAt}:${event.type}:${event.txHash ?? ''}`
		if (eventIdentities.has(identity))
			throw new Error('Tally_Graphql: duplicate proposal event')
		eventIdentities.add(identity)
	}
	const callIndexes = new Set<number>()
	for (const call of proposal.executableCalls ?? []) {
		assertExecutableCall(call)
		if (callIndexes.has(call.index))
			throw new Error('Tally_Graphql: duplicate executable call index')
		callIndexes.add(call.index)
	}
	const observedVoteTypes = new Set<TallyVoteType>()
	for (const stats of proposal.voteStats ?? []) {
		assertVoteStats(stats)
		if (observedVoteTypes.has(stats.type))
			throw new Error('Tally_Graphql: duplicate proposal vote type')
		observedVoteTypes.add(stats.type)
	}
}

const assertPageInfo = (
	pageInfo: TallyPageInfo
) => {
	if (pageInfo.firstCursor != null)
		assertOpaqueIdentity(pageInfo.firstCursor, 'first pagination cursor', 1_024)
	if (pageInfo.lastCursor != null)
		assertOpaqueIdentity(pageInfo.lastCursor, 'last pagination cursor', 1_024)
	if (pageInfo.count != null)
		assertSafeNonnegativeInteger(pageInfo.count, 'reported page count')
}

const page = <_Value>(
	items: _Value[],
	pageInfo: TallyPageInfo,
	limit: number,
	afterCursor?: string
): TallyPage<_Value> => {
	assertPageInfo(pageInfo)
	if (items.length > limit)
		throw new Error('Tally_Graphql: page exceeds requested limit')
	if (
		items.length === limit
		&& (
			pageInfo.lastCursor == null
			|| pageInfo.lastCursor === afterCursor
		)
	)
		throw new Error('Tally_Graphql: full page has no advancing cursor')
	return {
		items,
		pageInfo,
		...(items.length === limit && {
			nextCursor: pageInfo.lastCursor,
		}),
	}
}

export const getOrganization = async ({
	binding,
	organizationId,
	slug,
}: {
	binding: SourceBinding
	organizationId?: TallyIntId
	slug?: string
}) => {
	if ((organizationId == null) === (slug == null))
		throw new Error('Tally_Graphql: exactly one organization identity is required')
	if (organizationId != null)
		assertIntId(organizationId, 'requested organization ID')
	if (slug != null)
		assertOpaqueIdentity(slug, 'requested organization slug')
	const { organization } = await graphql<{
		organization: TallyOrganization | null
	}>({
		binding,
		query: `query Organization($input: OrganizationInput!) {
			organization(input: $input) {
				${organizationFields}
			}
		}`,
		variables: {
			input: {
				...(organizationId != null && {
					id: organizationId,
				}),
				...(slug != null && {
					slug,
				}),
			},
		},
	})
	if (organization == null)
		return observation(binding, null)
	assertOrganization(organization)
	if (
		(organizationId != null && organization.id !== organizationId)
		|| (slug != null && organization.slug !== slug)
	)
		throw new Error('Tally_Graphql: returned a foreign organization')
	return observation(binding, organization)
}

export const getOrganizationsPage = async ({
	binding,
	chainId,
	limit,
	afterCursor,
}: {
	binding: SourceBinding
	chainId?: string
	limit: number
	afterCursor?: string
}) => {
	if (chainId != null)
		assertChainId(chainId, 'requested organization chain ID')
	assertPageInput({
		afterCursor,
		limit,
	})
	const { organizations } = await graphql<{
		organizations: {
			nodes: ({
				__typename: string
			} & TallyOrganization)[]
			pageInfo: TallyPageInfo
		}
	}>({
		binding,
		query: `query Organizations($input: OrganizationsInput) {
			organizations(input: $input) {
				nodes {
					__typename
					... on Organization {
						${organizationFields}
					}
				}
				pageInfo {
					firstCursor
					lastCursor
					count
				}
			}
		}`,
		variables: {
			input: {
				...(chainId != null && {
					filters: {
						chainId,
					},
				}),
				page: {
					...(afterCursor != null && {
						afterCursor,
					}),
					limit,
				},
				sort: {
					isDescending: true,
					sortBy: 'id',
				},
			},
		},
	})
	const organizationIds = new Set<string>()
	for (const organization of organizations.nodes) {
		if (organization.__typename !== 'Organization')
			throw new Error('Tally_Graphql: organization page returned a foreign node type')
		assertOrganization(organization)
		if (chainId != null && !organization.chainIds.includes(chainId))
			throw new Error('Tally_Graphql: organization chain filter was violated')
		if (organizationIds.has(organization.id))
			throw new Error('Tally_Graphql: duplicate organization in page')
		organizationIds.add(organization.id)
	}
	return observation(binding, page(
		organizations.nodes,
		organizations.pageInfo,
		limit,
		afterCursor
	))
}

export const getGovernor = async ({
	binding,
	governorId,
}: {
	binding: SourceBinding
	governorId: string
}) => {
	assertAccountId(governorId, 'requested governor ID')
	const { governor } = await graphql<{
		governor: TallyGovernor | null
	}>({
		binding,
		query: `query Governor($input: GovernorInput!) {
			governor(input: $input) {
				${governorFields}
			}
		}`,
		variables: {
			input: {
				id: governorId,
			},
		},
	})
	if (governor == null)
		return observation(binding, null)
	assertGovernor(governor)
	if (governor.id.toLowerCase() !== governorId.toLowerCase())
		throw new Error('Tally_Graphql: returned a foreign governor')
	return observation(binding, governor)
}

export const getGovernorsPage = async ({
	binding,
	organizationId,
	limit,
	afterCursor,
	includeInactive = false,
}: {
	binding: SourceBinding
	organizationId: TallyIntId
	limit: number
	afterCursor?: string
	includeInactive?: boolean
}) => {
	assertIntId(organizationId, 'requested organization ID')
	assertPageInput({
		afterCursor,
		limit,
	})
	const { governors } = await graphql<{
		governors: {
			nodes: ({
				__typename: string
			} & TallyGovernor)[]
			pageInfo: TallyPageInfo
		}
	}>({
		binding,
		query: `query Governors($input: GovernorsInput!) {
			governors(input: $input) {
				nodes {
					__typename
					... on Governor {
						${governorFields}
					}
				}
				pageInfo {
					firstCursor
					lastCursor
					count
				}
			}
		}`,
		variables: {
			input: {
				filters: {
					organizationId,
					includeInactive,
				},
				page: {
					...(afterCursor != null && {
						afterCursor,
					}),
					limit,
				},
				sort: {
					isDescending: true,
					sortBy: 'id',
				},
			},
		},
	})
	const governorIds = new Set<string>()
	for (const governor of governors.nodes) {
		if (governor.__typename !== 'Governor')
			throw new Error('Tally_Graphql: governor page returned a foreign node type')
		assertGovernor(governor)
		if (governor.organization.id !== organizationId)
			throw new Error('Tally_Graphql: returned a governor from a foreign organization')
		if (governorIds.has(governor.id.toLowerCase()))
			throw new Error('Tally_Graphql: duplicate governor in page')
		governorIds.add(governor.id.toLowerCase())
	}
	return observation(binding, page(
		governors.nodes,
		governors.pageInfo,
		limit,
		afterCursor
	))
}

export const getProposal = async ({
	binding,
	governorId,
	onchainId,
}: {
	binding: SourceBinding
	governorId: string
	onchainId: string
}) => {
	assertAccountId(governorId, 'requested governor ID')
	assertOpaqueIdentity(onchainId, 'requested onchain proposal ID', 1_024)
	const { proposal } = await graphql<{
		proposal: TallyProposal | null
	}>({
		binding,
		query: `query Proposal($input: ProposalInput!) {
			proposal(input: $input) {
				${proposalFields}
			}
		}`,
		variables: {
			input: {
				governorId,
				onchainId,
			},
		},
	})
	if (proposal == null)
		return observation(binding, null)
	assertProposal(proposal)
	if (
		proposal.governor?.id.toLowerCase() !== governorId.toLowerCase()
		|| proposal.onchainId !== onchainId
	)
		throw new Error('Tally_Graphql: returned a foreign proposal')
	return observation(binding, proposal)
}

export const getProposalsPage = async ({
	binding,
	governorId,
	limit,
	afterCursor,
}: {
	binding: SourceBinding
	governorId: string
	limit: number
	afterCursor?: string
}) => {
	assertAccountId(governorId, 'requested governor ID')
	assertPageInput({
		afterCursor,
		limit,
	})
	const { proposals } = await graphql<{
		proposals: {
			nodes: ({
				__typename: string
			} & TallyProposal)[]
			pageInfo: TallyPageInfo
		}
	}>({
		binding,
		query: `query Proposals($input: ProposalsInput!) {
			proposals(input: $input) {
				nodes {
					__typename
					... on Proposal {
						${proposalFields}
					}
				}
				pageInfo {
					firstCursor
					lastCursor
					count
				}
			}
		}`,
		variables: {
			input: {
				filters: {
					governorId,
					isDraft: false,
				},
				page: {
					...(afterCursor != null && {
						afterCursor,
					}),
					limit,
				},
				sort: {
					isDescending: true,
					sortBy: 'id',
				},
			},
		},
	})
	const proposalIds = new Set<string>()
	for (const proposal of proposals.nodes) {
		if (proposal.__typename !== 'Proposal')
			throw new Error('Tally_Graphql: proposal page returned a foreign node type')
		assertProposal(proposal)
		if (proposal.governor?.id.toLowerCase() !== governorId.toLowerCase())
			throw new Error('Tally_Graphql: returned a proposal from a foreign governor')
		if (proposalIds.has(proposal.id))
			throw new Error('Tally_Graphql: duplicate proposal in page')
		proposalIds.add(proposal.id)
	}
	return observation(binding, page(
		proposals.nodes,
		proposals.pageInfo,
		limit,
		afterCursor
	))
}
