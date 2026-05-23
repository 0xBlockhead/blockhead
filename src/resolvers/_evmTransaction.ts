import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import type { Entity } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import {
	EvmInternalCallType,
	EvmTransactionEnvelopeType,
	EvmTransactionExecutionStatus,
	EvmTransactionKind,
} from '$/constants/EvmTransaction.ts'

export const evmTransactionEnvelopeTypeFromRpcTypeByte = (
	raw: number | undefined,
): EvmTransactionEnvelopeType | undefined => (
	raw == null || !Number.isFinite(raw) || !Number.isInteger(raw) ?
		EvmTransactionEnvelopeType.Legacy
	: raw === 0 ?
		EvmTransactionEnvelopeType.Legacy
	: raw === 1 ?
		EvmTransactionEnvelopeType.AccessList
	: raw === 2 ?
		EvmTransactionEnvelopeType.FeeMarket
	: raw === 3 ?
		EvmTransactionEnvelopeType.Blob
	: raw === 4 ?
		EvmTransactionEnvelopeType.SetCode
	:
		EvmTransactionEnvelopeType.Unknown
)

export const evmTransactionExecutionStatusFromReceiptStatus = (
	raw: number | undefined,
): EvmTransactionExecutionStatus | undefined => (
	raw == null || !Number.isFinite(raw) || !Number.isInteger(raw) ?
		undefined
	: raw === 1 ?
		EvmTransactionExecutionStatus.Success
	: raw === 0 ?
		EvmTransactionExecutionStatus.Failed
	:
		undefined
)

export const evmTransactionExecutionStatusWhenReceiptMissing = (
	receiptPresent: boolean,
	receiptStatus: number | undefined,
): EvmTransactionExecutionStatus | undefined => (
	receiptPresent ?
		evmTransactionExecutionStatusFromReceiptStatus(receiptStatus)
	:
		EvmTransactionExecutionStatus.Pending
)

export const evmTransactionKindFromSignedFields = ({
	value,
	toAddress,
	input,
	createdContractAddress,
}: {
	value: bigint
	toAddress?: string
	input?: string
	createdContractAddress?: string
}): EvmTransactionKind => (
	createdContractAddress != null || toAddress == null ?
		EvmTransactionKind.ContractCreation
	: input != null && input !== '0x' && input.length > 2 ?
		value > 0n ?
			EvmTransactionKind.NativeTransferAndCall
		:
			EvmTransactionKind.ContractCall
	: value > 0n ?
		EvmTransactionKind.NativeTransfer
	:
		EvmTransactionKind.ContractCall
)

export const evmTransactionDiscriminatorFields = ({
	rpcTypeByte,
	receiptStatus,
	receiptPresent,
	value,
	toAddress,
	input,
	createdContractAddress,
}: {
	rpcTypeByte: number | undefined
	receiptStatus: number | undefined
	receiptPresent: boolean
	value: bigint
	toAddress?: string
	input?: string
	createdContractAddress?: string
}) => {
	const envelopeType = evmTransactionEnvelopeTypeFromRpcTypeByte(rpcTypeByte)
	const executionStatus = evmTransactionExecutionStatusWhenReceiptMissing(
		receiptPresent,
		receiptStatus,
	)
	const kind = evmTransactionKindFromSignedFields({
		value,
		toAddress,
		input,
		createdContractAddress,
	})
	return {
		envelopeType,
		...(executionStatus != null && { executionStatus }),
		kind,
	}
}

export const evmInternalCallTypeFromWire = (
	raw: string | undefined,
): EvmInternalCallType | undefined => (
	raw == null || raw === '' ?
		undefined
	: ((normalized) => (
		normalized === 'call' ?
			EvmInternalCallType.Call
		: normalized === 'callcode' ?
			EvmInternalCallType.CallCode
		: normalized === 'delegatecall' ?
			EvmInternalCallType.DelegateCall
		: normalized === 'staticcall' ?
			EvmInternalCallType.StaticCall
		: normalized === 'create' ?
			EvmInternalCallType.Create
		: normalized === 'create2' ?
			EvmInternalCallType.Create2
		: normalized === 'suicide' || normalized === 'selfdestruct' ?
			EvmInternalCallType.SelfDestruct
		:
			EvmInternalCallType.Unknown
	))(raw.trim().toLowerCase())
)

export const evmTransactionBlobFieldsFromRpc = ({
	maxFeePerBlobGas,
	blobGasUsed,
}: {
	maxFeePerBlobGas?: bigint
	blobGasUsed?: bigint
}) => ({
	...(maxFeePerBlobGas != null && { maxFeePerBlobGas }),
	...(blobGasUsed != null && { blobGasUsed }),
})

export const evmBlobEntityRefsFromVoltaireTx = ({
	$network,
	txHash,
	blobVersionedHashes,
}: {
	$network: { chainId: number }
	txHash: `0x${string}`
	blobVersionedHashes: readonly string[] | undefined
}): Entity<typeof schema, EntityType.EvmBlob>[] => (
	(blobVersionedHashes ?? [])
		.flatMap((_, blobIndex) => (
			typeof blobVersionedHashes?.[blobIndex] === 'string' ?
				[{
					[EntityMetaKey.Id]: {
						$network,
						txHash,
						blobIndex,
					},
				} satisfies Entity<typeof schema, EntityType.EvmBlob>]
			:
				[]
		))
)
