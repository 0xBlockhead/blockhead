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
		title = 'ENS records',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EnsRecords-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.EnsRecord>
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
	import EnsRecordView from '$/views/EnsRecordView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EnsRecord}
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
				recordKey: true,
				$name: true,
			},
		})
	}
	getResourceItems={(ensRecords) => [...new Map(ensRecords.values.map((ensRecord) => [ensRecord[EntityMetaKey.SelectorKey], ensRecord])).values()]}
	getKey={(ensRecord) => ensRecord[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No ENS records yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: ensRecord })}
		{@const ensRecordFields = { ...ensRecord[EntityMetaKey.Selector], ...ensRecord }}
		{@const selection = select(EntityType.EnsRecord, ensRecord[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const ensRecordHrefFields = { ...ensRecord, ...ensRecord[EntityMetaKey.Selector] }}
		<EnsRecordView
			selection={selection}
			prefetched={ensRecordFields}
			href={
				(ensRecordHrefFields.recordKey !== undefined && ensRecordHrefFields.$name !== undefined && ensRecordHrefFields.$name.name !== undefined ? resolve('/ens/name/[ensName=stringSegment]/record/[recordId=stringSegment]', {
					recordId: encodeURIComponent(String(ensRecordHrefFields.recordKey ?? '')),
					ensName: encodeURIComponent(String(ensRecordHrefFields.$name.name ?? '')),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
