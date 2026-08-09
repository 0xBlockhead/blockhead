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
	}: EntityListViewProps<EntityType.TezosBakingRight_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TezosBakingRight_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tezosBakingRightTimestamp })}
		{@const tezosBakingRightTimestampSelector = tezosBakingRightTimestamp[EntityMetaKey.Selector]}
		{@const right = tezosBakingRightTimestampSelector.$right}
		<EntityView
			entityType={EntityType.TezosBakingRight_Timestamp}
			entitySelector={tezosBakingRightTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/baking-right/[cycle=nonNegativeBigInt]/[level=nonNegativeBigInt]/[rightKind=stringSegment]/[bakerAddress=stringSegment]/[rightSource=stringSegment]/(tezosBakingRight)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in right.$network.$network ?
								caip2StringFromValue(right.$network.$network.caip2)
							:
								right.$network.$network.slug
						),
						cycle: String(right.cycle),
						level: String(right.level),
						rightKind: right.rightKind,
						bakerAddress: right.bakerAddress,
						rightSource: right.source,
						timestampMs: String(tezosBakingRightTimestampSelector.timestampMs),
						source: tezosBakingRightTimestampSelector.source,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
