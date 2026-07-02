<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
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
		title = 'Blocks',
		typeAnnotationParagraphs = [],
		placeholderText = 'Loading Cosmos blocks...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'CosmosBlocks-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.CosmosBlock>
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
	import CosmosBlockView from '$/views/CosmosBlockView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#if open}
	<ResourceBoundary
		resource={
			selection.sources == null ? selection({
				fields: {
					height: true,
					hash: true,
					transactionCount: true,
				},
			}) : selection
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.CosmosBlock}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
			/>
		{/snippet}

		{#snippet children(cosmosBlocks)}
			{@const uniqueCosmosBlocks = [...new Map(cosmosBlocks.values.map((cosmosBlock) => [cosmosBlock[EntityMetaKey.SelectorKey], cosmosBlock])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.CosmosBlock}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={cosmosBlocks.values.length === uniqueCosmosBlocks.length && cosmosBlocks.totalCount != null && cosmosBlocks.totalCount >= uniqueCosmosBlocks.length ? cosmosBlocks.totalCount : uniqueCosmosBlocks.length}
				getKey={(cosmosBlock) => cosmosBlock[EntityMetaKey.SelectorKey]}
				items={uniqueCosmosBlocks}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Cosmos blocks yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: cosmosBlock }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.CosmosBlock> })}
					<CosmosBlockView
						href={
							resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos/block/[height=nonNegativeInteger]', {
								caip2: `${String(({ ...cosmosBlock.entitySelector, ...cosmosBlock }).$network.caip2.namespace)}:${String(({ ...cosmosBlock.entitySelector, ...cosmosBlock }).$network.caip2.reference)}`,
								height: String(({ ...cosmosBlock.entitySelector, ...cosmosBlock }).height),
							})
						}
						selection={select(EntityType.CosmosBlock, cosmosBlock.entitySelector)}
						prefetched={cosmosBlock}
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
		entityType={EntityType.CosmosBlock}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
