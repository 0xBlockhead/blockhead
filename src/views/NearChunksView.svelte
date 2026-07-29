<!-- Generated from APP.ts. Do not edit by hand. -->

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
	}: EntityListViewProps<EntityType.NearChunk> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.NearChunk}
	bind:open
	resource={
		selection({
			fields: {
				chunkHash: true,
				$block: true,
				shardId: true,
			},
		})
	}
>
	{#snippet Item({ item: nearChunk })}
		{@const nearChunkSelector = nearChunk[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.NearChunk}
			entitySelector={nearChunkSelector}
		>
			{#snippet Title()}
				{nearChunkSelector.chunkHash || 'near chunk'}
			{/snippet}

			{#snippet Value()}
				{nearChunk.$block == null ? '' : String(nearChunk.$block.height) || 'near block'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{nearChunk.shardId ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
