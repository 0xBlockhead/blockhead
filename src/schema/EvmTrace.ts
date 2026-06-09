import { scope, type } from 'arktype'

import { EvmAddress, ZeroExHex } from '$/schema/ZeroExHex.ts'


export const evmTraceTreeScope = scope({
	EvmTraceTreeNode: {
		index: 'number',
		'type?': 'string',
		'from?': EvmAddress,
		'to?': EvmAddress,
		'value?': 'string',
		'gas?': 'bigint',
		'gasUsed?': 'bigint',
		'input?': ZeroExHex,
		'output?': ZeroExHex,
		'error?': 'string',
		'children?': 'EvmTraceTreeNode[]',
	},
})

export const evmTraceTreeNode = evmTraceTreeScope.export().EvmTraceTreeNode

export type EvmTraceTree = typeof evmTraceTreeNode.infer
