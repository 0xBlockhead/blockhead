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
		title = 'Messages',
		typeAnnotationParagraphs = [],
		placeholderText = 'Loading Cosmos messages...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'CosmosMessages-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.CosmosMessage>
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
	import CosmosMessageView from '$/views/CosmosMessageView.svelte'
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
					indexInTransaction: true,
					typeUrl: true,
				},
			}) : selection
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.CosmosMessage}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
			/>
		{/snippet}

		{#snippet children(cosmosMessages)}
			{@const uniqueCosmosMessages = [...new Map(cosmosMessages.values.map((cosmosMessage) => [cosmosMessage[EntityMetaKey.SelectorKey], cosmosMessage])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.CosmosMessage}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={cosmosMessages.values.length === uniqueCosmosMessages.length && cosmosMessages.totalCount != null && cosmosMessages.totalCount >= uniqueCosmosMessages.length ? cosmosMessages.totalCount : uniqueCosmosMessages.length}
				getKey={(cosmosMessage) => cosmosMessage[EntityMetaKey.SelectorKey]}
				items={uniqueCosmosMessages}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Cosmos messages yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: cosmosMessage }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.CosmosMessage> })}
					<CosmosMessageView
						href={
							resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos/tx/[txHash]/messages/[messageIndex=nonNegativeInteger]', {
								caip2: `${String(({ ...cosmosMessage.entitySelector, ...cosmosMessage }).$transaction.$network.caip2.namespace)}:${String(({ ...cosmosMessage.entitySelector, ...cosmosMessage }).$transaction.$network.caip2.reference)}`,
								txHash: String(({ ...cosmosMessage.entitySelector, ...cosmosMessage }).$transaction.txHash),
								messageIndex: String(({ ...cosmosMessage.entitySelector, ...cosmosMessage }).indexInTransaction),
							})
						}
						selection={select(EntityType.CosmosMessage, cosmosMessage.entitySelector)}
						prefetched={cosmosMessage}
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
		entityType={EntityType.CosmosMessage}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
