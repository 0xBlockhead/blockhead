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
		title = 'Bitcoin Cash CashToken NFTs',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BitcoinCashCashTokenNFTs-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BitcoinCashCashTokenNft>
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
	import BitcoinCashCashTokenNftView from '$/views/BitcoinCashCashTokenNftView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BitcoinCashCashTokenNft}
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
				capability: true,
				$category: true,
				$commitment: true,
			},
		})
	}
	getResourceItems={(bitcoinCashCashTokenNFTs) => [...new Map(bitcoinCashCashTokenNFTs.values.map((bitcoinCashCashTokenNft) => [bitcoinCashCashTokenNft[EntityMetaKey.SelectorKey], bitcoinCashCashTokenNft])).values()]}
	getKey={(bitcoinCashCashTokenNft) => bitcoinCashCashTokenNft[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Bitcoin Cash CashToken NFTs yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: bitcoinCashCashTokenNft })}
		{@const bitcoinCashCashTokenNftFields = { ...bitcoinCashCashTokenNft[EntityMetaKey.Selector], ...bitcoinCashCashTokenNft }}
		{@const selection = select(EntityType.BitcoinCashCashTokenNft, bitcoinCashCashTokenNft[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<BitcoinCashCashTokenNftView
			selection={selection}
			prefetched={bitcoinCashCashTokenNftFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
