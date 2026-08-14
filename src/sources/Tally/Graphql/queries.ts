import {
	tallyGovernorDataWire,
	tallyGovernorsPageDataWire,
	tallyProposalDataWire,
	tallyProposalEventTypes,
	tallyProposalStatuses,
	tallyProposalsPageDataWire,
	type TallyGovernor,
	type TallyPageInfo,
	type TallyProposal,
	type TallyProposalEventType,
	type TallyProposalStatus,
} from '$/sources/Tally/Graphql/types.ts'
import bindings from '$/sources/Tally/bindings.ts'
import { Source } from '$/sources/Source.ts'

import { queryTally } from './client.ts'

const binding = bindings[Source.Tally][0]

const tallyGovernorFields = `
	id
	chainId
	name
	slug
	type
	kind
	quorum
	timelockId
	tokenId
	delegatesCount
	delegatesVotesCount
	tokenOwnersCount
	isPrimary
	organization {
		id
		slug
		name
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
		clockMode
		countingMode
	}
	contracts {
		governor {
			address
		}
	}
	metadata {
		description
	}
`

const tallyProposalFields = `
	id
	onchainId
	chainId
	status
	quorum
	metadata {
		title
		description
		eta
		previousEnd
		timelockId
		ipfsHash
		txHash
		discourseURL
		snapshotURL
	}
	governor {
		id
		chainId
		name
		slug
	}
	organization {
		id
		slug
		name
	}
	proposer {
		address
		ens
		name
	}
	start {
		... on Block {
			timestamp
		}
		... on BlocklessTimestamp {
			timestamp
		}
	}
	end {
		... on Block {
			timestamp
		}
		... on BlocklessTimestamp {
			timestamp
		}
	}
	events {
		type
		createdAt
		txHash
		chainId
	}
	voteStats {
		type
		votesCount
		votersCount
		percent
	}
	executableCalls {
		index
		chainId
		target
		value
		calldata
		signature
		type
	}
`

const governorQuery = `
	query TallyGovernor($input: GovernorInput!) {
		governor(input: $input) {
			${tallyGovernorFields}
		}
	}
`

const governorsQuery = `
	query TallyGovernors($input: GovernorsInput!) {
		governors(input: $input) {
			nodes {
				... on Governor {
					${tallyGovernorFields}
				}
			}
			pageInfo {
				firstCursor
				lastCursor
				count
			}
		}
	}
`

const proposalQuery = `
	query TallyProposal($input: ProposalInput!) {
		proposal(input: $input) {
			${tallyProposalFields}
		}
	}
`

const proposalsQuery = `
	query TallyProposals($input: ProposalsInput!) {
		proposals(input: $input) {
			nodes {
				... on Proposal {
					${tallyProposalFields}
				}
			}
			pageInfo {
				firstCursor
				lastCursor
				count
			}
		}
	}
`

const proposalStatuses = new Set<TallyProposalStatus>(tallyProposalStatuses)
const proposalEventTypes = new Set<TallyProposalEventType>(tallyProposalEventTypes)

const compatibleLastEventTypesByStatus: Partial<Record<TallyProposalStatus, ReadonlySet<TallyProposalEventType>>> = {
	active: new Set(['activated', 'created', 'extended']),
	archived: new Set(['canceled', 'defeated', 'executed', 'expired', 'callexecuted', 'crosschainexecuted']),
	canceled: new Set(['canceled']),
	callexecuted: new Set(['callexecuted', 'executed']),
	defeated: new Set(['defeated']),
	draft: new Set(['drafted', 'created']),
	executed: new Set(['executed', 'callexecuted', 'crosschainexecuted']),
	expired: new Set(['expired']),
	extended: new Set(['extended']),
	pending: new Set(['created', 'drafted', 'pendingexecution']),
	pendingexecution: new Set(['pendingexecution', 'queued', 'succeeded']),
	queued: new Set(['queued', 'pendingexecution', 'succeeded']),
	submitted: new Set(['created', 'drafted']),
	succeeded: new Set(['succeeded', 'queued', 'pendingexecution']),
	crosschainexecuted: new Set(['crosschainexecuted', 'executed']),
}

const assertEnvelope = <_Value>(
	label: string,
	wire: { assert: (value: unknown) => _Value },
	response: unknown
) => {
	try {
		return wire.assert(response)
	} catch {
		throw new Error(`Tally: invalid ${label} envelope`)
	}
}

