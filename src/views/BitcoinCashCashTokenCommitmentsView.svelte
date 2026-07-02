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
		title = 'Bitcoin Cash CashToken commitments',
		typeAnnotationParagraphs = [],
		placeholderText = 'Loading Bitcoin Cash CashToken commitments...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BitcoinCashCashTokenCommitments-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.BitcoinCashCashTokenCommitment>
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
			selection.sources == null ? selection({
				fields: {
					commitmentHex: true,
					$output: true,
				},
			}) : selection
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
				totalCount={bitcoinCashCashTokenCommitments.values.length === uniqueBitcoinCashCashTokenCommitments.length && bitcoinCashCashTokenCommitments.totalCount != null && bitcoinCashCashTokenCommitments.totalCount >= uniqueBitcoinCashCashTokenCommitments.length ? bitcoinCashCashTokenCommitments.totalCount : uniqueBitcoinCashCashTokenCommitments.length}
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

				{#snippet Item({ item: bitcoinCashCashTokenCommitment }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.BitcoinCashCashTokenCommitment> })}
					<BitcoinCashCashTokenCommitmentView
						href={
							resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/tx/[txId]/output/[outputIndex=nonNegativeInteger]/cash-token/nft/commitment', {
								networkSlug: String(networkByCaip2[String(({ ...bitcoinCashCashTokenCommitment.entitySelector, ...bitcoinCashCashTokenCommitment }).$output.$transaction.$network.caip2)].slug),
								txId: String(({ ...bitcoinCashCashTokenCommitment.entitySelector, ...bitcoinCashCashTokenCommitment }).$output.$transaction.txId),
								outputIndex: String(({ ...bitcoinCashCashTokenCommitment.entitySelector, ...bitcoinCashCashTokenCommitment }).$output.indexInTransaction),
							})
						}
						selection={select(EntityType.BitcoinCashCashTokenCommitment, bitcoinCashCashTokenCommitment.entitySelector)}
						prefetched={bitcoinCashCashTokenCommitment}
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
