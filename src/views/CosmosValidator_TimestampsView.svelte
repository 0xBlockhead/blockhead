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
		title = 'Validator snapshots',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'CosmosValidator_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.CosmosValidator_Timestamp>
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
	import CosmosValidator_TimestampView from '$/views/CosmosValidator_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CosmosValidator_Timestamp}
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
				status: true,
				tokens: true,
				timestampMs: true,
			},
		})
	}
	getResourceItems={(cosmosValidatorTimestamps) => [...new Map(cosmosValidatorTimestamps.values.map((cosmosValidatorTimestamp) => [cosmosValidatorTimestamp[EntityMetaKey.SelectorKey], cosmosValidatorTimestamp])).values()]}
	getKey={(cosmosValidatorTimestamp) => cosmosValidatorTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Cosmos validator observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: cosmosValidatorTimestamp })}
		{@const cosmosValidatorTimestampFields = { ...cosmosValidatorTimestamp[EntityMetaKey.Selector], ...cosmosValidatorTimestamp }}
		{@const selection = select(EntityType.CosmosValidator_Timestamp, cosmosValidatorTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<CosmosValidator_TimestampView
			selection={selection}
			prefetched={cosmosValidatorTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
