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
		title = 'Hedera network supply observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'HederaNetworkSupply_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.HederaNetworkSupply_Timestamp>
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
	import HederaNetworkSupply_TimestampView from '$/views/HederaNetworkSupply_TimestampView.svelte'
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
				entityType={EntityType.HederaNetworkSupply_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(hederaNetworkSupplyTimestamps)}
			{@const uniqueHederaNetworkSupplyTimestamps = [...new Map(hederaNetworkSupplyTimestamps.values.map((hederaNetworkSupplyTimestamp) => [hederaNetworkSupplyTimestamp[EntityMetaKey.SelectorKey], hederaNetworkSupplyTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.HederaNetworkSupply_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={hederaNetworkSupplyTimestamps.totalCount}
				getKey={(hederaNetworkSupplyTimestamp) => hederaNetworkSupplyTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueHederaNetworkSupplyTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Hedera network supply observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: hederaNetworkSupplyTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.HederaNetworkSupply_Timestamp> })}
					{@const hederaNetworkSupplyTimestampFields = { ...hederaNetworkSupplyTimestamp[EntityMetaKey.Selector], ...hederaNetworkSupplyTimestamp }}
					<HederaNetworkSupply_TimestampView
						selection={select(EntityType.HederaNetworkSupply_Timestamp, hederaNetworkSupplyTimestamp[EntityMetaKey.Selector])}
						prefetched={hederaNetworkSupplyTimestampFields}
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
		entityType={EntityType.HederaNetworkSupply_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
