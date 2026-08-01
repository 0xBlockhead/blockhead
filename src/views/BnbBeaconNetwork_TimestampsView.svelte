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
	}: EntityListViewProps<EntityType.BnbBeaconNetwork_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BnbBeaconNetwork_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				latestArchivedHeight: true,
				archiveCoverageStatus: true,
				source: true,
			},
		})
	}
>
	{#snippet Item({ item: bnbBeaconNetworkTimestamp })}
		{@const bnbBeaconNetworkTimestampSelector = bnbBeaconNetworkTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BnbBeaconNetwork_Timestamp}
			entitySelector={bnbBeaconNetworkTimestampSelector}
		>
			{#snippet Title()}
				{bnbBeaconNetworkTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{[String(bnbBeaconNetworkTimestamp.latestArchivedHeight ?? ''), (bnbBeaconNetworkTimestamp.archiveCoverageStatus ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{bnbBeaconNetworkTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
