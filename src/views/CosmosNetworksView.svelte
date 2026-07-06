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
		title = 'Cosmos networks',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'CosmosNetworks-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.CosmosNetwork>
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
	import CosmosNetworkView from '$/views/CosmosNetworkView.svelte'
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
					$network: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.CosmosNetwork}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(cosmosNetworks)}
			{@const uniqueCosmosNetworks = [...new Map(cosmosNetworks.values.map((cosmosNetwork) => [cosmosNetwork[EntityMetaKey.SelectorKey], cosmosNetwork])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.CosmosNetwork}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={cosmosNetworks.totalCount}
				getKey={(cosmosNetwork) => cosmosNetwork[EntityMetaKey.SelectorKey]}
				items={uniqueCosmosNetworks}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Cosmos networks yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: cosmosNetwork }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.CosmosNetwork> })}
					{@const cosmosNetworkFields = { ...cosmosNetwork[EntityMetaKey.Selector], ...cosmosNetwork }}
					{@const cosmosNetworkHrefFields = { ...cosmosNetwork, ...cosmosNetwork[EntityMetaKey.Selector] }}
					<CosmosNetworkView
						selection={select(EntityType.CosmosNetwork, cosmosNetwork[EntityMetaKey.Selector])}
						prefetched={cosmosNetworkFields}
						href={
							(cosmosNetworkHrefFields.$network !== undefined && cosmosNetworkHrefFields.$network.caip2 !== undefined && cosmosNetworkHrefFields.$network.caip2.namespace !== undefined && cosmosNetworkHrefFields.$network !== undefined && cosmosNetworkHrefFields.$network.caip2 !== undefined && cosmosNetworkHrefFields.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos', {
								caip2: `${String(cosmosNetworkHrefFields.$network.caip2.namespace ?? '')}:${String(cosmosNetworkHrefFields.$network.caip2.reference ?? '')}`,
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
		entityType={EntityType.CosmosNetwork}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
