import { TransportType } from '$/constants/TransportType.ts'
import { jsonRpc2 } from '$/sources/_shared/wire/JsonRpc2/client.ts'
import bindings from '$/sources/NearRpc/bindings.ts'
import { Source } from '$/sources/Source.ts'
import type {
	NearRpcAccount,
	NearRpcAccessKey,
	NearRpcAccessKeyList,
	NearRpcBlock,
	NearRpcChunk,
	NearRpcGasPrice,
	NearRpcReceipt,
	NearRpcStatus,
	NearRpcTransactionStatus,
	NearRpcValidators,
	NearRpcViewState,
} from '$/sources/NearRpc/JsonRpc/types.ts'
import { type as arktype } from 'arktype'

const nearAccessKeyPermissionWire = arktype("'FullAccess'").or(arktype({
	FunctionCall: {
		allowance: 'string | null',
		receiver_id: 'string',
		method_names: 'string[]',
	},
}))

const nearAccessKeyBodyWire = arktype({
	nonce: 'number.integer',
	permission: nearAccessKeyPermissionWire,
})

const nearAccessKeyWire = nearAccessKeyBodyWire.and(arktype({
	block_height: 'number.integer',
	block_hash: 'string',
}))

const nearActionWire = arktype({
	'CreateAccount?': arktype({}),
	'DeployContract?': arktype({
		code: 'string',
	}),
	'FunctionCall?': arktype({
		method_name: 'string',
		args: 'string',
		gas: 'number.integer',
		deposit: 'string',
	}),
	'Transfer?': arktype({
		deposit: 'string',
	}),
	'Stake?': arktype({
		stake: 'string',
		public_key: 'string',
	}),
	'AddKey?': arktype({
		public_key: 'string',
		access_key: nearAccessKeyBodyWire,
	}),
	'DeleteKey?': arktype({
		public_key: 'string',
	}),
	'DeleteAccount?': arktype({
		beneficiary_id: 'string',
	}),
	'Delegate?': arktype({
		delegate_action: {
			'sender_id?': 'string',
			'receiver_id?': 'string',
			actions: 'unknown[]',
			'nonce?': 'number.integer',
			'max_block_height?': 'number.integer',
			'public_key?': 'string',
		},
	}),
})

const nearTransactionWire = arktype({
	hash: 'string',
	signer_id: 'string',
	receiver_id: 'string',
	nonce: 'number.integer',
	actions: nearActionWire.array(),
})

const nearExecutionOutcomeStatusWire = arktype({
	'SuccessValue?': 'string',
	'SuccessReceiptId?': 'string',
	'Failure?': 'unknown',
	'Unknown?': 'unknown',
})

const nearExecutionOutcomeWire = arktype({
	id: 'string',
	outcome: {
		gas_burnt: 'number.integer',
		receipt_ids: 'string[]',
		status: nearExecutionOutcomeStatusWire,
		'executor_id?': 'string',
		'logs?': 'string[]',
		'tokens_burnt?': 'string',
	},
	'block_hash?': 'string',
})

const nearReceiptActionWire = arktype({
	Action: {
		signer_id: 'string',
		signer_public_key: 'string',
		gas_price: 'string',
		actions: nearActionWire.array(),
		input_data_ids: 'string[]',
		output_data_receivers: arktype({
			data_id: 'string',
			receiver_id: 'string',
		}).array(),
	},
})

const nearReceiptDataWire = arktype({
	Data: {
		data_id: 'string',
		data: 'string | null',
	},
})

const nearReceiptWire = arktype({
	predecessor_id: 'string',
	receiver_id: 'string',
	receipt_id: 'string',
	receipt: nearReceiptActionWire.or(nearReceiptDataWire),
})

const nearTransactionStatusWire = arktype({
	transaction: nearTransactionWire,
	receipts_outcome: nearExecutionOutcomeWire.array(),
	status: 'unknown',
	transaction_outcome: nearExecutionOutcomeWire,
	'receipts?': nearReceiptWire.array(),
})

const nearBlockWire = arktype({
	author: 'string',
	header: {
		height: 'number.integer',
		hash: 'string',
		prev_hash: 'string',
		epoch_id: 'string',
		timestamp_nanosec: 'string',
	},
	chunks: arktype({
		chunk_hash: 'string',
		shard_id: 'number.integer',
		gas_used: 'number.integer',
		height_included: 'number.integer',
	}).array(),
})

