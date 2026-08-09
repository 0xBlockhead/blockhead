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
	}: EntityListViewProps<EntityType.ElementsPeg_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.ElementsPeg_Timestamp}
	bind:open
	resource={
		selection({
			...{
				fields: {
					timestampMs: true,
					status: true,
					confirmations: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: elementsPegTimestamp })}
		{@const elementsPegTimestampSelector = elementsPegTimestamp[EntityMetaKey.Selector]}
		{@const peg = elementsPegTimestampSelector.$peg}
		<EntityView
			entityType={EntityType.ElementsPeg_Timestamp}
			entitySelector={elementsPegTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(elements)/elements/peg/[pegTransactionId=stringSegment]/[direction=stringSegment]/(elementsPeg)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in peg.$network.$network ?
								caip2StringFromValue(peg.$network.$network.caip2)
							:
								peg.$network.$network.slug
						),
						pegTransactionId: peg.pegTransactionId,
						direction: peg.direction,
						timestampMs: String(elementsPegTimestampSelector.timestampMs),
						source: elementsPegTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{elementsPegTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{elementsPegTimestamp.status ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{elementsPegTimestamp.confirmations ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
