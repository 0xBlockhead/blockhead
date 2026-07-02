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
		title = 'Validator snapshots',
		typeAnnotationParagraphs = [],
		placeholderText = 'Loading Cosmos validator observations...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'CosmosValidator_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.CosmosValidator_Timestamp>
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
	import CosmosValidator_TimestampView from '$/views/CosmosValidator_TimestampView.svelte'
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
					status: true,
					tokens: true,
					timestampMs: true,
				},
			}) : selection
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.CosmosValidator_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
			/>
		{/snippet}

		{#snippet children(cosmosValidatorTimestamps)}
			{@const uniqueCosmosValidatorTimestamps = [...new Map(cosmosValidatorTimestamps.values.map((cosmosValidatorTimestamp) => [cosmosValidatorTimestamp[EntityMetaKey.SelectorKey], cosmosValidatorTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.CosmosValidator_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={cosmosValidatorTimestamps.values.length === uniqueCosmosValidatorTimestamps.length && cosmosValidatorTimestamps.totalCount != null && cosmosValidatorTimestamps.totalCount >= uniqueCosmosValidatorTimestamps.length ? cosmosValidatorTimestamps.totalCount : uniqueCosmosValidatorTimestamps.length}
				getKey={(cosmosValidatorTimestamp) => cosmosValidatorTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueCosmosValidatorTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Cosmos validator observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: cosmosValidatorTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.CosmosValidator_Timestamp> })}
					<CosmosValidator_TimestampView
						href={
							resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos/validator/[operatorAddress]/observations/[timestampMs=nonNegativeInteger]/[source]', {
								caip2: `${String(({ ...cosmosValidatorTimestamp.entitySelector, ...cosmosValidatorTimestamp }).$validator.$network.caip2.namespace)}:${String(({ ...cosmosValidatorTimestamp.entitySelector, ...cosmosValidatorTimestamp }).$validator.$network.caip2.reference)}`,
								operatorAddress: String(({ ...cosmosValidatorTimestamp.entitySelector, ...cosmosValidatorTimestamp }).$validator.operatorAddress),
								timestampMs: String(({ ...cosmosValidatorTimestamp.entitySelector, ...cosmosValidatorTimestamp }).timestampMs),
								source: String(({ ...cosmosValidatorTimestamp.entitySelector, ...cosmosValidatorTimestamp }).source),
							})
						}
						selection={select(EntityType.CosmosValidator_Timestamp, cosmosValidatorTimestamp.entitySelector)}
						prefetched={cosmosValidatorTimestamp}
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
		entityType={EntityType.CosmosValidator_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
