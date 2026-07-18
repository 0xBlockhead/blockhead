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
		title = 'EVM network txpool observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EvmNetwork_Txpool_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.EvmNetwork_Txpool_Timestamp>
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
	import EvmNetwork_Txpool_TimestampView from '$/views/EvmNetwork_Txpool_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EvmNetwork_Txpool_Timestamp}
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
				pendingCount: true,
				queuedCount: true,
				$network: true,
				timestampMs: true,
				source: true,
			},
		})
	}
	getResourceItems={(evmNetworkTxpoolTimestamps) => [...new Map(evmNetworkTxpoolTimestamps.values.map((evmNetworkTxpoolTimestamp) => [evmNetworkTxpoolTimestamp[EntityMetaKey.SelectorKey], evmNetworkTxpoolTimestamp])).values()]}
	getKey={(evmNetworkTxpoolTimestamp) => evmNetworkTxpoolTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No EVM network txpool observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: evmNetworkTxpoolTimestamp })}
		{@const evmNetworkTxpoolTimestampFields = { ...evmNetworkTxpoolTimestamp[EntityMetaKey.Selector], ...evmNetworkTxpoolTimestamp }}
		{@const selection = select(EntityType.EvmNetwork_Txpool_Timestamp, evmNetworkTxpoolTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const evmNetworkTxpoolTimestampHrefFields = { ...evmNetworkTxpoolTimestamp, ...evmNetworkTxpoolTimestamp[EntityMetaKey.Selector] }}
		<EvmNetwork_Txpool_TimestampView
			selection={selection}
			prefetched={evmNetworkTxpoolTimestampFields}
			href={
				(evmNetworkTxpoolTimestampHrefFields.timestampMs !== undefined && evmNetworkTxpoolTimestampHrefFields.source !== undefined && evmNetworkTxpoolTimestampHrefFields.$network !== undefined && evmNetworkTxpoolTimestampHrefFields.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/mempool/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
					timestampMs: String(evmNetworkTxpoolTimestampHrefFields.timestampMs ?? ''),
					source: String(evmNetworkTxpoolTimestampHrefFields.source ?? ''),
					network: String(caip2StringFromValue(evmNetworkTxpoolTimestampHrefFields.$network.caip2) ?? ''),
				}) : evmNetworkTxpoolTimestampHrefFields.timestampMs !== undefined && evmNetworkTxpoolTimestampHrefFields.source !== undefined && evmNetworkTxpoolTimestampHrefFields.$network !== undefined && evmNetworkTxpoolTimestampHrefFields.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/mempool/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
					timestampMs: String(evmNetworkTxpoolTimestampHrefFields.timestampMs ?? ''),
					source: String(evmNetworkTxpoolTimestampHrefFields.source ?? ''),
					network: String(evmNetworkTxpoolTimestampHrefFields.$network.slug ?? ''),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
