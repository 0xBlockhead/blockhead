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
		placeholderText,
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
			selection({
				fields: {
					pendingCount: true,
					queuedCount: true,
					$network: true,
					timestampMs: true,
					source: true,
				},
			})
		}
		{placeholderText}
	>
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
				totalCount={evmNetworkTxpoolTimestamps.totalCount}
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
					{@const evmNetworkTxpoolTimestampFields = { ...evmNetworkTxpoolTimestamp[EntityMetaKey.Selector], ...evmNetworkTxpoolTimestamp }}
					{@const evmNetworkTxpoolTimestampHrefFields = { ...evmNetworkTxpoolTimestamp, ...evmNetworkTxpoolTimestamp[EntityMetaKey.Selector] }}
					<EvmNetwork_Txpool_TimestampView
						selection={select(EntityType.EvmNetwork_Txpool_Timestamp, evmNetworkTxpoolTimestamp[EntityMetaKey.Selector])}
						prefetched={evmNetworkTxpoolTimestampFields}
						href={
							(evmNetworkTxpoolTimestampHrefFields.$network !== undefined && evmNetworkTxpoolTimestampHrefFields.$network.caip2 !== undefined && evmNetworkTxpoolTimestampHrefFields.$network.caip2.namespace !== undefined && evmNetworkTxpoolTimestampHrefFields.$network !== undefined && evmNetworkTxpoolTimestampHrefFields.$network.caip2 !== undefined && evmNetworkTxpoolTimestampHrefFields.$network.caip2.reference !== undefined && evmNetworkTxpoolTimestampHrefFields.timestampMs !== undefined && evmNetworkTxpoolTimestampHrefFields.source !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/mempool/[timestampMs=nonNegativeInteger]/[source]', {
								caip2: `${String(evmNetworkTxpoolTimestampHrefFields.$network.caip2.namespace ?? '')}:${String(evmNetworkTxpoolTimestampHrefFields.$network.caip2.reference ?? '')}`,
								timestampMs: String(evmNetworkTxpoolTimestampHrefFields.timestampMs ?? ''),
								source: String(evmNetworkTxpoolTimestampHrefFields.source ?? ''),
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
		entityType={EntityType.EvmNetwork_Txpool_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
