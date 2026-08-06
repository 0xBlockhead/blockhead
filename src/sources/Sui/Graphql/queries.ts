import {
	executeSui,
	graphql,
} from '$/sources/Sui/Graphql/client.ts'

const addressBalancesDocument = graphql(`
	query SuiAddressBalances($address: SuiAddress!, $first: Int!, $after: String) {
		address(address: $address) {
			address
			balances(first: $first, after: $after) {
				pageInfo {
					hasNextPage
					endCursor
				}
				nodes {
					coinType {
						repr
					}
					totalBalance
					coinBalance
					addressBalance
				}
			}
		}
	}
`)

const addressTransactionsDocument = graphql(`
	query SuiAddressTransactions($address: SuiAddress!, $first: Int!, $after: String) {
		address(address: $address) {
			address
		}
		transactions(
			first: $first
			after: $after
			filter: { affectedAddress: $address }
		) {
			pageInfo {
				hasNextPage
				endCursor
			}
			nodes {
				digest
				sender {
					address
				}
			}
		}
	}
`)

const recentTransactionsDocument = graphql(`
	query SuiRecentTransactions($first: Int!, $after: String) {
		transactions(
			first: $first
			after: $after
		) {
			pageInfo {
				hasNextPage
				endCursor
			}
			nodes {
				digest
				sender {
					address
				}
			}
		}
	}
`)

const latestCheckpointDocument = graphql(`
	query SuiLatestCheckpoint {
		checkpoint {
			sequenceNumber
			digest
			previousCheckpointDigest
			timestamp
			networkTotalTransactions
			epoch {
				epochId
				protocolConfigs {
					protocolVersion
				}
			}
		}
	}
`)

const checkpointBySequenceDocument = graphql(`
	query SuiCheckpointBySequence($sequenceNumber: UInt53!) {
		checkpoint(sequenceNumber: $sequenceNumber) {
			sequenceNumber
			digest
			previousCheckpointDigest
			timestamp
			networkTotalTransactions
			epoch {
				epochId
				protocolConfigs {
					protocolVersion
				}
			}
		}
	}
`)

const checkpointByDigestDocument = graphql(`
	query SuiCheckpointByDigest($digest: String!) {
		checkpoint(digest: $digest) {
			sequenceNumber
			digest
			previousCheckpointDigest
			timestamp
			networkTotalTransactions
			epoch {
				epochId
				protocolConfigs {
					protocolVersion
				}
			}
		}
	}
`)

const transactionDocument = graphql(`
	query SuiTransaction($digest: String!) {
		transaction(digest: $digest) {
			digest
			sender {
				address
			}
			kind {
				__typename
			}
			gasInput {
				gasBudget
				gasPrice
			}
			effects {
				status
				effectsDigest
				timestamp
				gasEffects {
					gasSummary {
						computationCost
						storageCost
						storageRebate
						nonRefundableStorageFee
					}
				}
				checkpoint {
					sequenceNumber
				}
			}
		}
	}
`)

export const normalizeSuiAddress = (address: string) => {
	const match = /^0x([0-9a-f]{1,64})$/i.exec(address)
	if (match == null)
		throw new Error('Sui GraphQL address must be a 0x-prefixed hexadecimal address')

	return `0x${match[1].toLowerCase().padStart(64, '0')}`
}

const assertPageRequest = ({
	address,
	limit,
	after,
}: {
	address: string
	limit: number
	after?: string
}) => {
	normalizeSuiAddress(address)
	if (!Number.isSafeInteger(limit) || limit < 0 || limit > 50)
		throw new Error('Sui GraphQL page limit must be a safe integer from 0 through 50')
	if (after === '')
		throw new Error('Sui GraphQL page cursor must not be empty')
}

