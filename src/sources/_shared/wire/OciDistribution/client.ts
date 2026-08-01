import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import type { OciImageReference } from '$/sources/_shared/wire/OciDistribution/types.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

export const ociManifestPath = ({
	repository,
	reference,
}: Pick<OciImageReference, 'repository' | 'reference'>) => (
	`/${repository}/manifests/${encodeURIComponent(reference)}`
)

export const getOciManifest = (
	binding: SourceBinding,
	image: Pick<OciImageReference, 'repository' | 'reference'>
) => (
	getJson<JsonValue>(binding, ociManifestPath(image))
)
