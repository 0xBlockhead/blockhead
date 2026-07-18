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
		title = 'Account snapshots',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'CosmosAccount_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.CosmosAccount_Timestamp>
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
	import CosmosAccount_TimestampView from '$/views/CosmosAccount_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CosmosAccount_Timestamp}
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
				source: true,
				accountNumber: true,
				sequence: true,
				timestampMs: true,
			},
		})
	}
	getResourceItems={(cosmosAccountTimestamps) => [...new Map(cosmosAccountTimestamps.values.map((cosmosAccountTimestamp) => [cosmosAccountTimestamp[EntityMetaKey.SelectorKey], cosmosAccountTimestamp])).values()]}
	getKey={(cosmosAccountTimestamp) => cosmosAccountTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Cosmos account observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: cosmosAccountTimestamp })}
		{@const cosmosAccountTimestampFields = { ...cosmosAccountTimestamp[EntityMetaKey.Selector], ...cosmosAccountTimestamp }}
		{@const selection = select(EntityType.CosmosAccount_Timestamp, cosmosAccountTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<CosmosAccount_TimestampView
			selection={selection}
			prefetched={cosmosAccountTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
