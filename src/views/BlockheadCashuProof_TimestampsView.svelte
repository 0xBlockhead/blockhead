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
	}: EntityListViewProps<EntityType.BlockheadCashuProof_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadCashuProof_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				state: true,
				source: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadCashuProofTimestamp })}
		{@const blockheadCashuProofTimestampSelector = blockheadCashuProofTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadCashuProof_Timestamp}
			entitySelector={blockheadCashuProofTimestampSelector}
		>
			{#snippet Title()}
				{String(blockheadCashuProofTimestampSelector.timestampMs) || 'blockhead Cashu proof timestamp'}
			{/snippet}

			{#snippet Value()}
				{blockheadCashuProofTimestamp.state}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadCashuProofTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
