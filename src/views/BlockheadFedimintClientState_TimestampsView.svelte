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
	}: EntityListViewProps<EntityType.BlockheadFedimintClientState_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadFedimintClientState_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				balanceMsat: true,
				source: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadFedimintClientStateTimestamp })}
		{@const blockheadFedimintClientStateTimestampSelector = blockheadFedimintClientStateTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadFedimintClientState_Timestamp}
			entitySelector={blockheadFedimintClientStateTimestampSelector}
		>
			{#snippet Title()}
				{blockheadFedimintClientStateTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{blockheadFedimintClientStateTimestamp.balanceMsat ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadFedimintClientStateTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