const nearAccountWire = arktype({
	amount: 'string',
	locked: 'string',
	code_hash: 'string',
	storage_usage: 'number.integer',
	storage_paid_at: 'number.integer',
	block_height: 'number.integer',
	block_hash: 'string',
})

const nearAccessKeyListWire = arktype({
	keys: arktype({
		public_key: 'string',
		access_key: nearAccessKeyBodyWire,
	}).array(),
	block_height: 'number.integer',
	block_hash: 'string',
})

const nearViewStateWire = arktype({
	block_hash: 'string',
	block_height: 'number.integer',
	values: arktype({
		key: 'string',
		value: 'string',
	}).array(),
	proof: 'unknown[]',
})

const nearStatusWire = arktype({
	chain_id: 'string',
	genesis_hash: 'string',
	latest_protocol_version: 'number.integer',
	protocol_version: 'number.integer',
	sync_info: {
		epoch_id: 'string',
		epoch_start_height: 'number.integer',
		latest_block_hash: 'string',
		latest_block_height: 'number.integer',
		latest_block_time: 'string',
		syncing: 'boolean',
	},
	version: {
		version: 'string',
		'build?': 'string',
		'commit?': 'string',
		'rustc_version?': 'string',
	},
})

const nearGasPriceWire = arktype({
	gas_price: 'string',
})

const nearValidatorStakeWire = arktype({
	account_id: 'string',
	public_key: 'string',
	stake: 'string',
	'validator_stake_struct_version?': 'string',
})

const nearNextValidatorWire = arktype({
	account_id: 'string',
	public_key: 'string',
	stake: 'string',
	shards: 'number.integer[]',
})

const nearCurrentValidatorWire = arktype({
	account_id: 'string',
	public_key: 'string',
	stake: 'string',
	is_slashed: 'boolean',
	shards: 'number.integer[]',
	num_expected_blocks: 'number.integer',
	num_produced_blocks: 'number.integer',
	'num_expected_chunks?': 'number.integer',
	'num_produced_chunks?': 'number.integer',
	'num_expected_endorsements?': 'number.integer',
	'num_produced_endorsements?': 'number.integer',
	'shards_endorsed?': 'number.integer[]',
})

const nearValidatorsWire = arktype({
	current_fishermen: nearValidatorStakeWire.array(),
	current_proposals: nearValidatorStakeWire.array(),
	current_validators: nearCurrentValidatorWire.array(),
	epoch_height: 'number.integer',
	epoch_start_height: 'number.integer',
	next_fishermen: nearValidatorStakeWire.array(),
	next_validators: nearNextValidatorWire.array(),
	prev_epoch_kickout: arktype({
		account_id: 'string',
		reason: 'unknown',
	}).array(),
})

const nearChunkWire = arktype({
	author: 'string',
	header: {
		chunk_hash: 'string',
		shard_id: 'number.integer',
		gas_used: 'number.integer',
		height_included: 'number.integer',
	},
	transactions: nearTransactionWire.array(),
})

const assertEnvelope = <_Value>(
	label: string,
	wire: { assert: (value: unknown) => _Value },
	response: unknown
) => {
	try {
		return wire.assert(response)
	} catch {
		throw new Error(`${Source.NearRpc_JsonRpc}: invalid ${label} response envelope`)
	}
}

