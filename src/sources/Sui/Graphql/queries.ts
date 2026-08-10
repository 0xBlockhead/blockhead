import bindings from '$/sources/Sui/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { ApiFamily } from '$/sources/SourceBinding.ts'
import {
	executeSui,
	graphql,
} from '$/sources/Sui/Graphql/client.ts'
const binding = bindings[Source.Sui].find(({ apiFamily }) => (
	apiFamily === ApiFamily.GraphqlHttp
))

if (binding == null)
	throw new Error('Sui GraphQL binding is missing')


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

const addressObjectsDocument = graphql(`
	query SuiAddressObjects($address: SuiAddress!, $first: Int!, $after: String) {
		address(address: $address) {
			address
			objects(first: $first, after: $after) {
				pageInfo {
					hasNextPage
					endCursor
				}
				nodes {
					address
					version
					digest
					asMoveObject {
						contents {
							type {
								repr
							}
						}
					}
				}
			}
		}
	}
`)

const objectDocument = graphql(`
	query SuiObject($address: SuiAddress!) {
		object(address: $address) {
			address
			version
			digest
			storageRebate
			previousTransaction {
				digest
			}
			owner {
				__typename
				... on AddressOwner {
					address {
						address
					}
				}
				... on ObjectOwner {
					address {
						address
					}
				}
				... on Shared {
					initialSharedVersion
				}
				... on ConsensusAddressOwner {
					address {
						address
					}
					startVersion
				}
			}
			asMoveObject {
				contents {
					type {
						repr
					}
					json
				}
			}
			asMovePackage {
				address
				version
				digest
			}
		}
	}
`)

const coinMetadataDocument = graphql(`
	query SuiCoinMetadata($coinType: String!) {
		coinMetadata(coinType: $coinType) {
			address
			decimals
			symbol
			name
			description
			iconUrl
			regulatedState
			allowGlobalPause
			denyCap {
				address
				version
				digest
			}
		}
	}
`)

