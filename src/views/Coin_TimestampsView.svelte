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
		title = 'Coin observations',
		typeAnnotationParagraphs = [],
		placeholderText = 'Loading Coin observations...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'Coin_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.Coin_Timestamp>
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
	import Coin_TimestampView from '$/views/Coin_TimestampView.svelte'
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
					$coin: true,
					marketCap: true,
					marketCapUsd: true,
					change24hPercent: true,
				},
			}) : selection
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.Coin_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
			/>
		{/snippet}

		{#snippet children(coinTimestamps)}
			{@const uniqueCoinTimestamps = [...new Map(coinTimestamps.values.map((coinTimestamp) => [coinTimestamp[EntityMetaKey.SelectorKey], coinTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.Coin_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={coinTimestamps.values.length === uniqueCoinTimestamps.length && coinTimestamps.totalCount != null && coinTimestamps.totalCount >= uniqueCoinTimestamps.length ? coinTimestamps.totalCount : uniqueCoinTimestamps.length}
				getKey={(coinTimestamp) => coinTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueCoinTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No coin observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: coinTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.Coin_Timestamp> })}
					<Coin_TimestampView
						href={
							resolve('/(assets)/coin/[coinId]/observations/[timestampMs=nonNegativeInteger]/[source]', {
								coinId: String(({ ...coinTimestamp.entitySelector, ...coinTimestamp }).$coin.coinId),
								timestampMs: String(({ ...coinTimestamp.entitySelector, ...coinTimestamp }).timestampMs),
								source: String(({ ...coinTimestamp.entitySelector, ...coinTimestamp }).source),
							})
						}
						selection={select(EntityType.Coin_Timestamp, coinTimestamp.entitySelector)}
						prefetched={coinTimestamp}
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
		entityType={EntityType.Coin_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
