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
		title = 'EVM network observations',
		typeAnnotationParagraphs = ['A point-in-time observation of an EVM-compatible network.'],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EvmNetwork_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.EvmNetwork_Timestamp>
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
	entityType={EntityType.EvmNetwork_Timestamp}
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
				blockHeight: true,
				timestampMs: true,
				$network: true,
				source: true,
			},
		})
	}
	{countResource}
	getResourceItems={(evmNetworkTimestamps) => [...new Map(evmNetworkTimestamps.values.map((evmNetworkTimestamp) => [evmNetworkTimestamp[EntityMetaKey.SelectorKey], evmNetworkTimestamp])).values()]}
	getKey={(evmNetworkTimestamp) => evmNetworkTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No EVM network observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: evmNetworkTimestamp })}
		{@const evmNetworkTimestampFields = { ...evmNetworkTimestamp[EntityMetaKey.Selector], ...evmNetworkTimestamp }}
		<EntityView
			entityType={EntityType.EvmNetwork_Timestamp}
			entitySelector={evmNetworkTimestamp[EntityMetaKey.Selector]}
			href={
				(
					evmNetworkTimestamp[EntityMetaKey.Selector] != null && 'timestampMs' in evmNetworkTimestamp[EntityMetaKey.Selector]
					&& evmNetworkTimestamp[EntityMetaKey.Selector].timestampMs != null
					&& evmNetworkTimestamp[EntityMetaKey.Selector] != null && 'source' in evmNetworkTimestamp[EntityMetaKey.Selector]
					&& evmNetworkTimestamp[EntityMetaKey.Selector].source != null
					&& evmNetworkTimestamp[EntityMetaKey.Selector] != null && '$network' in evmNetworkTimestamp[EntityMetaKey.Selector] ?
						evmNetworkTimestamp[EntityMetaKey.Selector].$network != null && 'caip2' in evmNetworkTimestamp[EntityMetaKey.Selector].$network
						&& evmNetworkTimestamp[EntityMetaKey.Selector].$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
						timestampMs: String(evmNetworkTimestamp[EntityMetaKey.Selector].timestampMs ?? ''),
						source: String(evmNetworkTimestamp[EntityMetaKey.Selector].source ?? ''),
						network: String(caip2StringFromValue(evmNetworkTimestamp[EntityMetaKey.Selector].$network.caip2) ?? ''),
					})
					:
							evmNetworkTimestamp[EntityMetaKey.Selector].$network != null && 'slug' in evmNetworkTimestamp[EntityMetaKey.Selector].$network
							&& evmNetworkTimestamp[EntityMetaKey.Selector].$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
							timestampMs: String(evmNetworkTimestamp[EntityMetaKey.Selector].timestampMs ?? ''),
							source: String(evmNetworkTimestamp[EntityMetaKey.Selector].source ?? ''),
							network: String(evmNetworkTimestamp[EntityMetaKey.Selector].$network.slug ?? ''),
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
				{[(String((evmNetworkTimestampFields.blockHeight) ?? '') ? 'Block ' + String((evmNetworkTimestampFields.blockHeight) ?? '') : ''), String((evmNetworkTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ') || 'EVM network timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((evmNetworkTimestampFields.blockHeight) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[[String((evmNetworkTimestampFields.$network.name) ?? '')].filter(Boolean).join(' ') || [evmNetworkTimestampFields.$network.caip2 == null ? '' : String(`${(evmNetworkTimestampFields.$network.caip2).namespace}:${(evmNetworkTimestampFields.$network.caip2).reference}`)].filter(Boolean).join(' ') || 'Network'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
