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
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BeaconBlock_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BeaconBlock_Timestamp}
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
	{#snippet Item({ item: beaconBlockTimestamp })}
		{@const beaconBlockTimestampSelector = beaconBlockTimestamp[EntityMetaKey.Selector]}
		{@const block = beaconBlockTimestampSelector.$block}
		<EntityView
			entityType={EntityType.BeaconBlock_Timestamp}
			entitySelector={beaconBlockTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/beacon-block/[root=zeroExHex]/(beaconBlock)/observation/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in block.$network ?
								caip2StringFromValue(block.$network.caip2)
							:
								block.$network.slug
						),
						root: block.root,
						timestampMs: String(beaconBlockTimestampSelector.timestampMs),
						source: beaconBlockTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{beaconBlockTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{[String(beaconBlockTimestamp.finalized), String(beaconBlockTimestamp.executionOptimistic)].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{beaconBlockTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
