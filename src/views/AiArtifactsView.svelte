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
	}: EntityListViewProps<EntityType.AiArtifact> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AiArtifact}
	bind:open
	resource={
		selection({
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
		})
	}
>
	{#snippet Item({ item: aiArtifact })}
		<EntityView
			entityType={EntityType.AiArtifact}
			entitySelector={aiArtifact[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				{(aiArtifact.artifactType ?? '') || [(aiArtifact.providerArtifactId ?? ''), (aiArtifact.ociDigest ?? ''), (aiArtifact.ipfsCid ?? ''), (aiArtifact.arweaveId ?? ''), (aiArtifact.gitObject ?? ''), (aiArtifact.digest ?? '')].filter(Boolean).join(' ') || 'AI artifact'}
			{/snippet}

			{#snippet Value()}
				{aiArtifact.mediaType ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{aiArtifact.size ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
