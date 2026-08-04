<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
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
		<EntityView
			entityType={EntityType.AiArtifactAttestation}
			entitySelector={aiArtifactAttestationSelector}
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
