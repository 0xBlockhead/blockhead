import type { SourceBinding } from '$/sources/SourceBinding.ts'
import {
	getBlockNumber as getEvmBlockNumber,
	getGasPrice as getEvmGasPrice,
	getMaxPriorityFeePerGas as getEvmMaxPriorityFeePerGas,
} from '$/sources/_shared/interfaces/EvmExecutionJsonRpc/queries.ts'

export const getBlockNumber = (binding: SourceBinding) => (
	getEvmBlockNumber(binding)
)

export const getGasPrice = (binding: SourceBinding) => (
	getEvmGasPrice(binding)
)

export const getMaxPriorityFeePerGas = (binding: SourceBinding) => (
	getEvmMaxPriorityFeePerGas(binding)
)