const packageDocument = graphql(`
	query SuiPackage(
		$address: SuiAddress!
		$moduleFirst: Int!
		$moduleAfter: String
	) {
		package(address: $address) {
			address
			version
			digest
			modules(
				first: $moduleFirst
				after: $moduleAfter
			) {
				pageInfo {
					hasNextPage
					endCursor
				}
				nodes {
					name
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
				... on ProgrammableTransaction {
					commands(first: 50) {
						nodes {
							__typename
							... on MoveCallCommand {
								function {
									name
									module {
										name
										package {
											address
										}
									}
								}
								arguments {
									__typename
									... on GasCoin {
										_
									}
									... on Input {
										ix
									}
									... on TxResult {
										cmd
										ix
									}
								}
							}
							... on TransferObjectsCommand {
								inputs {
									__typename
									... on GasCoin {
										_
									}
									... on Input {
										ix
									}
									... on TxResult {
										cmd
										ix
									}
								}
								address {
									__typename
									... on GasCoin {
										_
									}
									... on Input {
										ix
									}
									... on TxResult {
										cmd
										ix
									}
								}
							}
							... on SplitCoinsCommand {
								coin {
									__typename
									... on GasCoin {
										_
									}
									... on Input {
										ix
									}
									... on TxResult {
										cmd
										ix
									}
								}
								amounts {
									__typename
									... on GasCoin {
										_
									}
									... on Input {
										ix
									}
									... on TxResult {
										cmd
										ix
									}
								}
							}
							... on MergeCoinsCommand {
								coin {
									__typename
									... on GasCoin {
										_
									}
									... on Input {
										ix
									}
									... on TxResult {
										cmd
										ix
									}
								}
								coins {
									__typename
									... on GasCoin {
										_
									}
									... on Input {
										ix
									}
									... on TxResult {
										cmd
										ix
									}
								}
							}
							... on MakeMoveVecCommand {
								type {
									repr
								}
								elements {
									__typename
									... on GasCoin {
										_
									}
									... on Input {
										ix
									}
									... on TxResult {
										cmd
										ix
									}
								}
							}
							... on PublishCommand {
								modules
								dependencies
							}
							... on UpgradeCommand {
								modules
								dependencies
								currentPackage
								upgradeTicket {
									__typename
									... on GasCoin {
										_
									}
									... on Input {
										ix
									}
									... on TxResult {
										cmd
										ix
									}
								}
							}
						}
					}
				}
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
				balanceChanges(first: 50) {
					nodes {
						owner {
							address
						}
						coinType {
							repr
						}
						amount
					}
				}
				objectChanges(first: 50) {
					nodes {
						address
						idCreated
						idDeleted
						outputState {
							version
							digest
							asMoveObject {
								contents {
									type {
										repr
									}
								}
							}
							owner {
								__typename
								... on AddressOwner {
									address {
										address
									}
								}
								... on ObjectOwner {
									address {
										address
									}
								}
								... on Shared {
									initialSharedVersion
								}
								... on ConsensusAddressOwner {
									address {
										address
									}
									startVersion
								}
							}
						}
					}
				}
				events(first: 50) {
					nodes {
						sequenceNumber
						sender {
							address
						}
						contents {
							type {
								repr
							}
							json
						}
						transactionModule {
							name
							package {
								address
							}
						}
					}
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
		binding,
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
		binding,
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
		binding,
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
	const result = await executeSui(binding, latestCheckpointDocument, {})
	if (result.checkpoint == null)
		throw new Error('Sui GraphQL latest checkpoint is missing')
	return normalizeCheckpoint(result.checkpoint)
}

export const getCheckpointBySequence = async (sequence: bigint) => {
	if (sequence < 0n)
		throw new Error('Sui GraphQL checkpoint sequence must be nonnegative')
	const result = await executeSui(
		binding,
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
		binding,
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

const ownerSelectorFromWire = (
	owner: {
		__typename: string
		address?: {
			address: string
		} | null
		initialSharedVersion?: number | string | null
		startVersion?: number | string | null
	} | null | undefined
) => {
	if (owner == null)
		return undefined
	if (owner.__typename === 'AddressOwner' || owner.__typename === 'ObjectOwner' || owner.__typename === 'ConsensusAddressOwner') {
		if (owner.address == null)
			throw new Error(`Sui GraphQL: ${owner.__typename} is missing address`)
		return {
			kind: owner.__typename,
			address: normalizeSuiAddress(owner.address.address),
			...(owner.__typename === 'ConsensusAddressOwner' && owner.startVersion != null && {
				startVersion: bigintFromWire(owner.startVersion, 'consensus owner start version'),
			}),
		}
	}
	if (owner.__typename === 'Shared') {
		return {
			kind: 'Shared',
			...(owner.initialSharedVersion != null && {
				initialSharedVersion: bigintFromWire(owner.initialSharedVersion, 'shared initial version'),
			}),
		}
	}
	return {
		kind: owner.__typename,
	}
}

const signedBigintFromWire = (
	value: string | number | null | undefined,
	label: string
) => {
	if (value == null)
		throw new Error(`Sui GraphQL: missing ${label}`)
	try {
		return BigInt(value)
	} catch {
		throw new Error(`Sui GraphQL: invalid ${label}`)
	}
}

const transactionArgumentFromWire = (
	argument: {
		__typename: string
		_?: boolean | null
		ix?: number | null
		cmd?: number | null
	}
) => {
	if (argument.__typename === 'GasCoin')
		return {
			kind: 'GasCoin',
		}
	if (argument.__typename === 'Input') {
		if (argument.ix == null)
			throw new Error('Sui GraphQL Input argument is missing ix')
		return {
			kind: 'Input',
			ix: argument.ix,
		}
	}
	if (argument.__typename === 'TxResult') {
		if (argument.cmd == null)
			throw new Error('Sui GraphQL TxResult argument is missing cmd')
		return {
			kind: 'TxResult',
			cmd: argument.cmd,
			...(argument.ix != null && {
				ix: argument.ix,
			}),
		}
	}
	return {
		kind: argument.__typename,
	}
}

export const getTransaction = async (digest: string) => {
	if (digest.length === 0)
		throw new Error('Sui GraphQL transaction digest must not be empty')
	const result = await executeSui(
		binding,
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

	const effects = result.transaction.effects
	const checkpointSequence = bigintFromWire(
		effects.checkpoint.sequenceNumber,
		'transaction checkpoint sequence'
	)
	const sender = (
		result.transaction.sender == null ?
			undefined
		:
			normalizeSuiAddress(result.transaction.sender.address)
	)
	const gasSummary = effects.gasEffects?.gasSummary
	const kind = result.transaction.kind
	const commands = (
		kind != null && kind.__typename === 'ProgrammableTransaction' && 'commands' in kind && kind.commands != null ?
			kind.commands.nodes.map((command, commandIndex) => {
				const typeArguments = [] as string[]
				if (command.__typename === 'MoveCallCommand' && 'function' in command) {
					const moveFunction = command.function
					const packageAddress = moveFunction.module.package?.address
					if (packageAddress == null || packageAddress === '')
						throw new Error('Sui GraphQL MoveCallCommand is missing package address')
					return {
						commandIndex,
						commandKind: command.__typename,
						packageId: normalizeSuiAddress(packageAddress),
						moduleName: moveFunction.module.name,
						functionName: moveFunction.name,
						typeArguments,
						arguments: command.arguments.map(transactionArgumentFromWire),
					}
				}
				if (command.__typename === 'TransferObjectsCommand' && 'inputs' in command) {
					return {
						commandIndex,
						commandKind: command.__typename,
						typeArguments,
						arguments: {
							inputs: command.inputs.map(transactionArgumentFromWire),
							...(command.address != null && {
								address: transactionArgumentFromWire(command.address),
							}),
						},
					}
				}
				if (command.__typename === 'SplitCoinsCommand' && 'amounts' in command) {
					return {
						commandIndex,
						commandKind: command.__typename,
						typeArguments,
						arguments: {
							...(command.coin != null && {
								coin: transactionArgumentFromWire(command.coin),
							}),
							amounts: command.amounts.map(transactionArgumentFromWire),
						},
					}
				}
				if (command.__typename === 'MergeCoinsCommand' && 'coins' in command) {
					return {
						commandIndex,
						commandKind: command.__typename,
						typeArguments,
						arguments: {
							...(command.coin != null && {
								coin: transactionArgumentFromWire(command.coin),
							}),
							coins: command.coins.map(transactionArgumentFromWire),
						},
					}
				}
				if (command.__typename === 'MakeMoveVecCommand') {
					return {
						commandIndex,
						commandKind: command.__typename,
						typeArguments,
						arguments: {
							...('type' in command && command.type != null && {
								type: command.type.repr,
							}),
							...('elements' in command && command.elements != null && {
								elements: command.elements.map(transactionArgumentFromWire),
							}),
						},
					}
				}
				if (command.__typename === 'PublishCommand' && 'modules' in command) {
					return {
						commandIndex,
						commandKind: command.__typename,
						typeArguments,
						arguments: {
							modules: command.modules ?? [],
							dependencies: (command.dependencies ?? []).map((dependency) => normalizeSuiAddress(dependency)),
						},
					}
				}
				if (command.__typename === 'UpgradeCommand' && 'modules' in command) {
					return {
						commandIndex,
						commandKind: command.__typename,
						typeArguments,
						arguments: {
							modules: command.modules ?? [],
							dependencies: (command.dependencies ?? []).map((dependency) => normalizeSuiAddress(dependency)),
							...(command.currentPackage != null && command.currentPackage !== '' && {
								currentPackage: normalizeSuiAddress(command.currentPackage),
							}),
							...(command.upgradeTicket != null && {
								upgradeTicket: transactionArgumentFromWire(command.upgradeTicket),
							}),
						},
					}
				}
				return {
					commandIndex,
					commandKind: command.__typename,
					typeArguments,
				}
			})
		:
			[]
	)

	const balanceChanges = (effects.balanceChanges?.nodes ?? []).map((change, changeIndex) => {
		if (change.coinType == null || change.coinType.repr.length === 0)
			throw new Error('Sui GraphQL balance change is missing coin type')
		return {
			changeIndex,
			...(change.owner != null && {
				ownerSelector: {
					kind: 'Address',
					address: normalizeSuiAddress(change.owner.address),
				},
			}),
			coinType: change.coinType.repr,
			amountDelta: signedBigintFromWire(change.amount, 'balance change amount'),
		}
	})

	const objectChanges = (effects.objectChanges?.nodes ?? []).map((change, changeIndex) => {
		if (change.address.length === 0)
			throw new Error('Sui GraphQL object change is missing object id')
		const output = change.outputState
		const objectType = output?.asMoveObject?.contents?.type?.repr
		const changeKind = (
			change.idCreated === true ?
				'Created'
			: change.idDeleted === true ?
				'Deleted'
			:
				'Mutated'
		)
		return {
			changeIndex,
			changeKind,
			objectId: normalizeSuiAddress(change.address),
			...(objectType != null && objectType !== '' && { objectType }),
			...(output?.owner != null && {
				ownerSelector: ownerSelectorFromWire(output.owner),
			}),
			...(output?.version != null && {
				version: bigintFromWire(output.version, 'object version'),
			}),
			...(output?.digest != null && output.digest !== '' && {
				digest: output.digest,
			}),
		}
	})

	const eventIndexes = new Set<number>()
	const events = (effects.events?.nodes ?? []).map((event) => {
		const eventType = event.contents?.type?.repr
		if (eventType == null || eventType === '')
			throw new Error('Sui GraphQL event is missing type')
		const eventIndex = Number(event.sequenceNumber)
		if (!Number.isSafeInteger(eventIndex) || eventIndex < 0)
			throw new Error('Sui GraphQL event has an invalid sequence number')
		if (eventIndexes.has(eventIndex))
			throw new Error('Sui GraphQL transaction returned a duplicate event sequence number')
		eventIndexes.add(eventIndex)
		const packageAddress = event.transactionModule?.package?.address
		return {
			eventIndex,
			eventType,
			...(packageAddress != null && packageAddress !== '' && {
				packageId: normalizeSuiAddress(packageAddress),
			}),
			...(event.transactionModule != null && {
				moduleName: event.transactionModule.name,
			}),
			...(event.sender != null && {
				sender: normalizeSuiAddress(event.sender.address),
			}),
			...(event.contents?.json != null && {
				value: event.contents.json,
			}),
		}
	})

	return {
		digest: result.transaction.digest,
		...(sender != null && { sender }),
		...(kind != null && {
			transactionKind: kind.__typename,
		}),
		checkpointSequence,
		...(effects.status != null && {
			status: effects.status,
		}),
		...(effects.effectsDigest != null && effects.effectsDigest !== '' && {
			effectsDigest: effects.effectsDigest,
		}),
		timestampMs: timestampMsFromWire(effects.timestamp, 'transaction timestamp'),
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
		commands,
		balanceChanges,
		objectChanges,
		events,
	}
}


export const getAddressObjects = async ({
	address,
	limit,
	after,
}: {
	address: string
	limit: number
	after?: string
}) => {
	assertPageRequest({
		address,
		limit,
		after,
	})
	if (limit === 0)
		return {
			objects: [],
			pagination: {
				limit,
				...(after != null && { after }),
			},
		}

	const canonicalAddress = normalizeSuiAddress(address)
	const result = await executeSui(
		binding,
		addressObjectsDocument,
		{
			address: canonicalAddress,
			first: limit,
			...(after != null && { after }),
		}
	)
	if (result.address == null || result.address.objects == null)
		throw new Error(`Sui GraphQL address objects did not find ${address}`)
	if (normalizeSuiAddress(result.address.address) !== canonicalAddress)
		throw new Error(`Sui GraphQL address objects returned a mismatched address for ${address}`)
	if (result.address.objects.nodes.length > limit)
		throw new Error('Sui GraphQL address objects exceeded the requested limit')

	const objectIds = new Set<string>()
	return {
		objects: result.address.objects.nodes.map((object) => {
			const objectId = normalizeSuiAddress(object.address)
			if (objectIds.has(objectId))
				throw new Error('Sui GraphQL address objects returned a duplicate object id')
			objectIds.add(objectId)
			if (object.version == null)
				throw new Error('Sui GraphQL address object is missing version')
			if (object.digest == null || object.digest === '')
				throw new Error('Sui GraphQL address object is missing digest')
			const objectType = object.asMoveObject?.contents?.type?.repr
			return {
				objectId,
				version: bigintFromWire(object.version, 'object version'),
				digest: object.digest,
				...(objectType != null && objectType !== '' && {
					objectType,
				}),
			}
		}),
		pagination: pagination(
			limit,
			after,
			result.address.objects.pageInfo
		),
	}
}

export const getObject = async (objectId: string) => {
	const address = normalizeSuiAddress(objectId)
	const result = await executeSui(
		binding,
		objectDocument,
		{
			address,
		}
	)
	if (result.object == null)
		throw new Error(`Sui GraphQL object ${address} was not found`)
	if (normalizeSuiAddress(result.object.address) !== address)
		throw new Error(`Sui GraphQL object address mismatch for ${address}`)
	if (result.object.version == null)
		throw new Error(`Sui GraphQL object ${address} is missing version`)
	if (result.object.digest == null || result.object.digest === '')
		throw new Error(`Sui GraphQL object ${address} is missing digest`)
	const objectType = result.object.asMoveObject?.contents?.type?.repr
	return {
		objectId: address,
		version: bigintFromWire(result.object.version, 'object version'),
		digest: result.object.digest,
		...(result.object.owner != null && {
			ownerSelector: ownerSelectorFromWire(result.object.owner),
		}),
		...(objectType != null && objectType !== '' && {
			objectType,
		}),
		...(result.object.previousTransaction != null && {
			previousTransaction: result.object.previousTransaction.digest,
		}),
		...(result.object.storageRebate != null && {
			storageRebate: bigintFromWire(result.object.storageRebate, 'storage rebate'),
		}),
		...(result.object.asMoveObject?.contents?.json != null && {
			contents: result.object.asMoveObject.contents.json,
		}),
		...(result.object.asMovePackage != null && {
			packageId: normalizeSuiAddress(result.object.asMovePackage.address),
			...(result.object.asMovePackage.version != null && {
				packageVersion: bigintFromWire(result.object.asMovePackage.version, 'package version'),
			}),
			...(result.object.asMovePackage.digest != null && result.object.asMovePackage.digest !== '' && {
				packageDigest: result.object.asMovePackage.digest,
			}),
		}),
	}
}

export const getCoinMetadata = async (coinType: string) => {
	if (coinType.length === 0)
		throw new Error('Sui GraphQL coin type must not be empty')
	const result = await executeSui(
		binding,
		coinMetadataDocument,
		{
			coinType,
		}
	)
	if (result.coinMetadata == null)
		throw new Error(`Sui GraphQL coin metadata for ${coinType} was not found`)
	return {
		coinType,
		fetchedAtMs: Date.now(),
		metadataObjectId: normalizeSuiAddress(result.coinMetadata.address),
		...(result.coinMetadata.decimals != null && {
			decimals: result.coinMetadata.decimals,
		}),
		...(result.coinMetadata.symbol != null && result.coinMetadata.symbol !== '' && {
			symbol: result.coinMetadata.symbol,
		}),
		...(result.coinMetadata.name != null && result.coinMetadata.name !== '' && {
			name: result.coinMetadata.name,
		}),
		...(result.coinMetadata.description != null && result.coinMetadata.description !== '' && {
			description: result.coinMetadata.description,
		}),
		...(result.coinMetadata.iconUrl != null && result.coinMetadata.iconUrl !== '' && {
			iconUrl: result.coinMetadata.iconUrl,
		}),
		...(result.coinMetadata.regulatedState != null && {
			regulatedState: result.coinMetadata.regulatedState,
		}),
		...(result.coinMetadata.allowGlobalPause != null && {
			allowGlobalPause: result.coinMetadata.allowGlobalPause,
		}),
		...(result.coinMetadata.denyCap != null && {
			denyCap: {
				objectId: normalizeSuiAddress(result.coinMetadata.denyCap.address),
				...(result.coinMetadata.denyCap.version != null && {
					version: bigintFromWire(result.coinMetadata.denyCap.version, 'coin deny cap version'),
				}),
				...(result.coinMetadata.denyCap.digest != null && result.coinMetadata.denyCap.digest !== '' && {
					digest: result.coinMetadata.denyCap.digest,
				}),
			},
		}),
	}
}

export const getPackage = async ({
	packageId,
	moduleLimit,
	moduleAfter,
}: {
	packageId: string
	moduleLimit: number
	moduleAfter?: string
}) => {
	const address = normalizeSuiAddress(packageId)
	assertPageRequest({
		address,
		limit: moduleLimit,
		after: moduleAfter,
	})
	const result = await executeSui(
		binding,
		packageDocument,
		{
			address,
			moduleFirst: moduleLimit,
			...(moduleAfter != null && { moduleAfter }),
		}
	)
	if (result.package == null)
		throw new Error(`Sui GraphQL package ${address} was not found`)
	if (normalizeSuiAddress(result.package.address) !== address)
		throw new Error(`Sui GraphQL package address mismatch for ${address}`)
	if (result.package.version == null)
		throw new Error(`Sui GraphQL package ${address} is missing version`)
	if (result.package.digest == null || result.package.digest === '')
		throw new Error(`Sui GraphQL package ${address} is missing digest`)
	if (result.package.modules != null && result.package.modules.nodes.length > moduleLimit)
		throw new Error('Sui GraphQL package modules exceeded the requested limit')
	const moduleNamesSeen = new Set<string>()
	const moduleNames = (result.package.modules?.nodes ?? []).map((module) => {
		if (module.name.length === 0)
			throw new Error('Sui GraphQL package module name must not be empty')
		if (moduleNamesSeen.has(module.name))
			throw new Error('Sui GraphQL package returned a duplicate module name')
		moduleNamesSeen.add(module.name)
		return module.name
	})
	return {
		packageId: address,
		version: bigintFromWire(result.package.version, 'package version'),
		digest: result.package.digest,
		moduleNames,
		modulePagination: (
			result.package.modules == null ?
				{
					limit: moduleLimit,
					...(moduleAfter != null && { after: moduleAfter }),
				}
			:
				pagination(
					moduleLimit,
					moduleAfter,
					result.package.modules.pageInfo
				)
		),
	}
}
