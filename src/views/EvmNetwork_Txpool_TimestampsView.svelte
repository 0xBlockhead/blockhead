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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.EvmNetwork_Txpool_Timestamp>
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
	{countResource}
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
		<EntityView
			entityType={EntityType.EvmNetwork_Txpool_Timestamp}
			entitySelector={evmNetworkTxpoolTimestamp[EntityMetaKey.Selector]}
			href={
				(
					evmNetworkTxpoolTimestamp[EntityMetaKey.Selector] != null && 'timestampMs' in evmNetworkTxpoolTimestamp[EntityMetaKey.Selector]
					&& evmNetworkTxpoolTimestamp[EntityMetaKey.Selector].timestampMs != null
					&& evmNetworkTxpoolTimestamp[EntityMetaKey.Selector] != null && 'source' in evmNetworkTxpoolTimestamp[EntityMetaKey.Selector]
					&& evmNetworkTxpoolTimestamp[EntityMetaKey.Selector].source != null
					&& evmNetworkTxpoolTimestamp[EntityMetaKey.Selector] != null && '$network' in evmNetworkTxpoolTimestamp[EntityMetaKey.Selector] ?
						evmNetworkTxpoolTimestamp[EntityMetaKey.Selector].$network != null && 'caip2' in evmNetworkTxpoolTimestamp[EntityMetaKey.Selector].$network
						&& evmNetworkTxpoolTimestamp[EntityMetaKey.Selector].$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/mempool/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
						timestampMs: String(evmNetworkTxpoolTimestamp[EntityMetaKey.Selector].timestampMs ?? ''),
						source: String(evmNetworkTxpoolTimestamp[EntityMetaKey.Selector].source ?? ''),
						network: String(caip2StringFromValue(evmNetworkTxpoolTimestamp[EntityMetaKey.Selector].$network.caip2) ?? ''),
					})
					:
							evmNetworkTxpoolTimestamp[EntityMetaKey.Selector].$network != null && 'slug' in evmNetworkTxpoolTimestamp[EntityMetaKey.Selector].$network
							&& evmNetworkTxpoolTimestamp[EntityMetaKey.Selector].$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/mempool/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
							timestampMs: String(evmNetworkTxpoolTimestamp[EntityMetaKey.Selector].timestampMs ?? ''),
							source: String(evmNetworkTxpoolTimestamp[EntityMetaKey.Selector].source ?? ''),
							network: String(evmNetworkTxpoolTimestamp[EntityMetaKey.Selector].$network.slug ?? ''),
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
				{[(String((evmNetworkTxpoolTimestampFields.pendingCount) ?? '') ? String((evmNetworkTxpoolTimestampFields.pendingCount) ?? '') + ' pending' : ''), (String((evmNetworkTxpoolTimestampFields.queuedCount) ?? '') ? String((evmNetworkTxpoolTimestampFields.queuedCount) ?? '') + ' queued' : '')].filter(Boolean).join(' ') || 'EVM network txpool timestamp'}
			{/snippet}

			{#snippet Value()}
				{[(String((evmNetworkTxpoolTimestampFields.pendingCount) ?? '') ? String((evmNetworkTxpoolTimestampFields.pendingCount) ?? '') + ' pending' : '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[[String((evmNetworkTxpoolTimestampFields.$network.name) ?? '')].filter(Boolean).join(' ') || [evmNetworkTxpoolTimestampFields.$network.caip2 == null ? '' : String(`${(evmNetworkTxpoolTimestampFields.$network.caip2).namespace}:${(evmNetworkTxpoolTimestampFields.$network.caip2).reference}`)].filter(Boolean).join(' ') || 'Network'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
