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
		title = 'EVM rollup observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EvmRollup_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.EvmRollup_Timestamp>
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
	import EvmRollup_TimestampView from '$/views/EvmRollup_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EvmRollup_Timestamp}
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
				listingStage: true,
				timestampMs: true,
				$rollup: true,
				source: true,
			},
		})
	}
	getResourceItems={(evmRollupTimestamps) => [...new Map(evmRollupTimestamps.values.map((evmRollupTimestamp) => [evmRollupTimestamp[EntityMetaKey.SelectorKey], evmRollupTimestamp])).values()]}
	getKey={(evmRollupTimestamp) => evmRollupTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No EVM rollup observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: evmRollupTimestamp })}
		{@const evmRollupTimestampFields = { ...evmRollupTimestamp[EntityMetaKey.Selector], ...evmRollupTimestamp }}
		{@const selection = select(EntityType.EvmRollup_Timestamp, evmRollupTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const evmRollupTimestampHrefFields = { ...evmRollupTimestamp, ...evmRollupTimestamp[EntityMetaKey.Selector] }}
		<EvmRollup_TimestampView
			selection={selection}
			prefetched={evmRollupTimestampFields}
			href={
				(evmRollupTimestampHrefFields.timestampMs !== undefined && evmRollupTimestampHrefFields.source !== undefined && evmRollupTimestampHrefFields.$rollup !== undefined && evmRollupTimestampHrefFields.$rollup.projectId !== undefined && evmRollupTimestampHrefFields.$rollup.$network !== undefined && evmRollupTimestampHrefFields.$rollup.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/rollup/[projectId=stringSegment]/timestamp/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
					timestampMs: String(evmRollupTimestampHrefFields.timestampMs ?? ''),
					source: String(evmRollupTimestampHrefFields.source ?? ''),
					projectId: String(evmRollupTimestampHrefFields.$rollup.projectId ?? ''),
					network: String(caip2StringFromValue(evmRollupTimestampHrefFields.$rollup.$network.caip2) ?? ''),
				}) : evmRollupTimestampHrefFields.timestampMs !== undefined && evmRollupTimestampHrefFields.source !== undefined && evmRollupTimestampHrefFields.$rollup !== undefined && evmRollupTimestampHrefFields.$rollup.projectId !== undefined && evmRollupTimestampHrefFields.$rollup.$network !== undefined && evmRollupTimestampHrefFields.$rollup.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/rollup/[projectId=stringSegment]/timestamp/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
					timestampMs: String(evmRollupTimestampHrefFields.timestampMs ?? ''),
					source: String(evmRollupTimestampHrefFields.source ?? ''),
					projectId: String(evmRollupTimestampHrefFields.$rollup.projectId ?? ''),
					network: String(evmRollupTimestampHrefFields.$rollup.$network.slug ?? ''),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
