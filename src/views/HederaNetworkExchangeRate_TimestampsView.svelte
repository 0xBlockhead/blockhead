<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
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
		title = 'Hedera network exchange rate observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'HederaNetworkExchangeRate_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.HederaNetworkExchangeRate_Timestamp>
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
	import HederaNetworkExchangeRate_TimestampView from '$/views/HederaNetworkExchangeRate_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#if open}
	<ResourceBoundary
		resource={selection}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.HederaNetworkExchangeRate_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(hederaNetworkExchangeRateTimestamps)}
			{@const uniqueHederaNetworkExchangeRateTimestamps = [...new Map(hederaNetworkExchangeRateTimestamps.values.map((hederaNetworkExchangeRateTimestamp) => [hederaNetworkExchangeRateTimestamp[EntityMetaKey.SelectorKey], hederaNetworkExchangeRateTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.HederaNetworkExchangeRate_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={hederaNetworkExchangeRateTimestamps.totalCount}
				getKey={(hederaNetworkExchangeRateTimestamp) => hederaNetworkExchangeRateTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueHederaNetworkExchangeRateTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Hedera network exchange rate observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: hederaNetworkExchangeRateTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.HederaNetworkExchangeRate_Timestamp> })}
					{@const hederaNetworkExchangeRateTimestampFields = { ...hederaNetworkExchangeRateTimestamp[EntityMetaKey.Selector], ...hederaNetworkExchangeRateTimestamp }}
					<HederaNetworkExchangeRate_TimestampView
						selection={select(EntityType.HederaNetworkExchangeRate_Timestamp, hederaNetworkExchangeRateTimestamp[EntityMetaKey.Selector])}
						prefetched={hederaNetworkExchangeRateTimestampFields}
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
		entityType={EntityType.HederaNetworkExchangeRate_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
