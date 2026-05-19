import type { ParamMatcher } from '@sveltejs/kit'

import { EvmAccountAbstractionRegistryRole } from '$/constants/EvmAccountAbstractionRegistryRole.ts'


export const match: ParamMatcher = (param) => (
	Object.values(EvmAccountAbstractionRegistryRole).includes(param as EvmAccountAbstractionRegistryRole)
)
