<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntitiesListForwardProps } from '$/components/EntitiesList.svelte'
	import type { RegisteredEntityProxyEntitiesSelection } from '$/client/$proxy.svelte.ts'
	import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'




	// State
	let {
		selection,
		countResource,
		title = 'Zero g storage log entries',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'ZeroGStorageLogEntries-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.ZeroGStorageLogEntry>
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
	entityType={EntityType.ZeroGStorageLogEntry}
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
				logEntryId: true,
				$network: true,
				sequenceNumber: true,
			},
		})
	}
	{countResource}
	getResourceItems={(zeroGStorageLogEntries) => [...new Map(zeroGStorageLogEntries.values.map((zeroGStorageLogEntry) => [zeroGStorageLogEntry[EntityMetaKey.SelectorKey], zeroGStorageLogEntry])).values()]}
	getKey={(zeroGStorageLogEntry) => zeroGStorageLogEntry[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Zero g storage log entries yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: zeroGStorageLogEntry })}
		{@const zeroGStorageLogEntryFields = { ...zeroGStorageLogEntry[EntityMetaKey.Selector], ...zeroGStorageLogEntry }}
		<EntityView
			entityType={EntityType.ZeroGStorageLogEntry}
			entitySelector={zeroGStorageLogEntry[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((zeroGStorageLogEntryFields.logEntryId) ?? '')].filter(Boolean).join(' ') || 'zero g storage log entry'}
			{/snippet}

			{#snippet Value()}
				{[[String((zeroGStorageLogEntryFields.$network.name) ?? '')].filter(Boolean).join(' ') || [zeroGStorageLogEntryFields.$network.caip2 == null ? '' : String(`${(zeroGStorageLogEntryFields.$network.caip2).namespace}:${(zeroGStorageLogEntryFields.$network.caip2).reference}`)].filter(Boolean).join(' ') || 'Network'].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((zeroGStorageLogEntryFields.sequenceNumber) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
