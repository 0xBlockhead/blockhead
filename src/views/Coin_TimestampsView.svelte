<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntitiesListForwardProps } from '$/components/EntitiesList.svelte'
	import type { RegisteredEntityProxyEntitiesSelection } from '$/client/$proxy.svelte.ts'
	import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'




	// State
	let {
		selection,
		countResource,
		title = 'Coin observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'Coin_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.Coin_Timestamp>
			countResource?: SvelteKitResource<number>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		EntitiesListForwardProps
	> = $props()


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.Coin_Timestamp}
	{id}
	{title}
	bind:open
	{collapsible}
	{showTypeAnnotation}
	TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	resource={
		selection({
			sources: selection.sources,
			fields: {
				$coin: true,
				marketCap: true,
				marketCapUsd: true,
				change24hPercent: true,
				timestampMs: true,
				source: true,
			},
		})
	}
	{countResource}
	getResourceItems={(coinTimestamps) => [...new Map(coinTimestamps.values.map((coinTimestamp) => [coinTimestamp[EntityMetaKey.SelectorKey], coinTimestamp])).values()]}
	getKey={(coinTimestamp) => coinTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Coin observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: coinTimestamp })}
		{@const coinTimestampFields = { ...coinTimestamp[EntityMetaKey.Selector], ...coinTimestamp }}
		<EntityView
			entityType={EntityType.Coin_Timestamp}
			entitySelector={coinTimestamp[EntityMetaKey.Selector]}
			href={
				(
					coinTimestamp[EntityMetaKey.Selector] != null && 'timestampMs' in coinTimestamp[EntityMetaKey.Selector]
					&& coinTimestamp[EntityMetaKey.Selector].timestampMs != null
					&& coinTimestamp[EntityMetaKey.Selector] != null && 'source' in coinTimestamp[EntityMetaKey.Selector]
					&& coinTimestamp[EntityMetaKey.Selector].source != null
					&& coinTimestamp[EntityMetaKey.Selector] != null && '$coin' in coinTimestamp[EntityMetaKey.Selector]
					&& coinTimestamp[EntityMetaKey.Selector].$coin != null && 'coinId' in coinTimestamp[EntityMetaKey.Selector].$coin
					&& coinTimestamp[EntityMetaKey.Selector].$coin.coinId != null ?
						resolve('/coin/[coinId=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
					timestampMs: String(coinTimestamp[EntityMetaKey.Selector].timestampMs ?? ''),
					source: String(coinTimestamp[EntityMetaKey.Selector].source ?? ''),
					coinId: String(coinTimestamp[EntityMetaKey.Selector].$coin.coinId ?? ''),
				})
				:
						undefined
				)
			}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[[String((coinTimestampFields.$coin.symbol) ?? ''), String((coinTimestampFields.$coin.name) ?? '')].filter(Boolean).join(' ') || 'Coin'].filter(Boolean).join(' ') || 'coin timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((coinTimestampFields.marketCap) ?? ''), String((coinTimestampFields.marketCapUsd) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[(String((coinTimestampFields.change24hPercent) ?? '') ? String((coinTimestampFields.change24hPercent) ?? '') + '%' : '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
