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
		placeholderText,
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
			selection({
				fields: {
					source: true,
					accountNumber: true,
					sequence: true,
					timestampMs: true,
					$account: true,
				},
			})
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
				placeholderText={placeholderText}
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
				totalCount={cosmosAccountTimestamps.totalCount}
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
					{@const cosmosAccountTimestampFields = { ...cosmosAccountTimestamp[EntityMetaKey.Selector], ...cosmosAccountTimestamp }}
					{@const cosmosAccountTimestampHrefFields = { ...cosmosAccountTimestamp, ...cosmosAccountTimestamp[EntityMetaKey.Selector] }}
					<CosmosAccount_TimestampView
						selection={select(EntityType.CosmosAccount_Timestamp, cosmosAccountTimestamp[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={cosmosAccountTimestampFields}
						href={
							(cosmosAccountTimestampHrefFields.$account !== undefined && cosmosAccountTimestampHrefFields.$account.$network !== undefined && cosmosAccountTimestampHrefFields.$account.$network.caip2 !== undefined && cosmosAccountTimestampHrefFields.$account.$network.caip2.namespace !== undefined && cosmosAccountTimestampHrefFields.$account !== undefined && cosmosAccountTimestampHrefFields.$account.$network !== undefined && cosmosAccountTimestampHrefFields.$account.$network.caip2 !== undefined && cosmosAccountTimestampHrefFields.$account.$network.caip2.reference !== undefined && cosmosAccountTimestampHrefFields.$account !== undefined && cosmosAccountTimestampHrefFields.$account.address !== undefined && cosmosAccountTimestampHrefFields.timestampMs !== undefined && cosmosAccountTimestampHrefFields.source !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos/account/[address]/observations/[timestampMs=nonNegativeInteger]/[source]', {
								caip2: `${String(cosmosAccountTimestampHrefFields.$account.$network.caip2.namespace ?? '')}:${String(cosmosAccountTimestampHrefFields.$account.$network.caip2.reference ?? '')}`,
								address: String(cosmosAccountTimestampHrefFields.$account.address ?? ''),
								timestampMs: String(cosmosAccountTimestampHrefFields.timestampMs ?? ''),
								source: String(cosmosAccountTimestampHrefFields.source ?? ''),
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
		entityType={EntityType.CosmosAccount_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
