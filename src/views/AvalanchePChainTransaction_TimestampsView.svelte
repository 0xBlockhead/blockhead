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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.AvalanchePChainTransaction_Timestamp>
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
	{countResource}
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
		<EntityView
			entityType={EntityType.AvalanchePChainTransaction_Timestamp}
			entitySelector={avalanchePChainTransactionTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((avalanchePChainTransactionTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ') || 'avalanche p chain transaction timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((avalanchePChainTransactionTimestampFields.status) ?? ''), String((avalanchePChainTransactionTimestampFields.blockHeight) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((avalanchePChainTransactionTimestampFields.source) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