const pagination = (
	limit: number,
	after: string | undefined,
	pageInfo: {
		hasNextPage: boolean
		endCursor: string | null
	}
) => {
	if (pageInfo.hasNextPage && (pageInfo.endCursor == null || pageInfo.endCursor === ''))
		throw new Error('Sui GraphQL page is missing its next cursor')
	if (pageInfo.hasNextPage && pageInfo.endCursor === after)
		throw new Error('Sui GraphQL page did not advance its cursor')

	return {
		limit,
		...(after != null && { after }),
		...(pageInfo.hasNextPage && {
			nextAfter: pageInfo.endCursor,
		}),
	}
}

const bigintFromWire = (
	value: number | string,
	label: string
) => {
	try {
		const parsed = BigInt(value)
		if (parsed < 0n)
			throw new Error('negative')
		return parsed
	} catch {
		throw new Error(`Sui GraphQL: invalid ${label}`)
	}
}

const timestampMsFromWire = (
	value: string | null | undefined,
	label: string
) => {
	if (value == null)
		return undefined
	const timestampMs = Date.parse(value)
	if (!Number.isFinite(timestampMs))
		throw new Error(`Sui GraphQL: invalid ${label}`)
	return timestampMs
}

type SuiCheckpointWire = {
	sequenceNumber: number | string
	digest: string | null
	previousCheckpointDigest: string | null
	timestamp: string | null
	networkTotalTransactions: number | string | null
	epoch: {
		epochId: number | string
		protocolConfigs: {
			protocolVersion: number | string
		} | null
	} | null
}

const normalizeCheckpoint = (checkpoint: SuiCheckpointWire) => {
	if (checkpoint.digest == null || checkpoint.digest === '')
		throw new Error('Sui GraphQL checkpoint is missing digest')
	const sequence = bigintFromWire(checkpoint.sequenceNumber, 'checkpoint sequence')
	return {
		sequence,
		digest: checkpoint.digest,
		...(checkpoint.previousCheckpointDigest != null && checkpoint.previousCheckpointDigest !== '' && {
			previousDigest: checkpoint.previousCheckpointDigest,
		}),
		timestampMs: timestampMsFromWire(checkpoint.timestamp, 'checkpoint timestamp'),
		...(checkpoint.networkTotalTransactions != null && {
			totalTransactionCount: bigintFromWire(checkpoint.networkTotalTransactions, 'network total transactions'),
		}),
		...(checkpoint.epoch != null && {
			epoch: bigintFromWire(checkpoint.epoch.epochId, 'epoch id'),
			...(checkpoint.epoch.protocolConfigs != null && {
				protocolVersion: bigintFromWire(checkpoint.epoch.protocolConfigs.protocolVersion, 'protocol version'),
			}),
		}),
	}
}

export const getAddressBalances = async (
	{
		address,
		limit,
		after,
	}: {
		address: string
		limit: number
		after?: string
	}
) => {
	assertPageRequest({
		address,
		limit,
		after,
	})
	if (limit === 0)
		return {
			balances: [],
			pagination: {
				limit,
				...(after != null && { after }),
			},
		}

	const canonicalAddress = normalizeSuiAddress(address)
	const result = await executeSui(
		addressBalancesDocument,
		{
			address: canonicalAddress,
			first: limit,
			...(after != null && { after }),
		}
	)
	if (result.address == null || result.address.balances == null)
		throw new Error(`Sui GraphQL address balances did not find ${address}`)
	if (normalizeSuiAddress(result.address.address) !== canonicalAddress)
		throw new Error(`Sui GraphQL address balances returned a mismatched address for ${address}`)
	if (result.address.balances.nodes.length > limit)
		throw new Error('Sui GraphQL address balances exceeded the requested limit')

	const coinTypes = new Set<string>()
	return {
		balances: result.address.balances.nodes.map((balance) => {
			if (
				balance.coinType == null
				|| balance.coinType.repr.length === 0
				|| balance.totalBalance == null
				|| balance.coinBalance == null
				|| balance.addressBalance == null
			)
				throw new Error('Sui GraphQL address balances returned an incomplete balance')
			if (coinTypes.has(balance.coinType.repr))
				throw new Error('Sui GraphQL address balances returned a duplicate coin type')
			for (const amount of [
				balance.totalBalance,
				balance.coinBalance,
				balance.addressBalance,
			]) {
				try {
					if (BigInt(amount) < 0n)
						throw new Error('negative')
				}
				catch {
					throw new Error('Sui GraphQL address balances returned an invalid amount')
				}
			}

			coinTypes.add(balance.coinType.repr)

			return {
				coinType: balance.coinType,
				totalBalance: balance.totalBalance,
				coinBalance: balance.coinBalance,
				addressBalance: balance.addressBalance,
			}
		}),
		pagination: pagination(
			limit,
			after,
			result.address.balances.pageInfo
		),
	}
}

