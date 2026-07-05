<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { SubscribeEntityReferenceResult } from '$/client/$client.svelte.ts'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Avalanche p chain transaction observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'AvalanchePChainTransaction_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.AvalanchePChainTransaction_Timestamp>
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


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import AvalanchePChainTransaction_TimestampView from '$/views/AvalanchePChainTransaction_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#if open}
	<ResourceBoundary
		resource={
			selection({
				fields: {
					timestampMs: true,
					status: true,
					blockHeight: true,
					source: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet children(avalanchePChainTransactionTimestamps)}
			{@const uniqueAvalanchePChainTransactionTimestamps = [...new Map(avalanchePChainTransactionTimestamps.values.map((avalanchePChainTransactionTimestamp) => [avalanchePChainTransactionTimestamp[EntityMetaKey.SelectorKey], avalanchePChainTransactionTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.AvalanchePChainTransaction_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={avalanchePChainTransactionTimestamps.totalCount}
				getKey={(avalanchePChainTransactionTimestamp) => avalanchePChainTransactionTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueAvalanchePChainTransactionTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Avalanche p chain transaction observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: avalanchePChainTransactionTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.AvalanchePChainTransaction_Timestamp> })}
					{@const avalanchePChainTransactionTimestampFields = { ...avalanchePChainTransactionTimestamp[EntityMetaKey.Selector], ...avalanchePChainTransactionTimestamp }}
					<AvalanchePChainTransaction_TimestampView
						selection={select(EntityType.AvalanchePChainTransaction_Timestamp, avalanchePChainTransactionTimestamp[EntityMetaKey.Selector])}
						prefetched={avalanchePChainTransactionTimestampFields}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/snippet}
	</ResourceBoundary>
{:else}
	<EntitiesList
		{...EntitiesListProps}
		entityType={EntityType.AvalanchePChainTransaction_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
