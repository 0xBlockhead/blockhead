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
		title = 'Contracts',
		typeAnnotationParagraphs = [],
		placeholderText = 'Loading Cosmos contracts...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'CosmosContracts-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.CosmosContract>
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
	import CosmosContractView from '$/views/CosmosContractView.svelte'
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
					address: true,
					codeId: true,
				},
			}) : selection
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.CosmosContract}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
			/>
		{/snippet}

		{#snippet children(cosmosContracts)}
			{@const uniqueCosmosContracts = [...new Map(cosmosContracts.values.map((cosmosContract) => [cosmosContract[EntityMetaKey.SelectorKey], cosmosContract])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.CosmosContract}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={cosmosContracts.values.length === uniqueCosmosContracts.length && cosmosContracts.totalCount != null && cosmosContracts.totalCount >= uniqueCosmosContracts.length ? cosmosContracts.totalCount : uniqueCosmosContracts.length}
				getKey={(cosmosContract) => cosmosContract[EntityMetaKey.SelectorKey]}
				items={uniqueCosmosContracts}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Cosmos contracts yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: cosmosContract }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.CosmosContract> })}
					<CosmosContractView
						href={
							resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos/contract/[address]', {
								caip2: `${String(({ ...cosmosContract.entitySelector, ...cosmosContract }).$network.caip2.namespace)}:${String(({ ...cosmosContract.entitySelector, ...cosmosContract }).$network.caip2.reference)}`,
								address: String(({ ...cosmosContract.entitySelector, ...cosmosContract }).address),
							})
						}
						selection={select(EntityType.CosmosContract, cosmosContract.entitySelector)}
						prefetched={cosmosContract}
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
		entityType={EntityType.CosmosContract}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
