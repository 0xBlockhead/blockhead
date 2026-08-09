import bindings from '$/sources/Helius/bindings.ts'
import { Source } from '$/sources/Source.ts'


// Lookups

export const heliusBindingByApiFamily = Object.fromEntries(
	bindings[Source.Helius].map((binding) => [
		binding.apiFamily,
		binding,
	])
)
