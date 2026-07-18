import type { SourceTarget } from './inputs/source-target.ts'

type Target = SourceTarget<'Caip2Network' | 'Global'>

const ethereum = {
	kind: 'Caip2Network',
	key: 'eip155:1',
} as const satisfies Target

const global = {
	kind: 'Global',
	key: 'catalog',
} as const satisfies Target

const serviceAlias = {
	kind: 'Caip2Network',
	key: 'algorand-algod',
// @ts-expect-error Service aliases are not canonical Network CAIP-2 identities.
} as const satisfies Target

const uncatalogedCaip2 = {
	kind: 'Caip2Network',
	key: 'eip155:999999',
// @ts-expect-error Structurally valid route identifiers are not necessarily catalog binding targets.
} as const satisfies Target

const malformedZcash = {
	kind: 'Caip2Network',
	key: 'bip122:00040fe8ec8471911baa1db1266ea15d',
// @ts-expect-error Malformed catalog identities are rejected.
} as const satisfies Target

void ethereum
void global
void serviceAlias
void uncatalogedCaip2
void malformedZcash
