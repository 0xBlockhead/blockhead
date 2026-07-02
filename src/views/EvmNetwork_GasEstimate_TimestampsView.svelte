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
		placeholderText = 'Loading EVM network gas estimate observations...',
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
			selection.sources == null ? selection({
				fields: {
					fastGwei: true,
					timestampMs: true,
					$network: true,
				},
			}) : selection
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
				totalCount={evmNetworkGasEstimateTimestamps.values.length === uniqueEvmNetworkGasEstimateTimestamps.length && evmNetworkGasEstimateTimestamps.totalCount != null && evmNetworkGasEstimateTimestamps.totalCount >= uniqueEvmNetworkGasEstimateTimestamps.length ? evmNetworkGasEstimateTimestamps.totalCount : uniqueEvmNetworkGasEstimateTimestamps.length}
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
					<EvmNetwork_GasEstimate_TimestampView
						href={
							resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/gas-estimates/[timestampMs=nonNegativeInteger]/[source]', {
								caip2: `${String(({ ...evmNetworkGasEstimateTimestamp.entitySelector, ...evmNetworkGasEstimateTimestamp }).$network.caip2.namespace)}:${String(({ ...evmNetworkGasEstimateTimestamp.entitySelector, ...evmNetworkGasEstimateTimestamp }).$network.caip2.reference)}`,
								timestampMs: String(({ ...evmNetworkGasEstimateTimestamp.entitySelector, ...evmNetworkGasEstimateTimestamp }).timestampMs),
								source: String(({ ...evmNetworkGasEstimateTimestamp.entitySelector, ...evmNetworkGasEstimateTimestamp }).source),
							})
						}
						selection={select(EntityType.EvmNetwork_GasEstimate_Timestamp, evmNetworkGasEstimateTimestamp.entitySelector)}
						prefetched={evmNetworkGasEstimateTimestamp}
						layout={EntityLayout.Summary}
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
