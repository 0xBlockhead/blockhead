<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'ENS reverse record observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EnsReverseRecord_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.EnsReverseRecord_Timestamp>
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
	import EnsReverseRecord_TimestampView from '$/views/EnsReverseRecord_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EnsReverseRecord_Timestamp}
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
				verified: true,
				source: true,
			},
		})
	}
	getResourceItems={(ensReverseRecordTimestamps) => [...new Map(ensReverseRecordTimestamps.values.map((ensReverseRecordTimestamp) => [ensReverseRecordTimestamp[EntityMetaKey.SelectorKey], ensReverseRecordTimestamp])).values()]}
	getKey={(ensReverseRecordTimestamp) => ensReverseRecordTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No ENS reverse record observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: ensReverseRecordTimestamp })}
		{@const ensReverseRecordTimestampFields = { ...ensReverseRecordTimestamp[EntityMetaKey.Selector], ...ensReverseRecordTimestamp }}
		{@const selection = select(EntityType.EnsReverseRecord_Timestamp, ensReverseRecordTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<EnsReverseRecord_TimestampView
			selection={selection}
			prefetched={ensReverseRecordTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
