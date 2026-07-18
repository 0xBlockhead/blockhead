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
		title = 'Avalanche p chain transaction observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'AvalanchePChainTransaction_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.AvalanchePChainTransaction_Timestamp>
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
	import AvalanchePChainTransaction_TimestampView from '$/views/AvalanchePChainTransaction_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AvalanchePChainTransaction_Timestamp}
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
				status: true,
				blockHeight: true,
				source: true,
			},
		})
	}
	getResourceItems={(avalanchePChainTransactionTimestamps) => [...new Map(avalanchePChainTransactionTimestamps.values.map((avalanchePChainTransactionTimestamp) => [avalanchePChainTransactionTimestamp[EntityMetaKey.SelectorKey], avalanchePChainTransactionTimestamp])).values()]}
	getKey={(avalanchePChainTransactionTimestamp) => avalanchePChainTransactionTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Avalanche p chain transaction observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: avalanchePChainTransactionTimestamp })}
		{@const avalanchePChainTransactionTimestampFields = { ...avalanchePChainTransactionTimestamp[EntityMetaKey.Selector], ...avalanchePChainTransactionTimestamp }}
		{@const selection = select(EntityType.AvalanchePChainTransaction_Timestamp, avalanchePChainTransactionTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<AvalanchePChainTransaction_TimestampView
			selection={selection}
			prefetched={avalanchePChainTransactionTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
