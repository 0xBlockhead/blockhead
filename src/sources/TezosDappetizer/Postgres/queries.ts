import { postgresQueryRequest } from '$/sources/_shared/wire/Postgres/client.ts'
import bindings from '$/sources/TezosDappetizer/bindings.ts'
import { Source } from '$/sources/Source.ts'
import {
	bigintFromWire,
	dappetizerActionWire,
	dappetizerBalanceWire,
	dappetizerBlockWire,
	dappetizerContractWire,
	dappetizerSettingsWire,
	dappetizerTokenWire,
	timestampMsFromWire,
	type DappetizerAction,
	type DappetizerBalance,
	type DappetizerBlock,
	type DappetizerContract,
	type DappetizerSettings,
	type DappetizerToken,
} from '$/sources/TezosDappetizer/Postgres/types.ts'


export type TezosDappetizerSqlExecutor = (
	sql: string,
	values?: readonly (string | number | boolean | null)[]
) => Promise<unknown[]>

let sqlExecutor: TezosDappetizerSqlExecutor | undefined

export const setTezosDappetizerSqlExecutor = (
	executor: TezosDappetizerSqlExecutor | undefined
) => {
	sqlExecutor = executor
}

const binding = bindings[Source.TezosDappetizer_Postgres][0]

const omitUndefinedJson = (
	value: unknown
): unknown => {
	if (Array.isArray(value))
		return value.map(omitUndefinedJson)
	if (value != null && typeof value === 'object' && !(value instanceof Date))
		return Object.fromEntries(
			Object.entries(value)
				.filter(([, entry]) => entry !== undefined)
				.map(([key, entry]) => [
					key,
					omitUndefinedJson(entry),
				])
		)
	return value
}

const assertEnvelope = <_Value>(
	label: string,
	wire: { assert: (value: unknown) => _Value },
	response: unknown
) => {
	try {
		return wire.assert(omitUndefinedJson(response))
	} catch {
		throw new Error(`TezosDappetizer_Postgres: invalid ${label} response envelope`)
	}
}

const assertPage = (
	offset: number,
	limit: number,
	label: string
) => {
	if (!Number.isSafeInteger(offset) || offset < 0)
		throw new Error(`TezosDappetizer_Postgres: ${label} offset must be a nonnegative safe integer`)
	if (!Number.isSafeInteger(limit) || limit < 1 || limit > 1_000)
		throw new Error(`TezosDappetizer_Postgres: ${label} limit must be a safe integer from 1 through 1000`)
}

const queryRows = async (
	sql: string,
	values: readonly (string | number | boolean | null)[] = []
) => {
	if (sqlExecutor == null)
		throw new Error('TezosDappetizer_Postgres: SQL executor not configured (ServerOnly RuntimeSecret DSN)')

	postgresQueryRequest(binding, {
		sql,
		values: [...values],
	})

	const rows = await sqlExecutor(sql, values)
	if (!Array.isArray(rows))
		throw new Error('TezosDappetizer_Postgres: SQL executor must return a row array')
	return rows
}


export const getSettings = async (): Promise<DappetizerSettings> => (
	assertEnvelope(
		'settings',
		dappetizerSettingsWire,
		(
			await queryRows(
				`
					SELECT chain_id AS "chainId"
					FROM dappetizer_settings
					LIMIT 1
				`
			)
		)[0]
	)
)

export const getBlockByLevel = async ({
	level,
}: {
	level: number
}): Promise<DappetizerBlock> => {
	if (!Number.isSafeInteger(level) || level < 0)
		throw new Error(`TezosDappetizer_Postgres: unsupported block level ${level}`)

	const row = (
		await queryRows(
			`
				SELECT
					hash,
					predecessor,
					level,
					timestamp
				FROM block
				WHERE level = $1
				LIMIT 1
			`,
			[level]
		)
	)[0]
	if (row == null)
		throw new Error(`TezosDappetizer_Postgres: block level ${level} not found`)

	const block = assertEnvelope('block', dappetizerBlockWire, row)
	if (block.level !== level)
		throw new Error(`TezosDappetizer_Postgres: block response level ${block.level} does not match ${level}`)
	timestampMsFromWire(block.timestamp)
	return block
}

export const getBlockByHash = async ({
	hash,
}: {
	hash: string
}): Promise<DappetizerBlock> => {
	if (hash.length === 0)
		throw new Error('TezosDappetizer_Postgres: empty block hash')

	const row = (
		await queryRows(
			`
				SELECT
					hash,
					predecessor,
					level,
					timestamp
				FROM block
				WHERE hash = $1
				LIMIT 1
			`,
			[hash]
		)
	)[0]
	if (row == null)
		throw new Error(`TezosDappetizer_Postgres: block hash ${hash} not found`)

	const block = assertEnvelope('block', dappetizerBlockWire, row)
	if (block.hash !== hash)
		throw new Error('TezosDappetizer_Postgres: block response hash does not match the subject')
	timestampMsFromWire(block.timestamp)
	return block
}

