<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.AiArtifactAttestation> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AiArtifactAttestation}
	bind:open
	resource={
		selection({
			fields: {
				attestationKind: true,
				$artifact: {
					fields: {
						artifactType: true,
						mediaType: true,
						providerArtifactId: true,
						ociDigest: true,
						ipfsCid: true,
						arweaveId: true,
						gitObject: true,
						digest: true,
						size: true,
					},
				},
				logEntryId: true,
			},
		})
	}
>
	{#snippet Item({ item: aiArtifactAttestation })}
		{@const aiArtifactAttestationSelector = aiArtifactAttestation[EntityMetaKey.Selector]}
		{@const artifact = aiArtifactAttestationSelector.$artifact}
		<EntityView
			entityType={EntityType.AiArtifactAttestation}
			entitySelector={aiArtifactAttestationSelector}
			href={
				aiArtifactAttestationSelector.signatureHashAlgorithm !== undefined
				&& aiArtifactAttestationSelector.signatureHash !== undefined
				&& artifact.digestAlgorithm !== undefined
				&& artifact.digest !== undefined ?
					resolve(
						'/(ai)/ai/artifact/digest/[digestAlgorithm=stringSegment]/[digest=zeroExHex]/(aiArtifact)/attestation/[attestationKind=stringSegment]/signature/[signatureHashAlgorithm=stringSegment]/[signatureHash=stringSegment]',
						{
							digestAlgorithm: artifact.digestAlgorithm,
							digest: artifact.digest,
							attestationKind: aiArtifactAttestationSelector.attestationKind,
							signatureHashAlgorithm: aiArtifactAttestationSelector.signatureHashAlgorithm,
							signatureHash: aiArtifactAttestationSelector.signatureHash,
						}
					)
				:
					aiArtifactAttestationSelector.logEntryId !== undefined
					&& artifact.digestAlgorithm !== undefined
					&& artifact.digest !== undefined ?
						resolve(
							'/(ai)/ai/artifact/digest/[digestAlgorithm=stringSegment]/[digest=zeroExHex]/(aiArtifact)/attestation/[attestationKind=stringSegment]/log/[logEntryId=stringSegment]',
							{
								digestAlgorithm: artifact.digestAlgorithm,
								digest: artifact.digest,
								attestationKind: aiArtifactAttestationSelector.attestationKind,
								logEntryId: aiArtifactAttestationSelector.logEntryId,
							}
						)
					:
						undefined
			}
		>
			{#snippet Title()}
				{aiArtifactAttestationSelector.attestationKind || 'AI artifact attestation'}
			{/snippet}

			{#snippet Value()}
				{(aiArtifactAttestation.$artifact.artifactType ?? '') || [(aiArtifactAttestation.$artifact.providerArtifactId ?? ''), (aiArtifactAttestation.$artifact.ociDigest ?? ''), (aiArtifactAttestation.$artifact.ipfsCid ?? ''), (aiArtifactAttestation.$artifact.arweaveId ?? ''), (aiArtifactAttestation.$artifact.gitObject ?? ''), (aiArtifactAttestation.$artifact.digest ?? '')].filter(Boolean).join(' ') || 'AI artifact'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{aiArtifactAttestation.logEntryId ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
