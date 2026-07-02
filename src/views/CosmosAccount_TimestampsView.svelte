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
		title = 'Account snapshots',
		typeAnnotationParagraphs = [],
		placeholderText = 'Loading Cosmos account observations...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'CosmosAccount_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.CosmosAccount_Timestamp>
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
	import CosmosAccount_TimestampView from '$/views/CosmosAccount_TimestampView.svelte'
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
					accountNumber: true,
					sequence: true,
					timestampMs: true,
				},
			}) : selection
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.CosmosAccount_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
			/>
		{/snippet}

		{#snippet children(cosmosAccountTimestamps)}
			{@const uniqueCosmosAccountTimestamps = [...new Map(cosmosAccountTimestamps.values.map((cosmosAccountTimestamp) => [cosmosAccountTimestamp[EntityMetaKey.SelectorKey], cosmosAccountTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.CosmosAccount_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={cosmosAccountTimestamps.values.length === uniqueCosmosAccountTimestamps.length && cosmosAccountTimestamps.totalCount != null && cosmosAccountTimestamps.totalCount >= uniqueCosmosAccountTimestamps.length ? cosmosAccountTimestamps.totalCount : uniqueCosmosAccountTimestamps.length}
				getKey={(cosmosAccountTimestamp) => cosmosAccountTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueCosmosAccountTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Cosmos account observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: cosmosAccountTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.CosmosAccount_Timestamp> })}
					<CosmosAccount_TimestampView
						href={
							resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos/account/[address]/observations/[timestampMs=nonNegativeInteger]/[source]', {
								caip2: `${String(({ ...cosmosAccountTimestamp.entitySelector, ...cosmosAccountTimestamp }).$account.$network.caip2.namespace)}:${String(({ ...cosmosAccountTimestamp.entitySelector, ...cosmosAccountTimestamp }).$account.$network.caip2.reference)}`,
								address: String(({ ...cosmosAccountTimestamp.entitySelector, ...cosmosAccountTimestamp }).$account.address),
								timestampMs: String(({ ...cosmosAccountTimestamp.entitySelector, ...cosmosAccountTimestamp }).timestampMs),
								source: String(({ ...cosmosAccountTimestamp.entitySelector, ...cosmosAccountTimestamp }).source),
							})
						}
						selection={select(EntityType.CosmosAccount_Timestamp, cosmosAccountTimestamp.entitySelector)}
						prefetched={cosmosAccountTimestamp}
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
		entityType={EntityType.CosmosAccount_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
