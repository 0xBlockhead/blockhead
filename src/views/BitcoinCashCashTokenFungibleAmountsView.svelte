<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
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
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BitcoinCashCashTokenFungibleAmount>
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

	const collectionSelection = $derived(selection)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import BitcoinCashCashTokenFungibleAmountView from '$/views/BitcoinCashCashTokenFungibleAmountView.svelte'
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
		{@const selection = select(EntityType.BitcoinCashCashTokenFungibleAmount, bitcoinCashCashTokenFungibleAmount[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<BitcoinCashCashTokenFungibleAmountView
			selection={selection}
			prefetched={bitcoinCashCashTokenFungibleAmountFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
