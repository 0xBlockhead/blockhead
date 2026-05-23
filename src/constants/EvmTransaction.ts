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


// Constants

export const evmTransactionEnvelopeTypes = [
	EvmTransactionEnvelopeType.Legacy,
	EvmTransactionEnvelopeType.AccessList,
	EvmTransactionEnvelopeType.FeeMarket,
	EvmTransactionEnvelopeType.Blob,
	EvmTransactionEnvelopeType.SetCode,
	EvmTransactionEnvelopeType.Unknown,
] as const satisfies readonly EvmTransactionEnvelopeType[]

export const evmTransactionExecutionStatuses = [
	EvmTransactionExecutionStatus.Pending,
	EvmTransactionExecutionStatus.Success,
	EvmTransactionExecutionStatus.Failed,
] as const satisfies readonly EvmTransactionExecutionStatus[]

export const evmTransactionKinds = [
	EvmTransactionKind.NativeTransfer,
	EvmTransactionKind.ContractCall,
	EvmTransactionKind.ContractCreation,
	EvmTransactionKind.NativeTransferAndCall,
] as const satisfies readonly EvmTransactionKind[]

export const evmInternalCallTypes = [
	EvmInternalCallType.Call,
	EvmInternalCallType.CallCode,
	EvmInternalCallType.DelegateCall,
	EvmInternalCallType.StaticCall,
	EvmInternalCallType.Create,
	EvmInternalCallType.Create2,
	EvmInternalCallType.SelfDestruct,
	EvmInternalCallType.Unknown,
] as const satisfies readonly EvmInternalCallType[]


// Lookups

export const evmTransactionEnvelopeTypeLabelById = {
	[EvmTransactionEnvelopeType.Legacy]: 'Legacy (type 0)',
	[EvmTransactionEnvelopeType.AccessList]: 'EIP-2930 access list (type 1)',
	[EvmTransactionEnvelopeType.FeeMarket]: 'EIP-1559 fee market (type 2)',
	[EvmTransactionEnvelopeType.Blob]: 'EIP-4844 blob (type 3)',
	[EvmTransactionEnvelopeType.SetCode]: 'EIP-7702 set code (type 4)',
	[EvmTransactionEnvelopeType.Unknown]: 'Unknown envelope',
} as const satisfies Record<EvmTransactionEnvelopeType, string>

export const evmTransactionExecutionStatusLabelById = {
	[EvmTransactionExecutionStatus.Pending]: 'Pending',
	[EvmTransactionExecutionStatus.Success]: 'Success',
	[EvmTransactionExecutionStatus.Failed]: 'Failed',
} as const satisfies Record<EvmTransactionExecutionStatus, string>

export const evmTransactionKindLabelById = {
	[EvmTransactionKind.NativeTransfer]: 'Native transfer',
	[EvmTransactionKind.ContractCall]: 'Contract call',
	[EvmTransactionKind.ContractCreation]: 'Contract creation',
	[EvmTransactionKind.NativeTransferAndCall]: 'Native transfer and contract call',
} as const satisfies Record<EvmTransactionKind, string>

export const evmInternalCallTypeLabelById = {
	[EvmInternalCallType.Call]: 'CALL',
	[EvmInternalCallType.CallCode]: 'CALLCODE',
	[EvmInternalCallType.DelegateCall]: 'DELEGATECALL',
	[EvmInternalCallType.StaticCall]: 'STATICCALL',
	[EvmInternalCallType.Create]: 'CREATE',
	[EvmInternalCallType.Create2]: 'CREATE2',
	[EvmInternalCallType.SelfDestruct]: 'SELFDESTRUCT',
	[EvmInternalCallType.Unknown]: 'Unknown frame',
} as const satisfies Record<EvmInternalCallType, string>
