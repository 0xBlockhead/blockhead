// Types

export enum EvmLogInterpretationKind {
	Transfer = 'Transfer',
	Approval = 'Approval',
	Swap = 'Swap',
	Unknown = 'Unknown',
}


// Constants

export const evmLogInterpretationKinds = [
	EvmLogInterpretationKind.Transfer,
	EvmLogInterpretationKind.Approval,
	EvmLogInterpretationKind.Swap,
	EvmLogInterpretationKind.Unknown,
] as const satisfies readonly EvmLogInterpretationKind[]


// Lookups

export const evmLogInterpretationKindLabelById = {
	[EvmLogInterpretationKind.Transfer]: 'Transfer',
	[EvmLogInterpretationKind.Approval]: 'Approval',
	[EvmLogInterpretationKind.Swap]: 'Swap',
	[EvmLogInterpretationKind.Unknown]: 'Unknown',
} as const satisfies Record<EvmLogInterpretationKind, string>