const assertCaip2 = (
	value: string,
	label: string
) => {
	if (!/^eip155:(0|[1-9][0-9]*)$/.test(value))
		throw new Error(`Tally: invalid ${label}`)
}

const assertAccountId = (
	value: string,
	label: string
) => {
	if (!/^eip155:(0|[1-9][0-9]*):0x[0-9a-fA-F]{40}$/.test(value))
		throw new Error(`Tally: invalid ${label}`)
}

const assertIntId = (
	value: string,
	label: string
) => {
	if (!/^(0|[1-9][0-9]{0,18})$/.test(value))
		throw new Error(`Tally: invalid ${label}`)
}

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
		throw new Error(`Tally: invalid ${label}`)
}

const assertSafeNonnegativeInteger = (
	value: number,
	label: string
) => {
	if (!Number.isSafeInteger(value) || value < 0)
		throw new Error(`Tally: invalid ${label}`)
}

const assertPageLimit = (
	limit: number
) => {
	if (!Number.isSafeInteger(limit) || limit < 1 || limit > 20)
		throw new Error('Tally: page limit must be from 1 through 20')
}

const assertPageInfo = (
	pageInfo: TallyPageInfo
) => {
	if (pageInfo.firstCursor != null)
		assertOpaqueIdentity(pageInfo.firstCursor, 'first cursor')
	if (pageInfo.lastCursor != null)
		assertOpaqueIdentity(pageInfo.lastCursor, 'last cursor')
	if (pageInfo.count != null)
		assertSafeNonnegativeInteger(pageInfo.count, 'page count')
}

const normalizeIntId = (
	value: string | number,
	label: string
) => {
	if (typeof value === 'number') {
		if (!Number.isSafeInteger(value) || value < 0)
			throw new Error(`Tally: invalid ${label}`)
		return String(value)
	}
	assertIntId(value, label)
	return value
}

const assertGovernor = (
	governor: TallyGovernor
) => {
	assertAccountId(governor.id, 'governor ID')
	assertCaip2(governor.chainId, 'governor chain ID')
	if (!governor.id.startsWith(`${governor.chainId}:`))
		throw new Error('Tally: governor chain disagrees with ID')
	if (governor.name != null)
		assertOpaqueIdentity(governor.name, 'governor name')
	if (governor.slug != null)
		assertOpaqueIdentity(governor.slug, 'governor slug')
	if (governor.type != null)
		assertOpaqueIdentity(governor.type, 'governor type')
	if (governor.kind != null)
		assertOpaqueIdentity(governor.kind, 'governor kind')
	if (governor.quorum != null)
		assertOpaqueIdentity(governor.quorum, 'governor quorum', 78)
	if (governor.timelockId != null) {
		assertAccountId(governor.timelockId, 'timelock ID')
		if (!governor.timelockId.startsWith(`${governor.chainId}:`))
			throw new Error('Tally: timelock chain disagrees with governor')
	}
	if (governor.tokenId != null) {
		assertOpaqueIdentity(governor.tokenId, 'token ID', 128)
		if (!governor.tokenId.startsWith(`${governor.chainId}/`))
			throw new Error('Tally: token chain disagrees with governor')
	}
	if (governor.delegatesCount != null)
		assertSafeNonnegativeInteger(governor.delegatesCount, 'delegates count')
	if (governor.delegatesVotesCount != null)
		assertOpaqueIdentity(governor.delegatesVotesCount, 'delegates votes count', 78)
	if (governor.tokenOwnersCount != null)
		assertSafeNonnegativeInteger(governor.tokenOwnersCount, 'token owners count')
	if (governor.organization != null) {
		governor.organization = {
			...governor.organization,
			id: normalizeIntId(governor.organization.id, 'organization ID'),
		}
		if (governor.organization.slug != null)
			assertOpaqueIdentity(governor.organization.slug, 'organization slug')
		if (governor.organization.name != null)
			assertOpaqueIdentity(governor.organization.name, 'organization name')
	}
	if (governor.proposalStats != null) {
		assertSafeNonnegativeInteger(governor.proposalStats.total, 'proposal total')
		assertSafeNonnegativeInteger(governor.proposalStats.active, 'proposal active count')
		assertSafeNonnegativeInteger(governor.proposalStats.failed, 'proposal failed count')
		assertSafeNonnegativeInteger(governor.proposalStats.passed, 'proposal passed count')
	}
	if (governor.parameters != null) {
		for (const [label, value] of [
			['quorum votes', governor.parameters.quorumVotes],
			['proposal threshold', governor.parameters.proposalThreshold],
			['voting delay', governor.parameters.votingDelay],
			['voting period', governor.parameters.votingPeriod],
			['grace period', governor.parameters.gracePeriod],
			['clock mode', governor.parameters.clockMode],
			['counting mode', governor.parameters.countingMode],
		] as const) {
			if (value != null)
				assertOpaqueIdentity(value, label, 128)
		}
	}
	if (governor.contracts?.governor?.address != null) {
		if (!/^0x[0-9a-fA-F]{40}$/.test(governor.contracts.governor.address))
			throw new Error('Tally: invalid governor contract address')
		if (governor.contracts.governor.address.toLowerCase() !== governor.id.slice(governor.chainId.length + 1).toLowerCase())
			throw new Error('Tally: governor contract disagrees with ID')
	}
	if (governor.metadata?.description != null)
		assertOpaqueIdentity(governor.metadata.description, 'governor description', 100_000)
}

