<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'ENS record observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EnsRecord_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.EnsRecord_Timestamp>
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
	import EnsRecord_TimestampView from '$/views/EnsRecord_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EnsRecord_Timestamp}
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
				$record: true,
				timestampMs: true,
				source: true,
			},
		})
	}
	getResourceItems={(ensRecordTimestamps) => [...new Map(ensRecordTimestamps.values.map((ensRecordTimestamp) => [ensRecordTimestamp[EntityMetaKey.SelectorKey], ensRecordTimestamp])).values()]}
	getKey={(ensRecordTimestamp) => ensRecordTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No ENS record observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: ensRecordTimestamp })}
		{@const ensRecordTimestampFields = { ...ensRecordTimestamp[EntityMetaKey.Selector], ...ensRecordTimestamp }}
		{@const selection = select(EntityType.EnsRecord_Timestamp, ensRecordTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const ensRecordTimestampHrefFields = { ...ensRecordTimestamp, ...ensRecordTimestamp[EntityMetaKey.Selector] }}
		<EnsRecord_TimestampView
			selection={selection}
			prefetched={ensRecordTimestampFields}
			href={
				(ensRecordTimestampHrefFields.timestampMs !== undefined && ensRecordTimestampHrefFields.source !== undefined && ensRecordTimestampHrefFields.$record !== undefined && ensRecordTimestampHrefFields.$record.$name !== undefined && ensRecordTimestampHrefFields.$record.$name.name !== undefined && ensRecordTimestampHrefFields.$record.recordKey !== undefined ? resolve('/ens/name/[ensName=stringSegment]/record/[recordId=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
					timestampMs: String(ensRecordTimestampHrefFields.timestampMs ?? ''),
					source: String(ensRecordTimestampHrefFields.source ?? ''),
					ensName: encodeURIComponent(String(ensRecordTimestampHrefFields.$record.$name.name ?? '')),
					recordId: encodeURIComponent(String(ensRecordTimestampHrefFields.$record.recordKey ?? '')),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
