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
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import BitcoinCashCashTokenFungibleAmountView from '$/views/BitcoinCashCashTokenFungibleAmountView.svelte'
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
					amount: true,
					$category: true,
					$output: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BitcoinCashCashTokenFungibleAmount}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(bitcoinCashCashTokenFungibleAmounts)}
			{@const uniqueBitcoinCashCashTokenFungibleAmounts = [...new Map(bitcoinCashCashTokenFungibleAmounts.values.map((bitcoinCashCashTokenFungibleAmount) => [bitcoinCashCashTokenFungibleAmount[EntityMetaKey.SelectorKey], bitcoinCashCashTokenFungibleAmount])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BitcoinCashCashTokenFungibleAmount}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={bitcoinCashCashTokenFungibleAmounts.totalCount}
				getKey={(bitcoinCashCashTokenFungibleAmount) => bitcoinCashCashTokenFungibleAmount[EntityMetaKey.SelectorKey]}
				items={uniqueBitcoinCashCashTokenFungibleAmounts}
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
					{@const bitcoinCashCashTokenFungibleAmountHrefFields = { ...bitcoinCashCashTokenFungibleAmount, ...bitcoinCashCashTokenFungibleAmount[EntityMetaKey.Selector] }}
					<BitcoinCashCashTokenFungibleAmountView
						selection={selection}
						prefetched={bitcoinCashCashTokenFungibleAmountFields}
						href={
							(bitcoinCashCashTokenFungibleAmountHrefFields.$output !== undefined && bitcoinCashCashTokenFungibleAmountHrefFields.$output.indexInTransaction !== undefined && bitcoinCashCashTokenFungibleAmountHrefFields.$output.$transaction !== undefined && bitcoinCashCashTokenFungibleAmountHrefFields.$output.$transaction.txId !== undefined && bitcoinCashCashTokenFungibleAmountHrefFields.$output.$transaction.$network !== undefined && bitcoinCashCashTokenFungibleAmountHrefFields.$output.$transaction.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/output/[outputIndex=nonNegativeInteger]/cash-token/fungible-amount', {
								outputIndex: String(bitcoinCashCashTokenFungibleAmountHrefFields.$output.indexInTransaction ?? ''),
								transactionId: String(bitcoinCashCashTokenFungibleAmountHrefFields.$output.$transaction.txId ?? ''),
								network: String(caip2StringFromValue(bitcoinCashCashTokenFungibleAmountHrefFields.$output.$transaction.$network.caip2) ?? ''),
							}) : bitcoinCashCashTokenFungibleAmountHrefFields.$output !== undefined && bitcoinCashCashTokenFungibleAmountHrefFields.$output.indexInTransaction !== undefined && bitcoinCashCashTokenFungibleAmountHrefFields.$output.$transaction !== undefined && bitcoinCashCashTokenFungibleAmountHrefFields.$output.$transaction.txId !== undefined && bitcoinCashCashTokenFungibleAmountHrefFields.$output.$transaction.$network !== undefined && bitcoinCashCashTokenFungibleAmountHrefFields.$output.$transaction.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/output/[outputIndex=nonNegativeInteger]/cash-token/fungible-amount', {
								outputIndex: String(bitcoinCashCashTokenFungibleAmountHrefFields.$output.indexInTransaction ?? ''),
								transactionId: String(bitcoinCashCashTokenFungibleAmountHrefFields.$output.$transaction.txId ?? ''),
								network: String(bitcoinCashCashTokenFungibleAmountHrefFields.$output.$transaction.$network.slug ?? ''),
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
		entityType={EntityType.BitcoinCashCashTokenFungibleAmount}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
