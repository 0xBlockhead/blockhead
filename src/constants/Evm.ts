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

export enum EvmStateChangeKind {
	Coin = 'Coin',
	Token = 'Token',
}

export enum EvmTokenStandard {
	Erc20 = 'ERC-20',
	Erc721 = 'ERC-721',
	Erc1155 = 'ERC-1155',
}

export enum EvmNftStandard {
	Erc721 = 'ERC-721',
	Erc1155 = 'ERC-1155',
}

export enum EvmNftFormat {
	Generic = 'Generic',
	Eip8004Registration = 'Eip8004Registration',
}


// Constants

const evmTransactionEnvelopeTypes = [
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

const evmTransactionExecutionStatuses = [
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

const evmTransactionKinds = [
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

const evmInternalCallTypes = [
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

const evmStateChangeKinds = [
	{
		kind: EvmStateChangeKind.Coin,
		label: 'Coin balance',
	},
	{
		kind: EvmStateChangeKind.Token,
		label: 'Token balance',
	},
] as const satisfies readonly {
	kind: EvmStateChangeKind
	label: string
}[]

const evmTokenStandards = [
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

export const evmTransactionEnvelopeTypeByEnvelopeType = Object.fromEntries(
	evmTransactionEnvelopeTypes.map((row) => [
		row.envelopeType,
		row,
	])
)

export const evmTransactionExecutionStatusByExecutionStatus = Object.fromEntries(
	evmTransactionExecutionStatuses.map((row) => [
		row.executionStatus,
		row,
	])
)

export const evmTransactionKindByKind = Object.fromEntries(
	evmTransactionKinds.map((row) => [
		row.kind,
		row,
	])
)

export const evmInternalCallTypeByCallType = Object.fromEntries(
	evmInternalCallTypes.map((row) => [
		row.callType,
		row,
	])
)

export const evmStateChangeKindByKind = Object.fromEntries(
	evmStateChangeKinds.map((row) => [
		row.kind,
		row,
	])
)

export const evmTokenStandardByStandard = Object.fromEntries(
	evmTokenStandards.map((row) => [
		row.standard,
		row,
	])
)
