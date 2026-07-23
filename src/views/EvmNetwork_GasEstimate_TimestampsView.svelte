<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntitiesListForwardProps } from '$/components/EntitiesList.svelte'
	import type { RegisteredEntityProxyEntitiesSelection } from '$/client/$proxy.svelte.ts'
	import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'




	// State
	let {
		selection,
		countResource,
		title = 'EVM network gas estimate observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EvmNetwork_GasEstimate_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.EvmNetwork_GasEstimate_Timestamp>
			countResource?: SvelteKitResource<number>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		EntitiesListForwardProps
	> = $props()


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EvmNetwork_GasEstimate_Timestamp}
	{id}
	{title}
	bind:open
	{collapsible}
	{showTypeAnnotation}
	TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	resource={
		selection({
			sources: selection.sources,
			fields: {
				fastGwei: true,
				timestampMs: true,
				$network: true,
				source: true,
			},
		})
	}
	{countResource}
	getResourceItems={(evmNetworkGasEstimateTimestamps) => [...new Map(evmNetworkGasEstimateTimestamps.values.map((evmNetworkGasEstimateTimestamp) => [evmNetworkGasEstimateTimestamp[EntityMetaKey.SelectorKey], evmNetworkGasEstimateTimestamp])).values()]}
	getKey={(evmNetworkGasEstimateTimestamp) => evmNetworkGasEstimateTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No EVM network gas estimate observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: evmNetworkGasEstimateTimestamp })}
		{@const evmNetworkGasEstimateTimestampFields = { ...evmNetworkGasEstimateTimestamp[EntityMetaKey.Selector], ...evmNetworkGasEstimateTimestamp }}
		<EntityView
			entityType={EntityType.EvmNetwork_GasEstimate_Timestamp}
			entitySelector={evmNetworkGasEstimateTimestamp[EntityMetaKey.Selector]}
			href={
				(
					evmNetworkGasEstimateTimestamp[EntityMetaKey.Selector] != null && 'timestampMs' in evmNetworkGasEstimateTimestamp[EntityMetaKey.Selector]
					&& evmNetworkGasEstimateTimestamp[EntityMetaKey.Selector].timestampMs != null
					&& evmNetworkGasEstimateTimestamp[EntityMetaKey.Selector] != null && 'source' in evmNetworkGasEstimateTimestamp[EntityMetaKey.Selector]
					&& evmNetworkGasEstimateTimestamp[EntityMetaKey.Selector].source != null
					&& evmNetworkGasEstimateTimestamp[EntityMetaKey.Selector] != null && '$network' in evmNetworkGasEstimateTimestamp[EntityMetaKey.Selector] ?
						evmNetworkGasEstimateTimestamp[EntityMetaKey.Selector].$network != null && 'caip2' in evmNetworkGasEstimateTimestamp[EntityMetaKey.Selector].$network
						&& evmNetworkGasEstimateTimestamp[EntityMetaKey.Selector].$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/gas-estimates/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
						timestampMs: String(evmNetworkGasEstimateTimestamp[EntityMetaKey.Selector].timestampMs ?? ''),
						source: String(evmNetworkGasEstimateTimestamp[EntityMetaKey.Selector].source ?? ''),
						network: String(caip2StringFromValue(evmNetworkGasEstimateTimestamp[EntityMetaKey.Selector].$network.caip2) ?? ''),
					})
					:
							evmNetworkGasEstimateTimestamp[EntityMetaKey.Selector].$network != null && 'slug' in evmNetworkGasEstimateTimestamp[EntityMetaKey.Selector].$network
							&& evmNetworkGasEstimateTimestamp[EntityMetaKey.Selector].$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/gas-estimates/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
							timestampMs: String(evmNetworkGasEstimateTimestamp[EntityMetaKey.Selector].timestampMs ?? ''),
							source: String(evmNetworkGasEstimateTimestamp[EntityMetaKey.Selector].source ?? ''),
							network: String(evmNetworkGasEstimateTimestamp[EntityMetaKey.Selector].$network.slug ?? ''),
						})
						:
							undefined
				:
						undefined
				)
			}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[(String((evmNetworkGasEstimateTimestampFields.fastGwei) ?? '') ? String((evmNetworkGasEstimateTimestampFields.fastGwei) ?? '') + ' gwei' : ''), String((evmNetworkGasEstimateTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ') || 'EVM network gas estimate timestamp'}
			{/snippet}

			{#snippet Value()}
				{[(String((evmNetworkGasEstimateTimestampFields.fastGwei) ?? '') ? String((evmNetworkGasEstimateTimestampFields.fastGwei) ?? '') + ' gwei' : '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[[String((evmNetworkGasEstimateTimestampFields.$network.name) ?? '')].filter(Boolean).join(' ') || [evmNetworkGasEstimateTimestampFields.$network.caip2 == null ? '' : String(`${(evmNetworkGasEstimateTimestampFields.$network.caip2).namespace}:${(evmNetworkGasEstimateTimestampFields.$network.caip2).reference}`)].filter(Boolean).join(' ') || 'Network'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
