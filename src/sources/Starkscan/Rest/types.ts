import { type as arktype } from 'arktype'

const feltHex = arktype('/^0[xX][\\da-fA-F]{1,64}$/')

export const starkscanFelt = feltHex.narrow((value, ctx) => {
	try {
		return BigInt(value) < 2n ** 251n || ctx.mustBe('a Starknet felt (< 2^251)')
	} catch {
		return ctx.mustBe('a Starknet felt (< 2^251)')
	}
})

const unsignedSafe = arktype(`number.integer >= 0 <= ${Number.MAX_SAFE_INTEGER}`)
const nonEmptyString = arktype('string > 0')
const isoClock = arktype('/^\\d{4}-\\d{2}-\\d{2}T/')
const nonnegativeDecimal = arktype('/^[0-9]+$/')
const optionalFelt = starkscanFelt.or(arktype.null)
const feltArray = starkscanFelt.array()

const blockGasPriceWire = arktype({
	priceInWei: nonnegativeDecimal.or(arktype.null),
	priceInFri: nonnegativeDecimal.or(arktype.null),
}).onUndeclaredKey('delete')

const blockTransactionWire = arktype({
	txHash: starkscanFelt,
	txIndex: unsignedSafe,
	txCursor: nonEmptyString,
	fromAddress: optionalFelt,
	toAddress: optionalFelt,
	'executionStatus?': arktype('string').or(arktype.null),
	'finalityStatus?': arktype('string').or(arktype.null),
}).onUndeclaredKey('delete')

export const starkscanBlockEnvelope = arktype({
	chainId: 'string',
	blockNumber: unsignedSafe,
	blockHash: starkscanFelt,
	parentHash: starkscanFelt,
	timestampIso: isoClock,
	txCount: unsignedSafe,
	rawObjectKey: nonEmptyString,
	stateRoot: optionalFelt,
	sequencerAddress: optionalFelt,
	'l1DataAvailabilityMode?': arktype('string').or(arktype.null),
	'starknetVersion?': arktype('string').or(arktype.null),
	l1GasPrice: blockGasPriceWire.or(arktype.null),
	l2GasPrice: blockGasPriceWire.or(arktype.null),
	l1DataGasPrice: blockGasPriceWire.or(arktype.null),
	transactions: blockTransactionWire.array(),
}).onUndeclaredKey('delete')

const transactionLogWire = arktype({
	logIndex: unsignedSafe,
	address: starkscanFelt,
	keys: feltArray,
	'topic0?': optionalFelt,
	'topic1?': optionalFelt,
	'topic2?': optionalFelt,
	'topic3?': optionalFelt,
	data: feltArray,
	decodingStatus: '"decoded" | "name_only" | "unknown"',
	'eventName?': arktype('string').or(arktype.null),
	'eventNameSource?': arktype('string').or(arktype.null),
	'eventNameUnavailableReason?': arktype('"event_time_class_epoch_unavailable"').or(arktype.null),
	'decodedFields?': 'unknown[]',
	'decodedFieldsSource?': arktype('string').or(arktype.null),
	'decodedFieldsUnavailableReason?': arktype('string').or(arktype.null),
}).onUndeclaredKey('delete')

const transactionReceiptWire = arktype({
	executionStatus: arktype('string').or(arktype.null),
	finalityStatus: arktype('string').or(arktype.null),
	gasUsed: nonnegativeDecimal.or(arktype.null),
	effectiveGasPrice: nonnegativeDecimal.or(arktype.null),
	revertReason: arktype('string').or(arktype.null),
}).onUndeclaredKey('delete')

const messagesCoverageWire = arktype({
	status: '"exact" | "partial" | "unavailable"',
	source: '"starknet_protocol_messages"',
	reasonCode: '"indexed_protocol_message_facts" | "no_matching_message_rows" | "message_not_found" | "message_detail_page_exhausted" | "message_facts_unavailable" | "message_detail_truncated" | "transaction_messages_truncated" | "query_timeout"',
	message: 'string',
}).onUndeclaredKey('delete')

