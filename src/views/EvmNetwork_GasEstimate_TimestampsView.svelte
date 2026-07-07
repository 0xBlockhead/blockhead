<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { SubscribeEntityReferenceResult } from '$/client/$client.svelte.ts'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'EVM network gas estimate observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EvmNetwork_GasEstimate_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.EvmNetwork_GasEstimate_Timestamp>
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


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EvmNetwork_GasEstimate_TimestampView from '$/views/EvmNetwork_GasEstimate_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#if open}
	<ResourceBoundary
		resource={
			selection({
				fields: {
					fastGwei: true,
					timestampMs: true,
					$network: true,
					source: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.EvmNetwork_GasEstimate_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(evmNetworkGasEstimateTimestamps)}
			{@const uniqueEvmNetworkGasEstimateTimestamps = [...new Map(evmNetworkGasEstimateTimestamps.values.map((evmNetworkGasEstimateTimestamp) => [evmNetworkGasEstimateTimestamp[EntityMetaKey.SelectorKey], evmNetworkGasEstimateTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.EvmNetwork_GasEstimate_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={evmNetworkGasEstimateTimestamps.totalCount}
				getKey={(evmNetworkGasEstimateTimestamp) => evmNetworkGasEstimateTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueEvmNetworkGasEstimateTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No EVM network gas estimate observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: evmNetworkGasEstimateTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.EvmNetwork_GasEstimate_Timestamp> })}
					{@const evmNetworkGasEstimateTimestampFields = { ...evmNetworkGasEstimateTimestamp[EntityMetaKey.Selector], ...evmNetworkGasEstimateTimestamp }}
					{@const evmNetworkGasEstimateTimestampHrefFields = { ...evmNetworkGasEstimateTimestamp, ...evmNetworkGasEstimateTimestamp[EntityMetaKey.Selector] }}
					<EvmNetwork_GasEstimate_TimestampView
						selection={select(EntityType.EvmNetwork_GasEstimate_Timestamp, evmNetworkGasEstimateTimestamp[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={evmNetworkGasEstimateTimestampFields}
						href={
							(evmNetworkGasEstimateTimestampHrefFields.$network !== undefined && evmNetworkGasEstimateTimestampHrefFields.$network.caip2 !== undefined && evmNetworkGasEstimateTimestampHrefFields.$network.caip2.namespace !== undefined && evmNetworkGasEstimateTimestampHrefFields.$network !== undefined && evmNetworkGasEstimateTimestampHrefFields.$network.caip2 !== undefined && evmNetworkGasEstimateTimestampHrefFields.$network.caip2.reference !== undefined && evmNetworkGasEstimateTimestampHrefFields.timestampMs !== undefined && evmNetworkGasEstimateTimestampHrefFields.source !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/gas-estimates/[timestampMs=nonNegativeInteger]/[source]', {
								caip2: `${String(evmNetworkGasEstimateTimestampHrefFields.$network.caip2.namespace ?? '')}:${String(evmNetworkGasEstimateTimestampHrefFields.$network.caip2.reference ?? '')}`,
								timestampMs: String(evmNetworkGasEstimateTimestampHrefFields.timestampMs ?? ''),
								source: String(evmNetworkGasEstimateTimestampHrefFields.source ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/snippet}
	</ResourceBoundary>
{:else}
	<EntitiesList
		{...EntitiesListProps}
		entityType={EntityType.EvmNetwork_GasEstimate_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
