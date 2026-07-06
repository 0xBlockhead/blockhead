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
		placeholderText,
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
			selection({
				fields: {
					height: true,
					hash: true,
					transactionCount: true,
					$network: true,
				},
			})
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
				placeholderText={placeholderText}
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
				totalCount={cosmosBlocks.totalCount}
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
					{@const cosmosBlockFields = { ...cosmosBlock[EntityMetaKey.Selector], ...cosmosBlock }}
					{@const cosmosBlockHrefFields = { ...cosmosBlock, ...cosmosBlock[EntityMetaKey.Selector] }}
					<CosmosBlockView
						selection={select(EntityType.CosmosBlock, cosmosBlock[EntityMetaKey.Selector])}
						prefetched={cosmosBlockFields}
						href={
							(cosmosBlockHrefFields.$network !== undefined && cosmosBlockHrefFields.$network.caip2 !== undefined && cosmosBlockHrefFields.$network.caip2.namespace !== undefined && cosmosBlockHrefFields.$network !== undefined && cosmosBlockHrefFields.$network.caip2 !== undefined && cosmosBlockHrefFields.$network.caip2.reference !== undefined && cosmosBlockHrefFields.height !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos/block/[height=nonNegativeInteger]', {
								caip2: `${String(cosmosBlockHrefFields.$network.caip2.namespace ?? '')}:${String(cosmosBlockHrefFields.$network.caip2.reference ?? '')}`,
								height: String(cosmosBlockHrefFields.height ?? ''),
							}) : undefined)
						}
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
