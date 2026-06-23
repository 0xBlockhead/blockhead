import type { SourceBinding } from '$/sources/SourceBinding.ts'
import type {
	OciImageReference,
} from '$/sources/OciRegistry/Distribution/types.ts'
import {
	getOciManifest,
	ociManifestPath,
} from '$/sources/_shared/wire/OciDistribution/client.ts'

export const manifestPath = ({
	repository,
	reference,
}: Pick<OciImageReference, 'repository' | 'reference'>) => (
	ociManifestPath({
		repository,
		reference,
	})
)

export const getManifest = (
	binding: SourceBinding,
	image: Pick<OciImageReference, 'repository' | 'reference'>
) => (
	getOciManifest(binding, image)
)
