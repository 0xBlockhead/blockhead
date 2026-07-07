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
		title = 'Finality',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EthereumBeaconFinality_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.EthereumBeaconFinality_Timestamp>
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
	import EthereumBeaconFinality_TimestampView from '$/views/EthereumBeaconFinality_TimestampView.svelte'
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
					finalizedCheckpointEpoch: true,
					timestampMs: true,
					$network: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.EthereumBeaconFinality_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(ethereumBeaconFinalityTimestamps)}
			{@const uniqueEthereumBeaconFinalityTimestamps = [...new Map(ethereumBeaconFinalityTimestamps.values.map((ethereumBeaconFinalityTimestamp) => [ethereumBeaconFinalityTimestamp[EntityMetaKey.SelectorKey], ethereumBeaconFinalityTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.EthereumBeaconFinality_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={ethereumBeaconFinalityTimestamps.totalCount}
				getKey={(ethereumBeaconFinalityTimestamp) => ethereumBeaconFinalityTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueEthereumBeaconFinalityTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Ethereum beacon finality observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: ethereumBeaconFinalityTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.EthereumBeaconFinality_Timestamp> })}
					{@const ethereumBeaconFinalityTimestampFields = { ...ethereumBeaconFinalityTimestamp[EntityMetaKey.Selector], ...ethereumBeaconFinalityTimestamp }}
					{@const ethereumBeaconFinalityTimestampHrefFields = { ...ethereumBeaconFinalityTimestamp, ...ethereumBeaconFinalityTimestamp[EntityMetaKey.Selector] }}
					<EthereumBeaconFinality_TimestampView
						selection={select(EntityType.EthereumBeaconFinality_Timestamp, ethereumBeaconFinalityTimestamp[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={ethereumBeaconFinalityTimestampFields}
						href={
							(ethereumBeaconFinalityTimestampHrefFields.$network !== undefined && ethereumBeaconFinalityTimestampHrefFields.$network.caip2 !== undefined && ethereumBeaconFinalityTimestampHrefFields.$network.caip2.namespace !== undefined && ethereumBeaconFinalityTimestampHrefFields.$network !== undefined && ethereumBeaconFinalityTimestampHrefFields.$network.caip2 !== undefined && ethereumBeaconFinalityTimestampHrefFields.$network.caip2.reference !== undefined && ethereumBeaconFinalityTimestampHrefFields.timestampMs !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/finality/[timestampMs=nonNegativeInteger]', {
								caip2: `${String(ethereumBeaconFinalityTimestampHrefFields.$network.caip2.namespace ?? '')}:${String(ethereumBeaconFinalityTimestampHrefFields.$network.caip2.reference ?? '')}`,
								timestampMs: String(ethereumBeaconFinalityTimestampHrefFields.timestampMs ?? ''),
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
		entityType={EntityType.EthereumBeaconFinality_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
