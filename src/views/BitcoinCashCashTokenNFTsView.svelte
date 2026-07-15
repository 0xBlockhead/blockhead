<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


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

				{#snippet Item({ item: bitcoinCashCashTokenNft })}
					{@const bitcoinCashCashTokenNftFields = { ...bitcoinCashCashTokenNft[EntityMetaKey.Selector], ...bitcoinCashCashTokenNft }}
					{@const selection = select(EntityType.BitcoinCashCashTokenNft, bitcoinCashCashTokenNft[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
					{@const bitcoinCashCashTokenNftHrefFields = { ...bitcoinCashCashTokenNft, ...bitcoinCashCashTokenNft[EntityMetaKey.Selector] }}
					<BitcoinCashCashTokenNftView
						selection={selection}
						prefetched={bitcoinCashCashTokenNftFields}
						href={
							(bitcoinCashCashTokenNftHrefFields.$output !== undefined && bitcoinCashCashTokenNftHrefFields.$output.indexInTransaction !== undefined && bitcoinCashCashTokenNftHrefFields.$output.$transaction !== undefined && bitcoinCashCashTokenNftHrefFields.$output.$transaction.txId !== undefined && bitcoinCashCashTokenNftHrefFields.$output.$transaction.$network !== undefined && bitcoinCashCashTokenNftHrefFields.$output.$transaction.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/output/[outputIndex=nonNegativeInteger]/cash-token/nft', {
								outputIndex: String(bitcoinCashCashTokenNftHrefFields.$output.indexInTransaction ?? ''),
								transactionId: String(bitcoinCashCashTokenNftHrefFields.$output.$transaction.txId ?? ''),
								network: String(caip2StringFromValue(bitcoinCashCashTokenNftHrefFields.$output.$transaction.$network.caip2) ?? ''),
							}) : bitcoinCashCashTokenNftHrefFields.$output !== undefined && bitcoinCashCashTokenNftHrefFields.$output.indexInTransaction !== undefined && bitcoinCashCashTokenNftHrefFields.$output.$transaction !== undefined && bitcoinCashCashTokenNftHrefFields.$output.$transaction.txId !== undefined && bitcoinCashCashTokenNftHrefFields.$output.$transaction.$network !== undefined && bitcoinCashCashTokenNftHrefFields.$output.$transaction.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/output/[outputIndex=nonNegativeInteger]/cash-token/nft', {
								outputIndex: String(bitcoinCashCashTokenNftHrefFields.$output.indexInTransaction ?? ''),
								transactionId: String(bitcoinCashCashTokenNftHrefFields.$output.$transaction.txId ?? ''),
								network: String(bitcoinCashCashTokenNftHrefFields.$output.$transaction.$network.slug ?? ''),
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
