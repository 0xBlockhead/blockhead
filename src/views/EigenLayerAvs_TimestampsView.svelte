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
	}: EntityListViewProps<EntityType.EigenLayerAvs_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EigenLayerAvs_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				$avs: true,
				timestampMs: true,
				operatorCount: true,
			},
		})
	}
>
	{#snippet Item({ item: eigenLayerAvsTimestamp })}
		{@const eigenLayerAvsTimestampSelector = eigenLayerAvsTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.EigenLayerAvs_Timestamp}
			entitySelector={eigenLayerAvsTimestampSelector}
		>
			{#snippet Title()}
				{eigenLayerAvsTimestampSelector.$avs.avsAddress || 'eigen layer avs'}
			{/snippet}

			{#snippet Value()}
				{eigenLayerAvsTimestampSelector.timestampMs}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{eigenLayerAvsTimestamp.operatorCount ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
