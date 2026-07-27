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
	}: EntityListViewProps<EntityType.FilecoinDeal_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.FilecoinDeal_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				verifiedDeal: true,
				height: true,
			},
		})
	}
>
	{#snippet Item({ item: filecoinDealTimestamp })}
		{@const filecoinDealTimestampSelector = filecoinDealTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.FilecoinDeal_Timestamp}
			entitySelector={filecoinDealTimestampSelector}
		>
			{#snippet Title()}
				{String(filecoinDealTimestampSelector.timestampMs) || 'filecoin deal timestamp'}
			{/snippet}

			{#snippet Value()}
				{String(filecoinDealTimestamp.verifiedDeal ?? '')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{String(filecoinDealTimestamp.height ?? '')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
