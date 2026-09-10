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
		{@const avs = eigenLayerAvsTimestampSelector.$avs}
		<EntityView
			entityType={EntityType.EigenLayerAvs_Timestamp}
			entitySelector={eigenLayerAvsTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/eigenlayer/(eigenLayerProtocol)/avs/[avsAddress=evmAddress]/(eigenLayerAvs)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in avs.$network ?
								caip2StringFromValue(avs.$network.caip2)
							:
								avs.$network.slug
						),
						avsAddress: avs.avsAddress,
						timestampMs: String(eigenLayerAvsTimestampSelector.timestampMs),
						source: eigenLayerAvsTimestampSelector.source,
					}
				)
			}
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
