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
		title = 'Network observations',
		typeAnnotationParagraphs = ['A point-in-time observation of network status or metrics.'],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'Network_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.Network_Timestamp>
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
	import Network_TimestampView from '$/views/Network_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.Network_Timestamp}
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
				timestampMs: true,
				source: true,
				$network: true,
			},
		})
	}
	getResourceItems={(networkTimestamps) => [...new Map(networkTimestamps.values.map((networkTimestamp) => [networkTimestamp[EntityMetaKey.SelectorKey], networkTimestamp])).values()]}
	getKey={(networkTimestamp) => networkTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Network observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: networkTimestamp })}
		{@const networkTimestampFields = { ...networkTimestamp[EntityMetaKey.Selector], ...networkTimestamp }}
		{@const selection = select(EntityType.Network_Timestamp, networkTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const networkTimestampHrefFields = { ...networkTimestamp, ...networkTimestamp[EntityMetaKey.Selector] }}
		<Network_TimestampView
			selection={selection}
			prefetched={networkTimestampFields}
			href={
				(networkTimestampHrefFields.timestampMs !== undefined && networkTimestampHrefFields.source !== undefined && networkTimestampHrefFields.$network !== undefined && networkTimestampHrefFields.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/observation/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
					timestampMs: String(networkTimestampHrefFields.timestampMs ?? ''),
					source: String(networkTimestampHrefFields.source ?? ''),
					network: String(caip2StringFromValue(networkTimestampHrefFields.$network.caip2) ?? ''),
				}) : networkTimestampHrefFields.timestampMs !== undefined && networkTimestampHrefFields.source !== undefined && networkTimestampHrefFields.$network !== undefined && networkTimestampHrefFields.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/observation/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
					timestampMs: String(networkTimestampHrefFields.timestampMs ?? ''),
					source: String(networkTimestampHrefFields.source ?? ''),
					network: String(networkTimestampHrefFields.$network.slug ?? ''),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