export const listBlocks = async ({
	offset = 0,
	limit = 100,
}: {
	offset?: number
	limit?: number
} = {}): Promise<DappetizerBlock[]> => {
	assertPage(offset, limit, 'blocks')
	return (
		await queryRows(
			`
				SELECT
					hash,
					predecessor,
					level,
					timestamp
				FROM block
				ORDER BY level DESC
				OFFSET $1
				LIMIT $2
			`,
			[
				offset,
				limit,
			]
		)
	).map((row) => {
		const block = assertEnvelope('block', dappetizerBlockWire, row)
		timestampMsFromWire(block.timestamp)
		return block
	})
}

export const getContract = async ({
	address,
}: {
	address: string
}): Promise<DappetizerContract> => {
	if (address.length === 0)
		throw new Error('TezosDappetizer_Postgres: empty contract address')

	const row = (
		await queryRows(
			`
				SELECT
					address,
					name,
					description,
					first_operation_group_hash AS "firstOperationGroupHash",
					first_block_hash AS "firstBlockHash"
				FROM contract
				WHERE address = $1
				LIMIT 1
			`,
			[address]
		)
	)[0]
	if (row == null)
		throw new Error(`TezosDappetizer_Postgres: contract ${address} not found`)

	const contract = assertEnvelope('contract', dappetizerContractWire, row)
	if (contract.address !== address)
		throw new Error('TezosDappetizer_Postgres: contract response does not match the subject')
	return contract
}

export const listContracts = async ({
	offset = 0,
	limit = 100,
}: {
	offset?: number
	limit?: number
} = {}): Promise<DappetizerContract[]> => {
	assertPage(offset, limit, 'contracts')
	return (
		await queryRows(
			`
				SELECT
					address,
					name,
					description,
					first_operation_group_hash AS "firstOperationGroupHash",
					first_block_hash AS "firstBlockHash"
				FROM contract
				ORDER BY address ASC
				OFFSET $1
				LIMIT $2
			`,
			[
				offset,
				limit,
			]
		)
	).map((row) => assertEnvelope('contract', dappetizerContractWire, row))
}

export const getToken = async ({
	contractAddress,
	tokenId,
}: {
	contractAddress: string
	tokenId: bigint
}): Promise<DappetizerToken> => {
	if (contractAddress.length === 0)
		throw new Error('TezosDappetizer_Postgres: empty token contract address')
	if (tokenId < 0n || tokenId > BigInt(Number.MAX_SAFE_INTEGER))
		throw new Error(`TezosDappetizer_Postgres: unsupported token id ${tokenId.toString()}`)

	const row = (
		await queryRows(
			`
				SELECT
					id,
					contract_address AS "contractAddress",
					name,
					symbol,
					decimals,
					first_operation_group_hash AS "firstOperationGroupHash",
					first_block_hash AS "firstBlockHash"
				FROM token
				WHERE contract_address = $1
					AND id = $2
				LIMIT 1
			`,
			[
				contractAddress,
				tokenId.toString(),
			]
		)
	)[0]
	if (row == null)
		throw new Error(`TezosDappetizer_Postgres: token ${contractAddress}/${tokenId.toString()} not found`)

	const token = assertEnvelope('token', dappetizerTokenWire, row)
	if (token.contractAddress !== contractAddress)
		throw new Error('TezosDappetizer_Postgres: token contract address does not match the subject')
	if (bigintFromWire(token.id, 'token id') !== tokenId)
		throw new Error('TezosDappetizer_Postgres: token id does not match the subject')
	return token
}

export const listTokens = async ({
	offset = 0,
	limit = 100,
}: {
	offset?: number
	limit?: number
} = {}): Promise<DappetizerToken[]> => {
	assertPage(offset, limit, 'tokens')
	return (
		await queryRows(
			`
				SELECT
					id,
					contract_address AS "contractAddress",
					name,
					symbol,
					decimals,
					first_operation_group_hash AS "firstOperationGroupHash",
					first_block_hash AS "firstBlockHash"
				FROM token
				ORDER BY contract_address ASC, id ASC
				OFFSET $1
				LIMIT $2
			`,
			[
				offset,
				limit,
			]
		)
	).map((row) => assertEnvelope('token', dappetizerTokenWire, row))
}

