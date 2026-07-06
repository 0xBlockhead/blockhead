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
		placeholderText,
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
			selection({
				fields: {
					address: true,
					codeId: true,
					$network: true,
				},
			})
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
				placeholderText={placeholderText}
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
				totalCount={cosmosContracts.totalCount}
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
					{@const cosmosContractFields = { ...cosmosContract[EntityMetaKey.Selector], ...cosmosContract }}
					{@const cosmosContractHrefFields = { ...cosmosContract, ...cosmosContract[EntityMetaKey.Selector] }}
					<CosmosContractView
						selection={select(EntityType.CosmosContract, cosmosContract[EntityMetaKey.Selector])}
						prefetched={cosmosContractFields}
						href={
							(cosmosContractHrefFields.$network !== undefined && cosmosContractHrefFields.$network.caip2 !== undefined && cosmosContractHrefFields.$network.caip2.namespace !== undefined && cosmosContractHrefFields.$network !== undefined && cosmosContractHrefFields.$network.caip2 !== undefined && cosmosContractHrefFields.$network.caip2.reference !== undefined && cosmosContractHrefFields.address !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos/contract/[address]', {
								caip2: `${String(cosmosContractHrefFields.$network.caip2.namespace ?? '')}:${String(cosmosContractHrefFields.$network.caip2.reference ?? '')}`,
								address: String(cosmosContractHrefFields.address ?? ''),
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
		entityType={EntityType.CosmosContract}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