export const starkscanTransactionEnvelope = arktype({
	chainId: 'string',
	blockNumber: unsignedSafe,
	'timestampIso?': isoClock.or(arktype.null),
	txIndex: unsignedSafe,
	txHash: starkscanFelt,
	txCursor: nonEmptyString,
	fromAddress: optionalFelt,
	toAddress: optionalFelt,
	'executionStatus?': arktype('string').or(arktype.null),
	'finalityStatus?': arktype('string').or(arktype.null),
	'txType?': arktype('string').or(arktype.null),
	rawObjectKey: nonEmptyString,
	receipt: transactionReceiptWire.or(arktype.null),
	logsTruncated: 'boolean',
	eventDecodingDegraded: 'boolean',
	logs: transactionLogWire.array(),
	calldata: feltArray,
	tokenTransfers: 'unknown[]',
	messages: 'unknown[]',
	messagesCoverage: messagesCoverageWire,
	bridgeIntent: arktype('object').or(arktype.null),
}).onUndeclaredKey('delete')

const classInstanceWire = arktype({
	address: starkscanFelt,
	'isAccount?': arktype('boolean').or(arktype.null),
	relationshipKind: '"deployed_as_class" | "current_class" | "abi_observed_class" | "historical_class_epoch" | "observed_class"',
	evidenceBlockNumber: unsignedSafe.or(arktype.null),
	evidenceTransactionHash: optionalFelt,
	'evidenceAtIso?': arktype('string').or(arktype.null),
	evidenceSource: 'string',
	deployedAtBlock: unsignedSafe.or(arktype.null),
	deployedAtTxHash: optionalFelt,
	deployedByAddress: optionalFelt,
	'createdOnIso?': arktype('string').or(arktype.null),
	observedAtBlock: unsignedSafe.or(arktype.null),
	'observedAtIso?': arktype('string').or(arktype.null),
	'observationSource?': arktype('string').or(arktype.null),
	source: 'string',
}).onUndeclaredKey('delete')

const classDirectoryWire = arktype({
	chainId: 'string',
	classHash: starkscanFelt,
	'classLabel?': arktype('string').or(arktype.null),
	'classLabelSource?': arktype('string').or(arktype.null),
	'verificationTier?': 'string',
	'originKind?': arktype('string').or(arktype.null),
	'originTransactionHash?': optionalFelt,
	'originatedAtBlock?': unsignedSafe.or(arktype.null),
	'originatedAtIso?': arktype('string').or(arktype.null),
	'originSource?': arktype('string').or(arktype.null),
	'originFinalityStatus?': arktype('string').or(arktype.null),
	'originRefreshedAtIso?': arktype('string').or(arktype.null),
	declarationTxHash: optionalFelt,
	declaredAtBlock: unsignedSafe.or(arktype.null),
	'declaredAtIso?': arktype('string').or(arktype.null),
	compiledClassHash: optionalFelt,
	'classKind?': arktype('string').or(arktype.null),
	'classVersion?': arktype('string').or(arktype.null),
	'abiAvailable?': 'boolean',
	'abiSource?': arktype('string').or(arktype.null),
	instanceCount: unsignedSafe,
	'currentInstanceCount?': unsignedSafe,
	'accountInstanceCount?': unsignedSafe,
	'contractInstanceCount?': unsignedSafe,
	'unknownInstanceCount?': unsignedSafe,
	'verifiedInstanceCount?': unsignedSafe,
	'firstSeenBlockNumber?': unsignedSafe.or(arktype.null),
	'usageAsOfBlock?': unsignedSafe.or(arktype.null),
	'firstSeenAtIso?': arktype('string').or(arktype.null),
	'sampleContractAddress?': optionalFelt,
	'source?': 'string',
	'usageRefreshedAtIso?': arktype('string').or(arktype.null),
	'refreshedAtIso?': arktype('string').or(arktype.null),
}).onUndeclaredKey('delete')

export const starkscanClassDetailEnvelope = arktype({
	class: classDirectoryWire,
	instances: classInstanceWire.array(),
	nextInstanceCursor: nonEmptyString.or(arktype.null),
}).onUndeclaredKey('delete')

const contractExistenceWire = arktype({
	status: '"not_deployed"',
	reasonCode: '"contract_not_found"',
	evidenceSource: '"finalized_class_hash_at"',
	observedBlockNumber: unsignedSafe,
	observedBlockHash: starkscanFelt,
	expiresAtIso: isoClock,
}).onUndeclaredKey('delete')

