<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'EVM selector observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EvmSelector_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.EvmSelector_Timestamp>
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
	import EvmSelector_TimestampView from '$/views/EvmSelector_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EvmSelector_Timestamp}
	{id}
	{title}
	bind:open
	{collapsible}
	{showTypeAnnotation}
	TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	resource={
		selection({
			sources: [
				Source.Openchain_Rest,
			],
			fields: {
				timestampMs: true,
				source: true,
				$selector: true,
			},
		})
	}
	getResourceItems={(evmSelectorTimestamps) => [...new Map(evmSelectorTimestamps.values.map((evmSelectorTimestamp) => [evmSelectorTimestamp[EntityMetaKey.SelectorKey], evmSelectorTimestamp])).values()]}
	getKey={(evmSelectorTimestamp) => evmSelectorTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No EVM selector observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: evmSelectorTimestamp })}
		{@const evmSelectorTimestampFields = { ...evmSelectorTimestamp[EntityMetaKey.Selector], ...evmSelectorTimestamp }}
		{@const selection = select(EntityType.EvmSelector_Timestamp, evmSelectorTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const evmSelectorTimestampHrefFields = { ...evmSelectorTimestamp, ...evmSelectorTimestamp[EntityMetaKey.Selector] }}
		<EvmSelector_TimestampView
			selection={selection}
			prefetched={evmSelectorTimestampFields}
			href={
				(evmSelectorTimestampHrefFields.timestampMs !== undefined && evmSelectorTimestampHrefFields.source !== undefined && evmSelectorTimestampHrefFields.$selector !== undefined && evmSelectorTimestampHrefFields.$selector.hex !== undefined ? resolve('/evm/selector/[hex=zeroExHex]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
					timestampMs: String(evmSelectorTimestampHrefFields.timestampMs ?? ''),
					source: String(evmSelectorTimestampHrefFields.source ?? ''),
					hex: String(evmSelectorTimestampHrefFields.$selector.hex ?? ''),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
