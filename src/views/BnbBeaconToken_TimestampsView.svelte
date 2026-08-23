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
	}: EntityListViewProps<EntityType.BnbBeaconToken_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BnbBeaconToken_Timestamp}
	bind:open
	resource={
		selection({
			...{
				fields: {
					timestampMs: true,
					totalSupply: true,
					source: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: bnbBeaconTokenTimestamp })}
		{@const bnbBeaconTokenTimestampSelector = bnbBeaconTokenTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BnbBeaconToken_Timestamp}
			entitySelector={bnbBeaconTokenTimestampSelector}
		>
			{#snippet Title()}
				{bnbBeaconTokenTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{bnbBeaconTokenTimestamp.totalSupply ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{bnbBeaconTokenTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