export const starkscanAddressSummaryEnvelope = arktype({
	address: starkscanFelt,
	totalActivityCount: unsignedSafe,
	latestActivityBlock: unsignedSafe.or(arktype.null),
	'activityCountExact?': arktype('boolean').or(arktype.null),
	'classHash?': optionalFelt,
	'isAccount?': arktype('boolean').or(arktype.null),
	'createdOnIso?': arktype('string').or(arktype.null),
	'deployedAtTxHash?': optionalFelt,
	'deployedByAddress?': optionalFelt,
	'contractExistence?': contractExistenceWire.or(arktype.null),
}).onUndeclaredKey('delete')

const addressTransactionWire = arktype({
	blockNumber: unsignedSafe,
	timestampIso: isoClock.or(arktype.null),
	txIndex: unsignedSafe,
	txHash: starkscanFelt,
	kinds: arktype('string').array(),
	'counterparty?': optionalFelt,
	'txType?': arktype('string').or(arktype.null),
	'executionStatus?': arktype('string').or(arktype.null),
	'finalityStatus?': arktype('string').or(arktype.null),
	fromAddress: optionalFelt,
	toAddress: optionalFelt,
	'primaryMethod?': arktype('string').or(arktype.null),
	'callCount?': unsignedSafe.or(arktype.null),
	'methodsDiffer?': arktype('boolean').or(arktype.null),
	'transferCount?': unsignedSafe.or(arktype.null),
	'topTransferTokenAddress?': optionalFelt,
	'topTransferAmount?': nonnegativeDecimal.or(arktype.null),
	'topTransferStandard?': arktype('string').or(arktype.null),
}).onUndeclaredKey('delete')

export const starkscanAddressTransactionPageEnvelope = arktype({
	items: addressTransactionWire.array(),
	nextCursor: nonEmptyString.or(arktype.null),
}).onUndeclaredKey('delete')

const tokenHoldingWire = arktype({
	tokenAddress: starkscanFelt,
	normalizedTokenAddress: starkscanFelt,
	indexedBalanceRaw: nonnegativeDecimal,
	symbol: arktype('string').or(arktype.null),
	name: arktype('string').or(arktype.null),
	decimals: unsignedSafe.or(arktype.null),
}).onUndeclaredKey('delete')

export const starkscanTokenHoldingsEnvelope = arktype({
	chainId: 'string',
	ownerAddress: starkscanFelt,
	items: tokenHoldingWire.array(),
	exact: 'boolean',
	truncated: 'boolean',
	completeness: arktype({
		exact: 'boolean',
		truncated: 'boolean',
		complete: 'boolean',
		reasonCode: '"complete" | "indexLag" | "boundedComputation" | "responseCap" | "metadataPending" | "degradedFallback" | "unknown"',
		reason: 'string',
		lagBlocks: unsignedSafe.or(arktype.null),
		capped: 'boolean',
		cap: unsignedSafe.or(arktype.null),
	}).onUndeclaredKey('delete'),
}).onUndeclaredKey('delete')

const contractEventWire = arktype({
	blockNumber: unsignedSafe,
	timestampIso: isoClock,
	txHash: starkscanFelt,
	txIndex: unsignedSafe,
	logIndex: unsignedSafe,
	address: starkscanFelt,
	keys: feltArray,
	'topic0?': optionalFelt,
	'topic1?': optionalFelt,
	'topic2?': optionalFelt,
	'topic3?': optionalFelt,
	data: feltArray,
	decodingStatus: '"decoded" | "name_only" | "unknown"',
	'eventName?': arktype('string').or(arktype.null),
	'eventNameSource?': arktype('string').or(arktype.null),
	'eventNameUnavailableReason?': arktype('"event_time_class_epoch_unavailable"').or(arktype.null),
	'decodedFields?': 'unknown[]',
	'decodedFieldsSource?': arktype('string').or(arktype.null),
	'decodedFieldsUnavailableReason?': arktype('string').or(arktype.null),
}).onUndeclaredKey('delete')

export const starkscanContractEventPageEnvelope = arktype({
	items: contractEventWire.array(),
	nextCursor: nonEmptyString.or(arktype.null),
	eventDecodingDegraded: 'boolean',
}).onUndeclaredKey('delete')
