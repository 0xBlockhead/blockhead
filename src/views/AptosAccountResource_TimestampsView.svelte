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
		title = 'Aptos account resource observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'AptosAccountResource_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.AptosAccountResource_Timestamp>
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
	import AptosAccountResource_TimestampView from '$/views/AptosAccountResource_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AptosAccountResource_Timestamp}
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
				ledgerVersion: true,
				timestampMs: true,
				source: true,
			},
		})
	}
	getResourceItems={(aptosAccountResourceTimestamps) => [...new Map(aptosAccountResourceTimestamps.values.map((aptosAccountResourceTimestamp) => [aptosAccountResourceTimestamp[EntityMetaKey.SelectorKey], aptosAccountResourceTimestamp])).values()]}
	getKey={(aptosAccountResourceTimestamp) => aptosAccountResourceTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Aptos account resource observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: aptosAccountResourceTimestamp })}
		{@const aptosAccountResourceTimestampFields = { ...aptosAccountResourceTimestamp[EntityMetaKey.Selector], ...aptosAccountResourceTimestamp }}
		{@const selection = select(EntityType.AptosAccountResource_Timestamp, aptosAccountResourceTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<AptosAccountResource_TimestampView
			selection={selection}
			prefetched={aptosAccountResourceTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
