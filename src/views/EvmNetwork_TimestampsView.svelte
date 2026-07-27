<!-- Generated from APP.ts. Do not edit by hand. -->

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
		typeAnnotationParagraphs = ['A point-in-time observation of an EVM-compatible network.'],
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.EvmNetwork_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EvmNetwork_Timestamp}
	bind:open
	{typeAnnotationParagraphs}
	resource={
		selection({
			fields: {
				blockHeight: true,
				timestampMs: true,
				$network: true,
			},
		})
	}
>
	{#snippet Item({ item: evmNetworkTimestamp })}
		{@const evmNetworkTimestampSelector = evmNetworkTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.EvmNetwork_Timestamp}
			entitySelector={evmNetworkTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in evmNetworkTimestampSelector.$network ?
								String(caip2StringFromValue(evmNetworkTimestampSelector.$network.caip2))
							:
								String(evmNetworkTimestampSelector.$network.slug)
						),
						timestampMs: String(evmNetworkTimestampSelector.timestampMs),
						source: String(evmNetworkTimestampSelector.source),
					}
				)
			}
		>
			{#snippet Title()}
				{([(String(evmNetworkTimestamp.blockHeight) ? 'Block ' + String(evmNetworkTimestamp.blockHeight) : ''), String(evmNetworkTimestampSelector.timestampMs)].filter(Boolean).join(' ')) || 'EVM network timestamp'}
			{/snippet}

			{#snippet Value()}
				{String(evmNetworkTimestamp.blockHeight)}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{evmNetworkTimestamp.$network.name || (evmNetworkTimestampSelector.$network.caip2 == null ? '' : `${evmNetworkTimestampSelector.$network.caip2.namespace}:${evmNetworkTimestampSelector.$network.caip2.reference}`) || 'Network'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
