<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// State
	let {
		selection,
		title = 'Custody observations',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BeaconDataColumn_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BeaconDataColumn_Timestamp}
	{title}
	bind:open
	resource={
		selection({
			...{
				fields: {
					timestampMs: true,
					finalized: true,
					executionOptimistic: true,
					source: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: beaconDataColumnTimestamp })}
		{@const beaconDataColumnTimestampSelector = beaconDataColumnTimestamp[EntityMetaKey.Selector]}
		{@const dataColumn = beaconDataColumnTimestampSelector.$dataColumn}
		<EntityView
			entityType={EntityType.BeaconDataColumn_Timestamp}
			entitySelector={beaconDataColumnTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/beacon-block/[root=zeroExHex]/(beaconBlock)/data-column/[columnIndex=nonNegativeInteger]/(beaconDataColumn)/observation/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in dataColumn.$block.$network ?
								caip2StringFromValue(dataColumn.$block.$network.caip2)
							:
								dataColumn.$block.$network.slug
						),
						root: dataColumn.$block.root,
						columnIndex: String(dataColumn.columnIndex),
						timestampMs: String(beaconDataColumnTimestampSelector.timestampMs),
						source: beaconDataColumnTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{beaconDataColumnTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{[String(beaconDataColumnTimestamp.finalized), String(beaconDataColumnTimestamp.executionOptimistic)].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{beaconDataColumnTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
