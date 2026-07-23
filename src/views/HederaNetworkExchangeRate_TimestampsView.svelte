<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
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
		title = 'Hedera network exchange rate observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'HederaNetworkExchangeRate_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.HederaNetworkExchangeRate_Timestamp>
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
	entityType={EntityType.HederaNetworkExchangeRate_Timestamp}
	{id}
	{title}
	bind:open
	{collapsible}
	{showTypeAnnotation}
	TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	resource={
		selection({
			sources: selection.sources,
		})
	}
	{countResource}
	getResourceItems={(hederaNetworkExchangeRateTimestamps) => [...new Map(hederaNetworkExchangeRateTimestamps.values.map((hederaNetworkExchangeRateTimestamp) => [hederaNetworkExchangeRateTimestamp[EntityMetaKey.SelectorKey], hederaNetworkExchangeRateTimestamp])).values()]}
	getKey={(hederaNetworkExchangeRateTimestamp) => hederaNetworkExchangeRateTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Hedera network exchange rate observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: hederaNetworkExchangeRateTimestamp })}
		{@const hederaNetworkExchangeRateTimestampFields = { ...hederaNetworkExchangeRateTimestamp[EntityMetaKey.Selector], ...hederaNetworkExchangeRateTimestamp }}
		<EntityView
			entityType={EntityType.HederaNetworkExchangeRate_Timestamp}
			entitySelector={hederaNetworkExchangeRateTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{'hedera network exchange rate timestamp'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
