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
	}: EntityListViewProps<EntityType.MagnetResolution_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.MagnetResolution_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				status: true,
				source: true,
			},
		})
	}
>
	{#snippet Item({ item: magnetResolutionTimestamp })}
		{@const magnetResolutionTimestampSelector = magnetResolutionTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.MagnetResolution_Timestamp}
			entitySelector={magnetResolutionTimestampSelector}
		>
			{#snippet Title()}
				{magnetResolutionTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{magnetResolutionTimestamp.status}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{magnetResolutionTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
