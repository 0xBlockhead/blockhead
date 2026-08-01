import type {
	Caip2NetworkKey,
	NetworkSlug,
} from '../../../src/constants/Network.ts'

type NonZeroDecimalDigit = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
type Eip155ChainKey = `${NonZeroDecimalDigit}${string}` & `${bigint}`

export type SourceTarget<_Kind extends string> = {
	[_TargetKind in _Kind]: {
		kind: _TargetKind
		key: (
			_TargetKind extends 'Caip2Network' ? Caip2NetworkKey
			:
			_TargetKind extends 'NetworkSlug' ? NetworkSlug
			:
			_TargetKind extends 'Eip155Chain' ? Eip155ChainKey
			:
			string
		)
	}
}[_Kind]
