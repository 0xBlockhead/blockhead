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
		title = 'EVM network txpool observations',
		typeAnnotationParagraphs = [],
		placeholderText = 'Loading EVM network txpool observations...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EvmNetwork_Txpool_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.EvmNetwork_Txpool_Timestamp>
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
	import EvmNetwork_Txpool_TimestampView from '$/views/EvmNetwork_Txpool_TimestampView.svelte'
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
					pendingCount: true,
					queuedCount: true,
					$network: true,
				},
			}) : selection
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.EvmNetwork_Txpool_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
			/>
		{/snippet}

		{#snippet children(evmNetworkTxpoolTimestamps)}
			{@const uniqueEvmNetworkTxpoolTimestamps = [...new Map(evmNetworkTxpoolTimestamps.values.map((evmNetworkTxpoolTimestamp) => [evmNetworkTxpoolTimestamp[EntityMetaKey.SelectorKey], evmNetworkTxpoolTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.EvmNetwork_Txpool_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={evmNetworkTxpoolTimestamps.values.length === uniqueEvmNetworkTxpoolTimestamps.length && evmNetworkTxpoolTimestamps.totalCount != null && evmNetworkTxpoolTimestamps.totalCount >= uniqueEvmNetworkTxpoolTimestamps.length ? evmNetworkTxpoolTimestamps.totalCount : uniqueEvmNetworkTxpoolTimestamps.length}
				getKey={(evmNetworkTxpoolTimestamp) => evmNetworkTxpoolTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueEvmNetworkTxpoolTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No EVM network txpool observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: evmNetworkTxpoolTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.EvmNetwork_Txpool_Timestamp> })}
					<EvmNetwork_Txpool_TimestampView
						href={
							resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/mempool/[timestampMs=nonNegativeInteger]/[source]', {
								caip2: `${String(({ ...evmNetworkTxpoolTimestamp.entitySelector, ...evmNetworkTxpoolTimestamp }).$network.caip2.namespace)}:${String(({ ...evmNetworkTxpoolTimestamp.entitySelector, ...evmNetworkTxpoolTimestamp }).$network.caip2.reference)}`,
								timestampMs: String(({ ...evmNetworkTxpoolTimestamp.entitySelector, ...evmNetworkTxpoolTimestamp }).timestampMs),
								source: String(({ ...evmNetworkTxpoolTimestamp.entitySelector, ...evmNetworkTxpoolTimestamp }).source),
							})
						}
						selection={select(EntityType.EvmNetwork_Txpool_Timestamp, evmNetworkTxpoolTimestamp.entitySelector)}
						prefetched={evmNetworkTxpoolTimestamp}
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
		entityType={EntityType.EvmNetwork_Txpool_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
