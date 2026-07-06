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
		title = 'Hedera network stake observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'HederaNetworkStake_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.HederaNetworkStake_Timestamp>
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
	import HederaNetworkStake_TimestampView from '$/views/HederaNetworkStake_TimestampView.svelte'
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
				entityType={EntityType.HederaNetworkStake_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(hederaNetworkStakeTimestamps)}
			{@const uniqueHederaNetworkStakeTimestamps = [...new Map(hederaNetworkStakeTimestamps.values.map((hederaNetworkStakeTimestamp) => [hederaNetworkStakeTimestamp[EntityMetaKey.SelectorKey], hederaNetworkStakeTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.HederaNetworkStake_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={hederaNetworkStakeTimestamps.totalCount}
				getKey={(hederaNetworkStakeTimestamp) => hederaNetworkStakeTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueHederaNetworkStakeTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Hedera network stake observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: hederaNetworkStakeTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.HederaNetworkStake_Timestamp> })}
					{@const hederaNetworkStakeTimestampFields = { ...hederaNetworkStakeTimestamp[EntityMetaKey.Selector], ...hederaNetworkStakeTimestamp }}
					<HederaNetworkStake_TimestampView
						selection={select(EntityType.HederaNetworkStake_Timestamp, hederaNetworkStakeTimestamp[EntityMetaKey.Selector])}
						prefetched={hederaNetworkStakeTimestampFields}
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
		entityType={EntityType.HederaNetworkStake_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
