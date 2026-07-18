<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
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
			selection: RegisteredEntityProxyEntitiesResource<EntityType.EvmNetwork_GasEstimate_Timestamp>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()

	const collectionSelection = $derived(selection)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EvmNetwork_GasEstimate_TimestampView from '$/views/EvmNetwork_GasEstimate_TimestampView.svelte'
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
		{@const selection = select(EntityType.EvmNetwork_GasEstimate_Timestamp, evmNetworkGasEstimateTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const evmNetworkGasEstimateTimestampHrefFields = { ...evmNetworkGasEstimateTimestamp, ...evmNetworkGasEstimateTimestamp[EntityMetaKey.Selector] }}
		<EvmNetwork_GasEstimate_TimestampView
			selection={selection}
			prefetched={evmNetworkGasEstimateTimestampFields}
			href={
				(evmNetworkGasEstimateTimestampHrefFields.timestampMs !== undefined && evmNetworkGasEstimateTimestampHrefFields.source !== undefined && evmNetworkGasEstimateTimestampHrefFields.$network !== undefined && evmNetworkGasEstimateTimestampHrefFields.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/gas-estimates/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
					timestampMs: String(evmNetworkGasEstimateTimestampHrefFields.timestampMs ?? ''),
					source: String(evmNetworkGasEstimateTimestampHrefFields.source ?? ''),
					network: String(caip2StringFromValue(evmNetworkGasEstimateTimestampHrefFields.$network.caip2) ?? ''),
				}) : evmNetworkGasEstimateTimestampHrefFields.timestampMs !== undefined && evmNetworkGasEstimateTimestampHrefFields.source !== undefined && evmNetworkGasEstimateTimestampHrefFields.$network !== undefined && evmNetworkGasEstimateTimestampHrefFields.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/gas-estimates/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
					timestampMs: String(evmNetworkGasEstimateTimestampHrefFields.timestampMs ?? ''),
					source: String(evmNetworkGasEstimateTimestampHrefFields.source ?? ''),
					network: String(evmNetworkGasEstimateTimestampHrefFields.$network.slug ?? ''),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
