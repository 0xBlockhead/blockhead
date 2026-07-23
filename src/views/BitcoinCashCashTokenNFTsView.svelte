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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BitcoinCashCashTokenNft>
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
	{countResource}
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
		<EntityView
			entityType={EntityType.BitcoinCashCashTokenNft}
			entitySelector={bitcoinCashCashTokenNft[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((bitcoinCashCashTokenNftFields.capability) ?? '')].filter(Boolean).join(' ') || 'Bitcoin Cash CashToken NFT'}
			{/snippet}

			{#snippet Value()}
				{[[String((bitcoinCashCashTokenNftFields.$category.categoryId) ?? '')].filter(Boolean).join(' ') || 'Bitcoin Cash CashToken category'].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[[String((bitcoinCashCashTokenNftFields.$commitment.commitmentHex) ?? '')].filter(Boolean).join(' ') || 'Bitcoin Cash CashToken commitment'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
