import type {
	TallyGovernor,
	TallyPageInfo,
	TallyProposal,
	TallyProposalStatus,
} from '$/sources/Tally/Graphql/types.ts'

import { queryTally } from './client.ts'

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
	voteStats {
		type
		votesCount
		votersCount
		percent
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

const normalizeIntId = (
	value: string | number,
	label: string
) => {
	const normalized = typeof value === 'number' ? String(value) : value
	assertIntId(normalized, label)
	return normalized
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
	if (governor.timelockId != null)
		assertAccountId(governor.timelockId, 'timelock ID')
	if (governor.tokenId != null)
		assertOpaqueIdentity(governor.tokenId, 'token ID', 128)
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
	if (governor.contracts?.governor?.address != null) {
		if (!/^0x[0-9a-fA-F]{40}$/.test(governor.contracts.governor.address))
			throw new Error('Tally: invalid governor contract address')
	}
}

const assertProposal = (
	proposal: TallyProposal
) => {
	proposal.id = normalizeIntId(proposal.id, 'proposal ID')
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
		if (proposal.metadata.ipfsHash != null)
			assertOpaqueIdentity(proposal.metadata.ipfsHash, 'proposal ipfs hash')
		if (proposal.metadata.txHash != null) {
			if (!/^0x[0-9a-fA-F]{64}$/.test(proposal.metadata.txHash))
				throw new Error('Tally: invalid proposal tx hash')
		}
	}
	assertAccountId(proposal.governor.id, 'proposal governor ID')
	assertCaip2(proposal.governor.chainId, 'proposal governor chain ID')
	if (proposal.governor.chainId !== proposal.chainId)
		throw new Error('Tally: proposal chain disagrees with governor')
	if (proposal.organization != null) {
		proposal.organization = {
			...proposal.organization,
			id: normalizeIntId(proposal.organization.id, 'organization ID'),
		}
	}
	if (proposal.proposer != null) {
		if (!/^0x[0-9a-fA-F]{40}$/.test(proposal.proposer.address))
			throw new Error('Tally: invalid proposer address')
	}
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
}

export const getGovernor = async ({
	governorId,
}: {
	governorId: string
}) => {
	assertAccountId(governorId, 'requested governor ID')
	const { governor } = await queryTally<{
		governor: TallyGovernor | null
	}>(governorQuery, {
		input: {
			id: governorId,
		},
	})
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

	const { governors } = await queryTally<{
		governors: {
			nodes: (TallyGovernor | null)[] | null
			pageInfo: TallyPageInfo
		} | null
	}>(governorsQuery, {
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
	if (governors == null)
		throw new Error('Tally: governors page is missing')
	if (governors.nodes == null)
		throw new Error('Tally: governors page nodes are missing')
	if (governors.nodes.length > limit)
		throw new Error('Tally: governors page exceeds requested limit')

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
	const { proposal } = await queryTally<{
		proposal: TallyProposal | null
	}>(proposalQuery, {
		input: {
			id: proposalId,
		},
	})
	if (proposal == null)
		throw new Error('Tally: proposal not found')
	assertProposal(proposal)
	if (proposal.id !== proposalId)
		throw new Error('Tally: returned a foreign proposal')
	return proposal
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

	const { proposals } = await queryTally<{
		proposals: {
			nodes: (TallyProposal | null)[] | null
			pageInfo: TallyPageInfo
		} | null
	}>(proposalsQuery, {
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
	if (proposals == null)
		throw new Error('Tally: proposals page is missing')
	if (proposals.nodes == null)
		throw new Error('Tally: proposals page nodes are missing')
	if (proposals.nodes.length > limit)
		throw new Error('Tally: proposals page exceeds requested limit')

	const proposalIds = new Set<string>()
	const nodes: TallyProposal[] = []
	for (const proposal of proposals.nodes) {
		if (proposal == null)
			throw new Error('Tally: proposals page contains an empty row')
		assertProposal(proposal)
		if (proposal.governor.id.toLowerCase() !== governorId.toLowerCase())
			throw new Error('Tally: returned a proposal from a foreign governor')
		if (proposalIds.has(proposal.id))
			throw new Error('Tally: duplicate proposal in page')
		proposalIds.add(proposal.id)
		nodes.push(proposal)
	}
	return {
		nodes,
		pageInfo: proposals.pageInfo,
	}
}
