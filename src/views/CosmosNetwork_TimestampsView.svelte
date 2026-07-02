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
		title = 'Network snapshots',
		typeAnnotationParagraphs = [],
		placeholderText = 'Loading Cosmos network observations...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'CosmosNetwork_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.CosmosNetwork_Timestamp>
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
	import CosmosNetwork_TimestampView from '$/views/CosmosNetwork_TimestampView.svelte'
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
					source: true,
					latestBlockHeight: true,
					chainId: true,
					isSyncing: true,
				},
			}) : selection
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.CosmosNetwork_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
			/>
		{/snippet}

		{#snippet children(cosmosNetworkTimestamps)}
			{@const uniqueCosmosNetworkTimestamps = [...new Map(cosmosNetworkTimestamps.values.map((cosmosNetworkTimestamp) => [cosmosNetworkTimestamp[EntityMetaKey.SelectorKey], cosmosNetworkTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.CosmosNetwork_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={cosmosNetworkTimestamps.values.length === uniqueCosmosNetworkTimestamps.length && cosmosNetworkTimestamps.totalCount != null && cosmosNetworkTimestamps.totalCount >= uniqueCosmosNetworkTimestamps.length ? cosmosNetworkTimestamps.totalCount : uniqueCosmosNetworkTimestamps.length}
				getKey={(cosmosNetworkTimestamp) => cosmosNetworkTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueCosmosNetworkTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Cosmos network observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: cosmosNetworkTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.CosmosNetwork_Timestamp> })}
					<CosmosNetwork_TimestampView
						href={
							resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos/observations/[timestampMs=nonNegativeInteger]/[source]', {
								caip2: `${String(({ ...cosmosNetworkTimestamp.entitySelector, ...cosmosNetworkTimestamp }).$network.caip2.namespace)}:${String(({ ...cosmosNetworkTimestamp.entitySelector, ...cosmosNetworkTimestamp }).$network.caip2.reference)}`,
								timestampMs: String(({ ...cosmosNetworkTimestamp.entitySelector, ...cosmosNetworkTimestamp }).timestampMs),
								source: String(({ ...cosmosNetworkTimestamp.entitySelector, ...cosmosNetworkTimestamp }).source),
							})
						}
						selection={select(EntityType.CosmosNetwork_Timestamp, cosmosNetworkTimestamp.entitySelector)}
						prefetched={cosmosNetworkTimestamp}
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
		entityType={EntityType.CosmosNetwork_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