export const nearRpc = (() => {
	const binding = bindings[Source.NearRpc_JsonRpc][0]
	const getBlock = async ({
	blockId,
}: {
	blockId: bigint | string | 'final'
}) => (
	assertEnvelope(
		'block',
		nearBlockWire,
		await jsonRpc2<unknown>(
			binding,
			'block',
			(
				blockId === 'final' ?
					{
						finality: 'final',
					}
				:
					{
						block_id: typeof blockId === 'bigint' ? Number(blockId) : blockId,
					}
			)
		)
	)
)

	const getTx = async ({
	txHash,
	senderAccountId,
}: {
	txHash: string
	senderAccountId: string
}) => {
	if (txHash === '' || senderAccountId === '')
		throw new Error(`${Source.NearRpc_JsonRpc}: transaction hash and signer are required`)

	return assertEnvelope(
		'tx',
		nearTransactionStatusWire,
		await jsonRpc2<unknown>(binding, 'tx', {
			tx_hash: txHash,
			sender_account_id: senderAccountId,
			wait_until: 'FINAL',
		})
	) as NearRpcTransactionStatus
}

	const getTxStatus = async ({
	txHash,
	senderAccountId,
}: {
	txHash: string
	senderAccountId: string
}) => {
	if (txHash === '' || senderAccountId === '')
		throw new Error(`${Source.NearRpc_JsonRpc}: transaction hash and signer are required`)

	return assertEnvelope(
		'tx status',
		nearTransactionStatusWire,
		await jsonRpc2<unknown>(binding, 'EXPERIMENTAL_tx_status', {
			tx_hash: txHash,
			sender_account_id: senderAccountId,
			wait_until: 'FINAL',
		})
	) as NearRpcTransactionStatus
}

	const getReceipt = async ({
	receiptId,
}: {
	receiptId: string
}) => {
	if (receiptId === '')
		throw new Error(`${Source.NearRpc_JsonRpc}: empty receipt id`)

	return assertEnvelope(
		'receipt',
		nearReceiptWire,
		await jsonRpc2<unknown>(binding, 'EXPERIMENTAL_receipt', {
			receipt_id: receiptId,
		})
	) as NearRpcReceipt
}

	const getChunk = async ({
	chunkHash,
}: {
	chunkHash: string
}) => {
	if (chunkHash === '')
		throw new Error(`${Source.NearRpc_JsonRpc}: empty chunk hash`)

	return assertEnvelope(
		'chunk',
		nearChunkWire,
		await jsonRpc2<unknown>(binding, 'chunk', {
			chunk_id: chunkHash,
		})
	) as NearRpcChunk
}

	const viewAccount = async ({
	accountId,
}: {
	accountId: string
}) => {
	if (accountId === '')
		throw new Error(`${Source.NearRpc_JsonRpc}: empty account id`)

	return assertEnvelope(
		'account',
		nearAccountWire,
		await jsonRpc2<unknown>(binding, 'query', {
			request_type: 'view_account',
			finality: 'final',
			account_id: accountId,
		})
	)
}

	const viewAccessKeyList = async ({
	accountId,
}: {
	accountId: string
}) => {
	if (accountId === '')
		throw new Error(`${Source.NearRpc_JsonRpc}: empty account id`)

	return assertEnvelope(
		'access key list',
		nearAccessKeyListWire,
		await jsonRpc2<unknown>(binding, 'query', {
			request_type: 'view_access_key_list',
			finality: 'final',
			account_id: accountId,
		})
	)
}

	const viewAccessKey = async ({
	accountId,
	publicKey,
}: {
	accountId: string
	publicKey: string
}) => {
	if (accountId === '' || publicKey === '')
		throw new Error(`${Source.NearRpc_JsonRpc}: account id and public key are required`)

	return assertEnvelope(
		'access key',
		nearAccessKeyWire,
		await jsonRpc2<unknown>(binding, 'query', {
			request_type: 'view_access_key',
			finality: 'final',
			account_id: accountId,
			public_key: publicKey,
		})
	) as NearRpcAccessKey
}

	const viewState = async ({
	accountId,
	prefixBase64,
	blockHeight,
}: {
	accountId: string
	prefixBase64: string
	blockHeight: number
}) => {
	if (accountId === '')
		throw new Error(`${Source.NearRpc_JsonRpc}: empty account id`)
	if (!Number.isSafeInteger(blockHeight) || blockHeight < 0)
		throw new Error(`${Source.NearRpc_JsonRpc}: invalid block height`)

	return assertEnvelope(
		'view state',
		nearViewStateWire,
		await jsonRpc2<unknown>(binding, 'query', {
			request_type: 'view_state',
			block_id: blockHeight,
			account_id: accountId,
			prefix_base64: prefixBase64,
		})
	) as NearRpcViewState
}

	const getValidators = async () => (
	assertEnvelope(
		'validators',
		nearValidatorsWire,
		await jsonRpc2<unknown>(binding, 'validators', [null])
	) as NearRpcValidators
)

	const getGasPrice = async () => (
	assertEnvelope(
		'gas price',
		nearGasPriceWire,
		await jsonRpc2<unknown>(binding, 'gas_price', [null])
	)
)

	const getStatus = async () => (
	assertEnvelope(
		'status',
		nearStatusWire,
		await jsonRpc2<unknown>(binding, 'status', [])
	)
)

	return {
		endpoints: binding.endpoints.map((endpoint) => ({
			url: endpoint.locator,
			transportType: TransportType.Http,
			providerName: 'NEAR',
		})),
		getBlock,
		getChunk,
		getGasPrice,
		getReceipt,
		getStatus,
		getTx,
		getTxStatus,
		getValidators,
		viewAccessKey,
		viewAccessKeyList,
		viewAccount,
		viewState,
	}
})()