const assertProposal = (
	proposal: TallyProposal
) => {
	const normalizedProposal = {
		...proposal,
		id: normalizeIntId(proposal.id, 'proposal ID'),
	}
	assertCaip2(proposal.chainId, 'proposal chain ID')
	if (!proposalStatuses.has(proposal.status))
		throw new Error('Tally: invalid proposal status')
	if (proposal.onchainId != null)
		assertOpaqueIdentity(proposal.onchainId, 'onchain proposal ID')
	if (proposal.quorum != null)
		assertOpaqueIdentity(proposal.quorum, 'proposal quorum', 78)
	if (proposal.metadata != null) {
		assertOpaqueIdentity(proposal.metadata.title, 'proposal title', 1024)
		assertOpaqueIdentity(proposal.metadata.description, 'proposal description', 100_000)
		if (proposal.metadata.eta != null)
			assertSafeNonnegativeInteger(proposal.metadata.eta, 'proposal eta')
		if (proposal.metadata.previousEnd != null)
			assertSafeNonnegativeInteger(proposal.metadata.previousEnd, 'proposal previous end')
		if (proposal.metadata.timelockId != null) {
			assertAccountId(proposal.metadata.timelockId, 'proposal timelock ID')
			if (!proposal.metadata.timelockId.startsWith(`${proposal.chainId}:`))
				throw new Error('Tally: proposal timelock chain disagrees with proposal')
		}
		if (proposal.metadata.ipfsHash != null)
			assertOpaqueIdentity(proposal.metadata.ipfsHash, 'proposal ipfs hash')
		if (proposal.metadata.txHash != null) {
			if (!/^0x[0-9a-fA-F]{64}$/.test(proposal.metadata.txHash))
				throw new Error('Tally: invalid proposal tx hash')
		}
		if (proposal.metadata.discourseURL != null)
			assertOpaqueIdentity(proposal.metadata.discourseURL, 'proposal discourse URL', 2048)
		if (proposal.metadata.snapshotURL != null)
			assertOpaqueIdentity(proposal.metadata.snapshotURL, 'proposal snapshot URL', 2048)
	}
	assertAccountId(proposal.governor.id, 'proposal governor ID')
	assertCaip2(proposal.governor.chainId, 'proposal governor chain ID')
	if (!proposal.governor.id.startsWith(`${proposal.governor.chainId}:`))
		throw new Error('Tally: proposal governor chain disagrees with ID')
	if (proposal.governor.chainId !== proposal.chainId)
		throw new Error('Tally: proposal chain disagrees with governor')
	if (proposal.governor.name != null)
		assertOpaqueIdentity(proposal.governor.name, 'proposal governor name')
	if (proposal.governor.slug != null)
		assertOpaqueIdentity(proposal.governor.slug, 'proposal governor slug')
	if (proposal.organization != null) {
		proposal.organization = {
			...proposal.organization,
			id: normalizeIntId(proposal.organization.id, 'organization ID'),
		}
		if (proposal.organization.slug != null)
			assertOpaqueIdentity(proposal.organization.slug, 'organization slug')
		if (proposal.organization.name != null)
			assertOpaqueIdentity(proposal.organization.name, 'organization name')
	}
	if (proposal.proposer != null) {
		if (!/^0x[0-9a-fA-F]{40}$/.test(proposal.proposer.address))
			throw new Error('Tally: invalid proposer address')
		if (proposal.proposer.ens != null)
			assertOpaqueIdentity(proposal.proposer.ens, 'proposer ens')
		if (proposal.proposer.name != null)
			assertOpaqueIdentity(proposal.proposer.name, 'proposer name')
	}
	if (proposal.start?.timestamp != null)
		assertOpaqueIdentity(proposal.start.timestamp, 'proposal start timestamp', 32)
	if (proposal.end?.timestamp != null)
		assertOpaqueIdentity(proposal.end.timestamp, 'proposal end timestamp', 32)
	if (proposal.voteStats != null) {
		for (const voteStat of proposal.voteStats) {
			assertOpaqueIdentity(voteStat.type, 'vote stat type')
			assertOpaqueIdentity(voteStat.votesCount, 'vote count', 78)
			assertSafeNonnegativeInteger(voteStat.votersCount, 'voters count')
			if (!Number.isFinite(voteStat.percent) || voteStat.percent < 0 || voteStat.percent > 100)
				throw new Error('Tally: invalid vote percent')
		}
		if (proposal.voteStats.length > 32)
			throw new Error('Tally: too many vote stats')
	}
	if (proposal.events != null) {
		let previousCreatedAt = -1
		for (const event of proposal.events) {
			if (!proposalEventTypes.has(event.type))
				throw new Error('Tally: invalid proposal event type')
			assertCaip2(event.chainId, 'proposal event chain ID')
			if (event.chainId !== proposal.chainId)
				throw new Error('Tally: proposal event chain disagrees with proposal')
			assertSafeNonnegativeInteger(event.createdAt, 'proposal event createdAt')
			if (event.createdAt < previousCreatedAt)
				throw new Error('Tally: proposal events are not chronological')
			previousCreatedAt = event.createdAt
			if (event.txHash != null && !/^0x[0-9a-fA-F]{64}$/.test(event.txHash))
				throw new Error('Tally: invalid proposal event tx hash')
		}
		if (proposal.events.length > 64)
			throw new Error('Tally: too many proposal events')
		const lastEvent = proposal.events.at(-1)
		const compatibleLastEventTypes = compatibleLastEventTypesByStatus[proposal.status]
		if (lastEvent != null && compatibleLastEventTypes != null && !compatibleLastEventTypes.has(lastEvent.type))
			throw new Error('Tally: proposal status disagrees with its latest event')
	}
	if (proposal.executableCalls != null) {
		const indexes = new Set<number>()
		let previousIndex = -1
		for (const call of proposal.executableCalls) {
			assertSafeNonnegativeInteger(call.index, 'executable call index')
			if (indexes.has(call.index))
				throw new Error('Tally: duplicate executable call index')
			if (call.index <= previousIndex)
				throw new Error('Tally: executable calls are not ordered by index')
			indexes.add(call.index)
			previousIndex = call.index

			assertCaip2(call.chainId, 'executable call chain ID')
			if (call.chainId !== proposal.chainId)
				throw new Error('Tally: executable call chain disagrees with proposal')
			if (!/^0x[0-9a-fA-F]{40}$/.test(call.target))
				throw new Error('Tally: invalid executable call target')
			if (!/^(0|[1-9][0-9]*)$/.test(call.value) || BigInt(call.value) >= 2n ** 256n)
				throw new Error('Tally: invalid executable call value')
			if (!/^0x(?:[0-9a-fA-F]{2})*$/.test(call.calldata))
				throw new Error('Tally: invalid executable call calldata')
			if (call.signature != null)
				assertOpaqueIdentity(call.signature, 'executable call signature', 1024)
			if (call.type != null)
				assertOpaqueIdentity(call.type, 'executable call type', 128)
		}
		if (proposal.executableCalls.length > 32)
			throw new Error('Tally: too many executable calls')
	}

	return normalizedProposal
}

