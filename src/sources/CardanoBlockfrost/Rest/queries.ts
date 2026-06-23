import { request as blockfrostRequest } from '$/sources/Blockfrost/Rest/queries.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'

export const request = ({
	binding,
	path,
	projectId,
}: {
	binding: SourceBinding
	path: string
	projectId: string
}) => (
	blockfrostRequest({
		binding,
		path,
		projectId,
	})
)
