// Types

export enum SafeMultisigOperation {
	Call = 'Call',
	DelegateCall = 'DelegateCall',
}


// Constants

const safeMultisigOperations = [
	{
		operation: SafeMultisigOperation.Call,
		label: 'Call',
	},
	{
		operation: SafeMultisigOperation.DelegateCall,
		label: 'Delegate call',
	},
] as const satisfies readonly {
	operation: SafeMultisigOperation
	label: string
}[]


// Lookups

export const safeMultisigOperationByOperation = Object.fromEntries(
	safeMultisigOperations.map((row) => [
		row.operation,
		row,
	])
)
