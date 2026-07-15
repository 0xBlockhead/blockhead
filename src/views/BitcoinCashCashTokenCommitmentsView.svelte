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
		title = 'Bitcoin Cash CashToken commitments',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BitcoinCashCashTokenCommitments-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BitcoinCashCashTokenCommitment>
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
	import BitcoinCashCashTokenCommitmentView from '$/views/BitcoinCashCashTokenCommitmentView.svelte'
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
					commitmentHex: true,
					$output: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BitcoinCashCashTokenCommitment}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(bitcoinCashCashTokenCommitments)}
			{@const uniqueBitcoinCashCashTokenCommitments = [...new Map(bitcoinCashCashTokenCommitments.values.map((bitcoinCashCashTokenCommitment) => [bitcoinCashCashTokenCommitment[EntityMetaKey.SelectorKey], bitcoinCashCashTokenCommitment])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BitcoinCashCashTokenCommitment}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={bitcoinCashCashTokenCommitments.totalCount}
				getKey={(bitcoinCashCashTokenCommitment) => bitcoinCashCashTokenCommitment[EntityMetaKey.SelectorKey]}
				items={uniqueBitcoinCashCashTokenCommitments}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Bitcoin Cash CashToken commitments yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: bitcoinCashCashTokenCommitment })}
					{@const bitcoinCashCashTokenCommitmentFields = { ...bitcoinCashCashTokenCommitment[EntityMetaKey.Selector], ...bitcoinCashCashTokenCommitment }}
					{@const selection = select(EntityType.BitcoinCashCashTokenCommitment, bitcoinCashCashTokenCommitment[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
					{@const bitcoinCashCashTokenCommitmentHrefFields = { ...bitcoinCashCashTokenCommitment, ...bitcoinCashCashTokenCommitment[EntityMetaKey.Selector] }}
					<BitcoinCashCashTokenCommitmentView
						selection={selection}
						prefetched={bitcoinCashCashTokenCommitmentFields}
						href={
							(bitcoinCashCashTokenCommitmentHrefFields.$output !== undefined && bitcoinCashCashTokenCommitmentHrefFields.$output.indexInTransaction !== undefined && bitcoinCashCashTokenCommitmentHrefFields.$output.$transaction !== undefined && bitcoinCashCashTokenCommitmentHrefFields.$output.$transaction.txId !== undefined && bitcoinCashCashTokenCommitmentHrefFields.$output.$transaction.$network !== undefined && bitcoinCashCashTokenCommitmentHrefFields.$output.$transaction.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/output/[outputIndex=nonNegativeInteger]/cash-token/nft/commitment', {
								outputIndex: String(bitcoinCashCashTokenCommitmentHrefFields.$output.indexInTransaction ?? ''),
								transactionId: String(bitcoinCashCashTokenCommitmentHrefFields.$output.$transaction.txId ?? ''),
								network: String(caip2StringFromValue(bitcoinCashCashTokenCommitmentHrefFields.$output.$transaction.$network.caip2) ?? ''),
							}) : bitcoinCashCashTokenCommitmentHrefFields.$output !== undefined && bitcoinCashCashTokenCommitmentHrefFields.$output.indexInTransaction !== undefined && bitcoinCashCashTokenCommitmentHrefFields.$output.$transaction !== undefined && bitcoinCashCashTokenCommitmentHrefFields.$output.$transaction.txId !== undefined && bitcoinCashCashTokenCommitmentHrefFields.$output.$transaction.$network !== undefined && bitcoinCashCashTokenCommitmentHrefFields.$output.$transaction.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/output/[outputIndex=nonNegativeInteger]/cash-token/nft/commitment', {
								outputIndex: String(bitcoinCashCashTokenCommitmentHrefFields.$output.indexInTransaction ?? ''),
								transactionId: String(bitcoinCashCashTokenCommitmentHrefFields.$output.$transaction.txId ?? ''),
								network: String(bitcoinCashCashTokenCommitmentHrefFields.$output.$transaction.$network.slug ?? ''),
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
		entityType={EntityType.BitcoinCashCashTokenCommitment}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
