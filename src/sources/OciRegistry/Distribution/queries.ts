import type { SourceBinding } from '$/sources/SourceBinding.ts'
import {
	getOciManifest,
	ociManifestPath,
} from '$/sources/_shared/wire/OciDistribution/client.ts'
import type { OciImageReference } from '$/sources/_shared/wire/OciDistribution/types.ts'

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