export const getGovernor = async ({
	governorId,
}: {
	governorId: string
}) => {
	assertAccountId(governorId, 'requested governor ID')
	const { governor } = assertEnvelope(
		'governor',
		tallyGovernorDataWire,
		await queryTally(binding, governorQuery, {
			input: {
				id: governorId,
			},
		})
	)
	if (governor == null)
		throw new Error('Tally: governor not found')
	assertGovernor(governor)
	if (governor.id.toLowerCase() !== governorId.toLowerCase())
		throw new Error('Tally: returned a foreign governor')
	return governor
}

export const getGovernorsPage = async ({
	organizationId,
	limit,
	afterCursor,
	includeInactive = false,
}: {
	organizationId: string
	limit: number
	afterCursor?: string
	includeInactive?: boolean
}) => {
	assertIntId(organizationId, 'requested organization ID')
	assertPageLimit(limit)
	if (afterCursor != null)
		assertOpaqueIdentity(afterCursor, 'after cursor')

	const { governors } = assertEnvelope(
		'governors page',
		tallyGovernorsPageDataWire,
		await queryTally(binding, governorsQuery, {
			input: {
				filters: {
					organizationId,
					includeInactive,
				},
				page: {
					limit,
					...(afterCursor != null && {
						afterCursor,
					}),
				},
			},
		})
	)
	if (governors == null)
		throw new Error('Tally: governors page is missing')
	if (governors.nodes == null)
		throw new Error('Tally: governors page nodes are missing')
	if (governors.nodes.length > limit)
		throw new Error('Tally: governors page exceeds requested limit')
	assertPageInfo(governors.pageInfo)
	if (governors.pageInfo.count != null && governors.pageInfo.count < governors.nodes.length)
		throw new Error('Tally: governors page count is below returned rows')

	const governorIds = new Set<string>()
	const nodes: TallyGovernor[] = []
	for (const governor of governors.nodes) {
		if (governor == null)
			throw new Error('Tally: governors page contains an empty row')
		assertGovernor(governor)
		if (governor.organization?.id !== organizationId)
			throw new Error('Tally: returned a governor from a foreign organization')
		const idKey = governor.id.toLowerCase()
		if (governorIds.has(idKey))
			throw new Error('Tally: duplicate governor in page')
		governorIds.add(idKey)
		nodes.push(governor)
	}
	return {
		nodes,
		pageInfo: governors.pageInfo,
	}
}

