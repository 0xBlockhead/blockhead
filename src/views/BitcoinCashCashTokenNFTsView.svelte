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
		placeholderText,
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
			selection({
				fields: {
					capability: true,
					$category: true,
					$commitment: true,
					$output: true,
				},
			})
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
				placeholderText={placeholderText}
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
				totalCount={bitcoinCashCashTokenNFTs.totalCount}
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
					{@const bitcoinCashCashTokenNftFields = { ...bitcoinCashCashTokenNft[EntityMetaKey.Selector], ...bitcoinCashCashTokenNft }}
					{@const bitcoinCashCashTokenNftHrefFields = { ...bitcoinCashCashTokenNft, ...bitcoinCashCashTokenNft[EntityMetaKey.Selector] }}
					<BitcoinCashCashTokenNftView
						selection={select(EntityType.BitcoinCashCashTokenNft, bitcoinCashCashTokenNft[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={bitcoinCashCashTokenNftFields}
						href={
							(bitcoinCashCashTokenNftHrefFields.$output !== undefined && bitcoinCashCashTokenNftHrefFields.$output.$transaction !== undefined && bitcoinCashCashTokenNftHrefFields.$output.$transaction.$network !== undefined && bitcoinCashCashTokenNftHrefFields.$output.$transaction.$network.caip2 !== undefined && bitcoinCashCashTokenNftHrefFields.$output.$transaction.$network.caip2.namespace !== undefined && bitcoinCashCashTokenNftHrefFields.$output !== undefined && bitcoinCashCashTokenNftHrefFields.$output.$transaction !== undefined && bitcoinCashCashTokenNftHrefFields.$output.$transaction.$network !== undefined && bitcoinCashCashTokenNftHrefFields.$output.$transaction.$network.caip2 !== undefined && bitcoinCashCashTokenNftHrefFields.$output.$transaction.$network.caip2.reference !== undefined && bitcoinCashCashTokenNftHrefFields.$output !== undefined && bitcoinCashCashTokenNftHrefFields.$output.$transaction !== undefined && bitcoinCashCashTokenNftHrefFields.$output.$transaction.txId !== undefined && bitcoinCashCashTokenNftHrefFields.$output !== undefined && bitcoinCashCashTokenNftHrefFields.$output.indexInTransaction !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/tx/[txId]/output/[outputIndex=nonNegativeInteger]/cash-token/nft', {
								networkSlug: String(networkByCaip2[String(String(bitcoinCashCashTokenNftHrefFields.$output.$transaction.$network.caip2.namespace) + ':' + String(bitcoinCashCashTokenNftHrefFields.$output.$transaction.$network.caip2.reference))].slug ?? ''),
								txId: String(bitcoinCashCashTokenNftHrefFields.$output.$transaction.txId ?? ''),
								outputIndex: String(bitcoinCashCashTokenNftHrefFields.$output.indexInTransaction ?? ''),
							}) : undefined)
						}
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