export const listAccountBalances = async ({
	ownerAddress,
	offset = 0,
	limit = 100,
}: {
	ownerAddress: string
	offset?: number
	limit?: number
}): Promise<DappetizerBalance[]> => {
	if (ownerAddress.length === 0)
		throw new Error('TezosDappetizer_Postgres: empty owner address')
	assertPage(offset, limit, 'balances')

	return (
		await queryRows(
			`
				SELECT
					balance.owner_address AS "ownerAddress",
					balance.amount,
					balance.operation_group_hash AS "operationGroupHash",
					balance.token_id AS "tokenId",
					balance.token_contract_address AS "tokenContractAddress",
					balance.valid_from_block_hash AS "validFromBlockHash",
					balance.valid_until_block_hash AS "validUntilBlockHash",
					block.level,
					block.timestamp
				FROM balance
				INNER JOIN block
					ON block.hash = balance.valid_from_block_hash
				WHERE balance.owner_address = $1
					AND balance.valid_until_block_hash IS NULL
				ORDER BY balance.token_contract_address ASC, balance.token_id ASC
				OFFSET $2
				LIMIT $3
			`,
			[
				ownerAddress,
				offset,
				limit,
			]
		)
	).map((row) => {
		const balance = assertEnvelope('balance', dappetizerBalanceWire, row)
		if (balance.ownerAddress !== ownerAddress)
			throw new Error('TezosDappetizer_Postgres: balance owner does not match the subject')
		return balance
	})
}

export const listAccountTransferActions = async ({
	address,
	offset = 0,
	limit = 100,
}: {
	address: string
	offset?: number
	limit?: number
}): Promise<DappetizerAction[]> => {
	if (address.length === 0)
		throw new Error('TezosDappetizer_Postgres: empty account address')
	assertPage(offset, limit, 'transfer actions')

	return (
		await queryRows(
			`
				SELECT
					action."order",
					action.type,
					action.operation_group_hash AS "operationGroupHash",
					action.amount,
					action.from_address AS "fromAddress",
					action.to_address AS "toAddress",
					action.owner_address AS "ownerAddress",
					action.block_hash AS "blockHash",
					action.token_id AS "tokenId",
					action.token_contract_address AS "tokenContractAddress",
					block.level,
					block.timestamp
				FROM action
				INNER JOIN block
					ON block.hash = action.block_hash
				WHERE action.type = 'transfer'
					AND (
						action.from_address = $1
						OR action.to_address = $1
						OR action.owner_address = $1
					)
				ORDER BY block.level DESC, action."order" DESC
				OFFSET $2
				LIMIT $3
			`,
			[
				address,
				offset,
				limit,
			]
		)
	).map((row) => assertEnvelope('action', dappetizerActionWire, row))
}

export const listTransferActions = async ({
	offset = 0,
	limit = 100,
}: {
	offset?: number
	limit?: number
} = {}): Promise<DappetizerAction[]> => {
	assertPage(offset, limit, 'transfer actions')
	return (
		await queryRows(
			`
				SELECT
					action."order",
					action.type,
					action.operation_group_hash AS "operationGroupHash",
					action.amount,
					action.from_address AS "fromAddress",
					action.to_address AS "toAddress",
					action.owner_address AS "ownerAddress",
					action.block_hash AS "blockHash",
					action.token_id AS "tokenId",
					action.token_contract_address AS "tokenContractAddress",
					block.level,
					block.timestamp
				FROM action
				INNER JOIN block
					ON block.hash = action.block_hash
				WHERE action.type = 'transfer'
				ORDER BY block.level DESC, action."order" DESC
				OFFSET $1
				LIMIT $2
			`,
			[
				offset,
				limit,
			]
		)
	).map((row) => assertEnvelope('action', dappetizerActionWire, row))
}

export const findAccountEvidence = async ({
	address,
}: {
	address: string
}): Promise<{
	kind: 'contract' | 'balance'
}> => {
	if (address.length === 0)
		throw new Error('TezosDappetizer_Postgres: empty account address')

	const contractRow = (
		await queryRows(
			`
				SELECT address
				FROM contract
				WHERE address = $1
				LIMIT 1
			`,
			[address]
		)
	)[0]
	if (contractRow != null)
		return {
			kind: 'contract',
		}

	const balanceRow = (
		await queryRows(
			`
				SELECT owner_address AS "ownerAddress"
				FROM balance
				WHERE owner_address = $1
				LIMIT 1
			`,
			[address]
		)
	)[0]
	if (balanceRow != null)
		return {
			kind: 'balance',
		}

	throw new Error(`TezosDappetizer_Postgres: account ${address} not found`)
}
