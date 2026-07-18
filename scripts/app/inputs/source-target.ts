import type {
	Caip2NetworkKey,
	NetworkSlug,
} from './Network.ts'

export type SourceTarget<_Kind extends string> = {
	[_TargetKind in _Kind]: {
		kind: _TargetKind
		key: (
			_TargetKind extends 'Caip2Network' ? Caip2NetworkKey
			:
			_TargetKind extends 'NetworkSlug' ? NetworkSlug
			:
			string
		)
	}
}[_Kind]