export const getAddressTransactions = async (
	{
		address,
		limit,
		after,
	}: {
		address: string
		limit: number
		after?: string
	}
) => {
	assertPageRequest({
		address,
		limit,
		after,
	})
	if (limit === 0)
		return {
			transactions: [],
			pagination: {
				limit,
				...(after != null && { after }),
			},
		}

	const canonicalAddress = normalizeSuiAddress(address)
	const result = await executeSui(
		addressTransactionsDocument,
		{
			address: canonicalAddress,
			first: limit,
			...(after != null && { after }),
		}
	)
	if (result.address == null || result.transactions == null)
		throw new Error(`Sui GraphQL address transactions did not find ${address}`)
	if (normalizeSuiAddress(result.address.address) !== canonicalAddress)
		throw new Error(`Sui GraphQL address transactions returned a mismatched address for ${address}`)
	if (result.transactions.nodes.length > limit)
		throw new Error('Sui GraphQL address transactions exceeded the requested limit')

	const digests = new Set<string>()
	for (const transaction of result.transactions.nodes) {
		if (transaction.digest.length === 0)
			throw new Error('Sui GraphQL address transactions returned an empty digest')
		if (digests.has(transaction.digest))
			throw new Error('Sui GraphQL address transactions returned a duplicate digest')
		if (transaction.sender != null)
			normalizeSuiAddress(transaction.sender.address)

		digests.add(transaction.digest)
	}

	return {
		transactions: result.transactions.nodes,
		pagination: pagination(
			limit,
			after,
			result.transactions.pageInfo
		),
	}
}

export const getRecentTransactions = async (
	{
		limit,
		after,
	}: {
		limit: number
		after?: string
	}
) => {
	if (!Number.isSafeInteger(limit) || limit < 0 || limit > 50)
		throw new Error('Sui GraphQL page limit must be a safe integer from 0 through 50')
	if (after === '')
		throw new Error('Sui GraphQL page cursor must not be empty')
	if (limit === 0)
		return {
			transactions: [],
			pagination: {
				limit,
				...(after != null && { after }),
			},
		}

	const result = await executeSui(
		recentTransactionsDocument,
		{
			first: limit,
			...(after != null && { after }),
		}
	)
	if (result.transactions == null)
		throw new Error('Sui GraphQL recent transactions are missing')
	if (result.transactions.nodes.length > limit)
		throw new Error('Sui GraphQL recent transactions exceeded the requested limit')

	const digests = new Set<string>()
	for (const transaction of result.transactions.nodes) {
		if (transaction.digest.length === 0)
			throw new Error('Sui GraphQL recent transactions returned an empty digest')
		if (digests.has(transaction.digest))
			throw new Error('Sui GraphQL recent transactions returned a duplicate digest')
		if (transaction.sender != null)
			normalizeSuiAddress(transaction.sender.address)

		digests.add(transaction.digest)
	}

	return {
		transactions: result.transactions.nodes.map((transaction) => ({
			digest: transaction.digest,
			...(transaction.sender != null && {
				sender: {
					address: normalizeSuiAddress(transaction.sender.address),
				},
			}),
		})),
		pagination: pagination(
			limit,
			after,
			result.transactions.pageInfo
		),
	}
}

export const getLatestCheckpoint = async () => {
	const result = await executeSui(latestCheckpointDocument, {})
	if (result.checkpoint == null)
		throw new Error('Sui GraphQL latest checkpoint is missing')
	return normalizeCheckpoint(result.checkpoint)
}