export const getProposal = async ({
	proposalId,
}: {
	proposalId: string
}) => {
	assertIntId(proposalId, 'requested proposal ID')
	const { proposal } = assertEnvelope(
		'proposal',
		tallyProposalDataWire,
		await queryTally(binding, proposalQuery, {
			input: {
				id: proposalId,
			},
		})
	)
	if (proposal == null)
		throw new Error('Tally: proposal not found')
	const normalizedProposal = assertProposal(proposal)
	if (normalizedProposal.id !== proposalId)
		throw new Error('Tally: returned a foreign proposal')
	return normalizedProposal
}

export const getProposalsPage = async ({
	governorId,
	limit,
	afterCursor,
}: {
	governorId: string
	limit: number
	afterCursor?: string
}) => {
	assertAccountId(governorId, 'requested governor ID')
	assertPageLimit(limit)
	if (afterCursor != null)
		assertOpaqueIdentity(afterCursor, 'after cursor')

	const { proposals } = assertEnvelope(
		'proposals page',
		tallyProposalsPageDataWire,
		await queryTally(binding, proposalsQuery, {
			input: {
				filters: {
					governorId,
				},
				page: {
					limit,
					...(afterCursor != null && {
						afterCursor,
					}),
				},
			},
		})
	)
	if (proposals == null)
		throw new Error('Tally: proposals page is missing')
	if (proposals.nodes == null)
		throw new Error('Tally: proposals page nodes are missing')
	if (proposals.nodes.length > limit)
		throw new Error('Tally: proposals page exceeds requested limit')
	assertPageInfo(proposals.pageInfo)
	if (proposals.pageInfo.count != null && proposals.pageInfo.count < proposals.nodes.length)
		throw new Error('Tally: proposals page count is below returned rows')

	const proposalIds = new Set<string>()
	const nodes: TallyProposal[] = []
	for (const proposal of proposals.nodes) {
		if (proposal == null)
			throw new Error('Tally: proposals page contains an empty row')
		const normalizedProposal = assertProposal(proposal)
		if (proposal.governor.id.toLowerCase() !== governorId.toLowerCase())
			throw new Error('Tally: returned a proposal from a foreign governor')
		if (proposalIds.has(normalizedProposal.id))
			throw new Error('Tally: duplicate proposal in page')
		proposalIds.add(normalizedProposal.id)
		nodes.push(normalizedProposal)
	}
	return {
		nodes,
		pageInfo: proposals.pageInfo,
	}
}
