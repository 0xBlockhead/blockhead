import type { OciImageReference } from '$/sources/_shared/wire/OciDistribution/types.ts'
import {
	e2eOciManifest,
	e2eOciManifestIdentity,
} from './$e2eOciRegistryFixture.ts'


export const getManifest = async (identity: OciImageReference & { registry: string }) => {
	if (
		identity.registry !== e2eOciManifestIdentity.registry
		|| identity.repository !== e2eOciManifestIdentity.repository
		|| identity.reference !== e2eOciManifestIdentity.reference
	)
		throw new Error('E2E OCI fixture received an unexpected manifest identity')

	return e2eOciManifest
}

export const getReferrers = async ({
	registry,
	repository,
	digest,
}: {
	registry: string
	repository: string
	digest: string
	limit: number
}) => {
	if (
		registry !== e2eOciManifestIdentity.registry
		|| repository !== e2eOciManifestIdentity.repository
		|| digest !== e2eOciManifest.contentDigest
	)
		throw new Error('E2E OCI fixture received an unexpected referrers identity')

	return []
}
