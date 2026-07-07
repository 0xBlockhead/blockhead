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
		title = 'Modules',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'CosmosModules-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.CosmosModule>
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
	import CosmosModuleView from '$/views/CosmosModuleView.svelte'
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
					moduleName: true,
					$network: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.CosmosModule}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(cosmosModules)}
			{@const uniqueCosmosModules = [...new Map(cosmosModules.values.map((cosmosModule) => [cosmosModule[EntityMetaKey.SelectorKey], cosmosModule])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.CosmosModule}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={cosmosModules.totalCount}
				getKey={(cosmosModule) => cosmosModule[EntityMetaKey.SelectorKey]}
				items={uniqueCosmosModules}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Cosmos modules yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: cosmosModule }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.CosmosModule> })}
					{@const cosmosModuleFields = { ...cosmosModule[EntityMetaKey.Selector], ...cosmosModule }}
					{@const cosmosModuleHrefFields = { ...cosmosModule, ...cosmosModule[EntityMetaKey.Selector] }}
					<CosmosModuleView
						selection={select(EntityType.CosmosModule, cosmosModule[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={cosmosModuleFields}
						href={
							(cosmosModuleHrefFields.$network !== undefined && cosmosModuleHrefFields.$network.caip2 !== undefined && cosmosModuleHrefFields.$network.caip2.namespace !== undefined && cosmosModuleHrefFields.$network !== undefined && cosmosModuleHrefFields.$network.caip2 !== undefined && cosmosModuleHrefFields.$network.caip2.reference !== undefined && cosmosModuleHrefFields.moduleName !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos/module/[moduleName]', {
								caip2: `${String(cosmosModuleHrefFields.$network.caip2.namespace ?? '')}:${String(cosmosModuleHrefFields.$network.caip2.reference ?? '')}`,
								moduleName: String(cosmosModuleHrefFields.moduleName ?? ''),
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
		entityType={EntityType.CosmosModule}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