export const getCheckpointBySequence = async (sequence: bigint) => {
	if (sequence < 0n)
		throw new Error('Sui GraphQL checkpoint sequence must be nonnegative')
	const result = await executeSui(
		checkpointBySequenceDocument,
		{
			sequenceNumber: sequence.toString(),
		}
	)
	if (result.checkpoint == null)
		throw new Error(`Sui GraphQL checkpoint ${sequence.toString()} was not found`)
	const checkpoint = normalizeCheckpoint(result.checkpoint)
	if (checkpoint.sequence !== sequence)
		throw new Error(`Sui GraphQL checkpoint sequence mismatch for ${sequence.toString()}`)
	return checkpoint
}

export const getCheckpointByDigest = async (digest: string) => {
	if (digest.length === 0)
		throw new Error('Sui GraphQL checkpoint digest must not be empty')
	const result = await executeSui(
		checkpointByDigestDocument,
		{
			digest,
		}
	)
	if (result.checkpoint == null)
		throw new Error(`Sui GraphQL checkpoint ${digest} was not found`)
	const checkpoint = normalizeCheckpoint(result.checkpoint)
	if (checkpoint.digest !== digest)
		throw new Error(`Sui GraphQL checkpoint digest mismatch for ${digest}`)
	return checkpoint
}

export const getTransaction = async (digest: string) => {
	if (digest.length === 0)
		throw new Error('Sui GraphQL transaction digest must not be empty')
	const result = await executeSui(
		transactionDocument,
		{
			digest,
		}
	)
	if (result.transaction == null)
		throw new Error(`Sui GraphQL transaction ${digest} was not found`)
	if (result.transaction.digest !== digest)
		throw new Error(`Sui GraphQL transaction digest mismatch for ${digest}`)
	if (result.transaction.effects?.checkpoint == null)
		throw new Error(`Sui GraphQL transaction ${digest} is missing checkpoint effects`)

	const checkpointSequence = bigintFromWire(
		result.transaction.effects.checkpoint.sequenceNumber,
		'transaction checkpoint sequence'
	)
	const sender = (
		result.transaction.sender == null ?
			undefined
		:
			normalizeSuiAddress(result.transaction.sender.address)
	)
	const gasSummary = result.transaction.effects.gasEffects?.gasSummary

	return {
		digest: result.transaction.digest,
		...(sender != null && { sender }),
		...(result.transaction.kind != null && {
			transactionKind: result.transaction.kind.__typename,
		}),
		checkpointSequence,
		...(result.transaction.effects.status != null && {
			status: result.transaction.effects.status,
		}),
		...(result.transaction.effects.effectsDigest != null && result.transaction.effects.effectsDigest !== '' && {
			effectsDigest: result.transaction.effects.effectsDigest,
		}),
		timestampMs: timestampMsFromWire(result.transaction.effects.timestamp, 'transaction timestamp'),
		...(result.transaction.gasInput?.gasBudget != null && {
			gasBudget: bigintFromWire(result.transaction.gasInput.gasBudget, 'gas budget'),
		}),
		...(result.transaction.gasInput?.gasPrice != null && {
			gasPrice: bigintFromWire(result.transaction.gasInput.gasPrice, 'gas price'),
		}),
		...(gasSummary != null && {
			gasUsed: {
				...(gasSummary.computationCost != null && {
					computationCost: bigintFromWire(gasSummary.computationCost, 'computation cost').toString(),
				}),
				...(gasSummary.storageCost != null && {
					storageCost: bigintFromWire(gasSummary.storageCost, 'storage cost').toString(),
				}),
				...(gasSummary.storageRebate != null && {
					storageRebate: bigintFromWire(gasSummary.storageRebate, 'storage rebate').toString(),
				}),
				...(gasSummary.nonRefundableStorageFee != null && {
					nonRefundableStorageFee: bigintFromWire(gasSummary.nonRefundableStorageFee, 'non-refundable storage fee').toString(),
				}),
			},
		}),
	}
}
