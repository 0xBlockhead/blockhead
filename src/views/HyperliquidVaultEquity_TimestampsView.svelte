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
		title = 'Hyperliquid vault equity observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'HyperliquidVaultEquity_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.HyperliquidVaultEquity_Timestamp>
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
	import HyperliquidVaultEquity_TimestampView from '$/views/HyperliquidVaultEquity_TimestampView.svelte'
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
		{#snippet children(hyperliquidVaultEquityTimestamps)}
			{@const uniqueHyperliquidVaultEquityTimestamps = [...new Map(hyperliquidVaultEquityTimestamps.values.map((hyperliquidVaultEquityTimestamp) => [hyperliquidVaultEquityTimestamp[EntityMetaKey.SelectorKey], hyperliquidVaultEquityTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.HyperliquidVaultEquity_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={hyperliquidVaultEquityTimestamps.totalCount}
				getKey={(hyperliquidVaultEquityTimestamp) => hyperliquidVaultEquityTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueHyperliquidVaultEquityTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Hyperliquid vault equity observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: hyperliquidVaultEquityTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.HyperliquidVaultEquity_Timestamp> })}
					{@const hyperliquidVaultEquityTimestampFields = { ...hyperliquidVaultEquityTimestamp[EntityMetaKey.Selector], ...hyperliquidVaultEquityTimestamp }}
					<HyperliquidVaultEquity_TimestampView
						selection={select(EntityType.HyperliquidVaultEquity_Timestamp, hyperliquidVaultEquityTimestamp[EntityMetaKey.Selector])}
						prefetched={hyperliquidVaultEquityTimestampFields}
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
		entityType={EntityType.HyperliquidVaultEquity_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
