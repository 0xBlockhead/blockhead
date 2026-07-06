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
		title = 'Validators',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'CosmosValidators-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.CosmosValidator>
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
	import CosmosValidatorView from '$/views/CosmosValidatorView.svelte'
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
					moniker: true,
					operatorAddress: true,
					$network: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.CosmosValidator}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(cosmosValidators)}
			{@const uniqueCosmosValidators = [...new Map(cosmosValidators.values.map((cosmosValidator) => [cosmosValidator[EntityMetaKey.SelectorKey], cosmosValidator])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.CosmosValidator}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={cosmosValidators.totalCount}
				getKey={(cosmosValidator) => cosmosValidator[EntityMetaKey.SelectorKey]}
				items={uniqueCosmosValidators}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Cosmos validators yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: cosmosValidator }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.CosmosValidator> })}
					{@const cosmosValidatorFields = { ...cosmosValidator[EntityMetaKey.Selector], ...cosmosValidator }}
					{@const cosmosValidatorHrefFields = { ...cosmosValidator, ...cosmosValidator[EntityMetaKey.Selector] }}
					<CosmosValidatorView
						selection={select(EntityType.CosmosValidator, cosmosValidator[EntityMetaKey.Selector])}
						prefetched={cosmosValidatorFields}
						href={
							(cosmosValidatorHrefFields.$network !== undefined && cosmosValidatorHrefFields.$network.caip2 !== undefined && cosmosValidatorHrefFields.$network.caip2.namespace !== undefined && cosmosValidatorHrefFields.$network !== undefined && cosmosValidatorHrefFields.$network.caip2 !== undefined && cosmosValidatorHrefFields.$network.caip2.reference !== undefined && cosmosValidatorHrefFields.operatorAddress !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos/validator/[operatorAddress]', {
								caip2: `${String(cosmosValidatorHrefFields.$network.caip2.namespace ?? '')}:${String(cosmosValidatorHrefFields.$network.caip2.reference ?? '')}`,
								operatorAddress: String(cosmosValidatorHrefFields.operatorAddress ?? ''),
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
		entityType={EntityType.CosmosValidator}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
