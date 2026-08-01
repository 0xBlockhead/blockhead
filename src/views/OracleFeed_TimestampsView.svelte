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
	}: EntityListViewProps<EntityType.OracleFeed_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.OracleFeed_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				description: true,
				latestRoundId: true,
				source: true,
			},
		})
	}
>
	{#snippet Item({ item: oracleFeedTimestamp })}
		{@const oracleFeedTimestampSelector = oracleFeedTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.OracleFeed_Timestamp}
			entitySelector={oracleFeedTimestampSelector}
		>
			{#snippet Title()}
				{oracleFeedTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{[(oracleFeedTimestamp.description ?? ''), String(oracleFeedTimestamp.latestRoundId ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{oracleFeedTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
