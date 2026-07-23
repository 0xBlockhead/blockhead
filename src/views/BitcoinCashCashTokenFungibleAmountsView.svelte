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
		title = 'Bitcoin Cash CashToken fungible amounts',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BitcoinCashCashTokenFungibleAmounts-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BitcoinCashCashTokenFungibleAmount>
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
	entityType={EntityType.BitcoinCashCashTokenFungibleAmount}
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
				amount: true,
				$category: true,
			},
		})
	}
	{countResource}
	getResourceItems={(bitcoinCashCashTokenFungibleAmounts) => [...new Map(bitcoinCashCashTokenFungibleAmounts.values.map((bitcoinCashCashTokenFungibleAmount) => [bitcoinCashCashTokenFungibleAmount[EntityMetaKey.SelectorKey], bitcoinCashCashTokenFungibleAmount])).values()]}
	getKey={(bitcoinCashCashTokenFungibleAmount) => bitcoinCashCashTokenFungibleAmount[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Bitcoin Cash CashToken fungible amounts yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: bitcoinCashCashTokenFungibleAmount })}
		{@const bitcoinCashCashTokenFungibleAmountFields = { ...bitcoinCashCashTokenFungibleAmount[EntityMetaKey.Selector], ...bitcoinCashCashTokenFungibleAmount }}
		<EntityView
			entityType={EntityType.BitcoinCashCashTokenFungibleAmount}
			entitySelector={bitcoinCashCashTokenFungibleAmount[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((bitcoinCashCashTokenFungibleAmountFields.amount) ?? '')].filter(Boolean).join(' ') || 'Bitcoin Cash CashToken fungible amount'}
			{/snippet}

			{#snippet Value()}
				{[String((bitcoinCashCashTokenFungibleAmountFields.amount) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[[String((bitcoinCashCashTokenFungibleAmountFields.$category.categoryId) ?? '')].filter(Boolean).join(' ') || 'Bitcoin Cash CashToken category'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
