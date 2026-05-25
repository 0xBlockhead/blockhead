// Types

export enum EvmTransactionEnvelopeType {
	Legacy = 'Legacy',
	AccessList = 'AccessList',
	FeeMarket = 'FeeMarket',
	Blob = 'Blob',
	SetCode = 'SetCode',
	Unknown = 'Unknown',
}

export enum EvmTransactionExecutionStatus {
	Pending = 'Pending',
	Success = 'Success',
	Failed = 'Failed',
}

export enum EvmTransactionKind {
	NativeTransfer = 'NativeTransfer',
	ContractCall = 'ContractCall',
	ContractCreation = 'ContractCreation',
	NativeTransferAndCall = 'NativeTransferAndCall',
}

export enum EvmInternalCallType {
	Call = 'Call',
	CallCode = 'CallCode',
	DelegateCall = 'DelegateCall',
	StaticCall = 'StaticCall',
	Create = 'Create',
	Create2 = 'Create2',
	SelfDestruct = 'SelfDestruct',
	Unknown = 'Unknown',
}

export enum EvmLogInterpretationKind {
	Transfer = 'Transfer',
	Approval = 'Approval',
	Swap = 'Swap',
	Unknown = 'Unknown',
}

export enum EvmTokenStandard {
	Erc20 = 'ERC-20',
	Erc721 = 'ERC-721',
	Erc1155 = 'ERC-1155',
}


// Constants

const evmTransactionEnvelopeTypeRows = [
	{
		envelopeType: EvmTransactionEnvelopeType.Legacy,
		label: 'Legacy (type 0)',
	},
	{
		envelopeType: EvmTransactionEnvelopeType.AccessList,
		label: 'EIP-2930 access list (type 1)',
	},
	{
		envelopeType: EvmTransactionEnvelopeType.FeeMarket,
		label: 'EIP-1559 fee market (type 2)',
	},
	{
		envelopeType: EvmTransactionEnvelopeType.Blob,
		label: 'EIP-4844 blob (type 3)',
	},
	{
		envelopeType: EvmTransactionEnvelopeType.SetCode,
		label: 'EIP-7702 set code (type 4)',
	},
	{
		envelopeType: EvmTransactionEnvelopeType.Unknown,
		label: 'Unknown envelope',
	},
] as const satisfies readonly {
	envelopeType: EvmTransactionEnvelopeType
	label: string
}[]

const evmTransactionExecutionStatusRows = [
	{
		executionStatus: EvmTransactionExecutionStatus.Pending,
		label: 'Pending',
	},
	{
		executionStatus: EvmTransactionExecutionStatus.Success,
		label: 'Success',
	},
	{
		executionStatus: EvmTransactionExecutionStatus.Failed,
		label: 'Failed',
	},
] as const satisfies readonly {
	executionStatus: EvmTransactionExecutionStatus
	label: string
}[]

const evmTransactionKindRows = [
	{
		kind: EvmTransactionKind.NativeTransfer,
		label: 'Native transfer',
	},
	{
		kind: EvmTransactionKind.ContractCall,
		label: 'Contract call',
	},
	{
		kind: EvmTransactionKind.ContractCreation,
		label: 'Contract creation',
	},
	{
		kind: EvmTransactionKind.NativeTransferAndCall,
		label: 'Native transfer and contract call',
	},
] as const satisfies readonly {
	kind: EvmTransactionKind
	label: string
}[]

const evmInternalCallTypeRows = [
	{
		callType: EvmInternalCallType.Call,
		label: 'CALL',
	},
	{
		callType: EvmInternalCallType.CallCode,
		label: 'CALLCODE',
	},
	{
		callType: EvmInternalCallType.DelegateCall,
		label: 'DELEGATECALL',
	},
	{
		callType: EvmInternalCallType.StaticCall,
		label: 'STATICCALL',
	},
	{
		callType: EvmInternalCallType.Create,
		label: 'CREATE',
	},
	{
		callType: EvmInternalCallType.Create2,
		label: 'CREATE2',
	},
	{
		callType: EvmInternalCallType.SelfDestruct,
		label: 'SELFDESTRUCT',
	},
	{
		callType: EvmInternalCallType.Unknown,
		label: 'Unknown frame',
	},
] as const satisfies readonly {
	callType: EvmInternalCallType
	label: string
}[]

const evmLogInterpretationKindRows = [
	{
		interpretationKind: EvmLogInterpretationKind.Transfer,
		label: 'Transfer',
	},
	{
		interpretationKind: EvmLogInterpretationKind.Approval,
		label: 'Approval',
	},
	{
		interpretationKind: EvmLogInterpretationKind.Swap,
		label: 'Swap',
	},
	{
		interpretationKind: EvmLogInterpretationKind.Unknown,
		label: 'Unknown',
	},
] as const satisfies readonly {
	interpretationKind: EvmLogInterpretationKind
	label: string
}[]

const evmTokenStandardRows = [
	{
		standard: EvmTokenStandard.Erc20,
		label: 'ERC-20',
	},
	{
		standard: EvmTokenStandard.Erc721,
		label: 'ERC-721',
	},
	{
		standard: EvmTokenStandard.Erc1155,
		label: 'ERC-1155',
	},
] as const satisfies readonly {
	standard: EvmTokenStandard
	label: string
}[]


// Lookups

export const evmTransactionEnvelopeTypes = Object.fromEntries(
	evmTransactionEnvelopeTypeRows.map((row) => [
		row.envelopeType,
		row,
	]),
)

export const evmTransactionExecutionStatuses = Object.fromEntries(
	evmTransactionExecutionStatusRows.map((row) => [
		row.executionStatus,
		row,
	]),
)

export const evmTransactionKinds = Object.fromEntries(
	evmTransactionKindRows.map((row) => [
		row.kind,
		row,
	]),
)

export const evmInternalCallTypes = Object.fromEntries(
	evmInternalCallTypeRows.map((row) => [
		row.callType,
		row,
	]),
)

export const evmLogInterpretationKinds = Object.fromEntries(
	evmLogInterpretationKindRows.map((row) => [
		row.interpretationKind,
		row,
	]),
)

export const evmTokenStandards = Object.fromEntries(
	evmTokenStandardRows.map((row) => [
		row.standard,
		row,
	]),
)
