<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'


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
		{@const aiArtifactSelector = aiArtifact[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AiArtifact}
			entitySelector={aiArtifactSelector}
		>
			{#snippet Title()}
				{(aiArtifact.artifactType ?? '') || [(aiArtifactSelector.providerArtifactId ?? ''), (aiArtifactSelector.ociDigest ?? ''), (aiArtifactSelector.ipfsCid ?? ''), (aiArtifactSelector.arweaveId ?? ''), (aiArtifactSelector.gitObject ?? ''), String(aiArtifactSelector.digest ?? '')].filter(Boolean).join(' ') || 'AI artifact'}
			{/snippet}

			{#snippet Value()}
				{(aiArtifact.mediaType ?? '')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{String(aiArtifact.size ?? '')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
