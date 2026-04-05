import type { ArrayOfUniqueThings } from './ArrayOfUniqueThings.ts'

enum Thing {
	A = 'A',
	B = 'B',
	C = 'C',
}

const _okLit = [{ id: 'A' }, { id: 'B' }, { id: 'C' }] as const satisfies ArrayOfUniqueThings<'A' | 'B' | 'C'>

const _ok = [{ id: Thing.A }, { id: Thing.B }, { id: Thing.C }] as const satisfies ArrayOfUniqueThings<Thing>
const _okOrder = [{ id: Thing.C }, { id: Thing.A }, { id: Thing.B }] as const satisfies ArrayOfUniqueThings<Thing>
// @ts-expect-error missing member of the union
const _badMissing = [{ id: Thing.A }, { id: Thing.B }] as const satisfies ArrayOfUniqueThings<Thing>
// @ts-expect-error duplicate id
const _badDup = [{ id: Thing.A }, { id: Thing.B }, { id: Thing.B }] as const satisfies ArrayOfUniqueThings<Thing>
