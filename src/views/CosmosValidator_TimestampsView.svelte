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
		placeholderText,
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
			selection({
				fields: {
					source: true,
					status: true,
					tokens: true,
					timestampMs: true,
					$validator: true,
				},
			})
		}
		{placeholderText}
	>
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
				totalCount={cosmosValidatorTimestamps.totalCount}
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
					{@const cosmosValidatorTimestampFields = { ...cosmosValidatorTimestamp[EntityMetaKey.Selector], ...cosmosValidatorTimestamp }}
					{@const cosmosValidatorTimestampHrefFields = { ...cosmosValidatorTimestamp, ...cosmosValidatorTimestamp[EntityMetaKey.Selector] }}
					<CosmosValidator_TimestampView
						selection={select(EntityType.CosmosValidator_Timestamp, cosmosValidatorTimestamp[EntityMetaKey.Selector])}
						prefetched={cosmosValidatorTimestampFields}
						href={
							(cosmosValidatorTimestampHrefFields.$validator !== undefined && cosmosValidatorTimestampHrefFields.$validator.$network !== undefined && cosmosValidatorTimestampHrefFields.$validator.$network.caip2 !== undefined && cosmosValidatorTimestampHrefFields.$validator.$network.caip2.namespace !== undefined && cosmosValidatorTimestampHrefFields.$validator !== undefined && cosmosValidatorTimestampHrefFields.$validator.$network !== undefined && cosmosValidatorTimestampHrefFields.$validator.$network.caip2 !== undefined && cosmosValidatorTimestampHrefFields.$validator.$network.caip2.reference !== undefined && cosmosValidatorTimestampHrefFields.$validator !== undefined && cosmosValidatorTimestampHrefFields.$validator.operatorAddress !== undefined && cosmosValidatorTimestampHrefFields.timestampMs !== undefined && cosmosValidatorTimestampHrefFields.source !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos/validator/[operatorAddress]/observations/[timestampMs=nonNegativeInteger]/[source]', {
								caip2: `${String(cosmosValidatorTimestampHrefFields.$validator.$network.caip2.namespace ?? '')}:${String(cosmosValidatorTimestampHrefFields.$validator.$network.caip2.reference ?? '')}`,
								operatorAddress: String(cosmosValidatorTimestampHrefFields.$validator.operatorAddress ?? ''),
								timestampMs: String(cosmosValidatorTimestampHrefFields.timestampMs ?? ''),
								source: String(cosmosValidatorTimestampHrefFields.source ?? ''),
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
		entityType={EntityType.CosmosValidator_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
