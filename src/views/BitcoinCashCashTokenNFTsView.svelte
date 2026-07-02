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
	import { networkByCaip2 } from '$/constants/Network.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Bitcoin Cash CashToken NFTs',
		typeAnnotationParagraphs = [],
		placeholderText = 'Loading Bitcoin Cash CashToken NFTs...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BitcoinCashCashTokenNFTs-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.BitcoinCashCashTokenNft>
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
	import BitcoinCashCashTokenNftView from '$/views/BitcoinCashCashTokenNftView.svelte'
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
					capability: true,
					$category: true,
					$commitment: true,
				},
			}) : selection
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BitcoinCashCashTokenNft}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
			/>
		{/snippet}

		{#snippet children(bitcoinCashCashTokenNFTs)}
			{@const uniqueBitcoinCashCashTokenNFTs = [...new Map(bitcoinCashCashTokenNFTs.values.map((bitcoinCashCashTokenNft) => [bitcoinCashCashTokenNft[EntityMetaKey.SelectorKey], bitcoinCashCashTokenNft])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BitcoinCashCashTokenNft}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={bitcoinCashCashTokenNFTs.values.length === uniqueBitcoinCashCashTokenNFTs.length && bitcoinCashCashTokenNFTs.totalCount != null && bitcoinCashCashTokenNFTs.totalCount >= uniqueBitcoinCashCashTokenNFTs.length ? bitcoinCashCashTokenNFTs.totalCount : uniqueBitcoinCashCashTokenNFTs.length}
				getKey={(bitcoinCashCashTokenNft) => bitcoinCashCashTokenNft[EntityMetaKey.SelectorKey]}
				items={uniqueBitcoinCashCashTokenNFTs}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Bitcoin Cash CashToken NFTs yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: bitcoinCashCashTokenNft }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.BitcoinCashCashTokenNft> })}
					<BitcoinCashCashTokenNftView
						href={
							resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/tx/[txId]/output/[outputIndex=nonNegativeInteger]/cash-token/nft', {
								networkSlug: String(networkByCaip2[String(({ ...bitcoinCashCashTokenNft.entitySelector, ...bitcoinCashCashTokenNft }).$output.$transaction.$network.caip2)].slug),
								txId: String(({ ...bitcoinCashCashTokenNft.entitySelector, ...bitcoinCashCashTokenNft }).$output.$transaction.txId),
								outputIndex: String(({ ...bitcoinCashCashTokenNft.entitySelector, ...bitcoinCashCashTokenNft }).$output.indexInTransaction),
							})
						}
						selection={select(EntityType.BitcoinCashCashTokenNft, bitcoinCashCashTokenNft.entitySelector)}
						prefetched={bitcoinCashCashTokenNft}
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
		entityType={EntityType.BitcoinCashCashTokenNft}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
