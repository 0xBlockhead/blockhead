<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.BitcoinRune> = $props()

	const network = $derived(selection.entitySelector.$network)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.UniSat_Rest,
		],
	}))
	const bitcoinRune = $derived(viewSelection({
		fields: {
			spacedRune: true,
			rune: true,
			number: true,
		},
	}))
	const titleFallback = $derived([(prefetched.spacedRune ?? ''), (prefetched.rune ?? '')].filter(Boolean).join(' ') || 'Bitcoin Rune')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import UtxoTransactionView from '$/views/UtxoTransactionView.svelte'
</script>


<EntityView
	entityType={EntityType.BitcoinRune}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/rune/[runeId=stringSegment]',
				{
					network: (
						'caip2' in network ?
							caip2StringFromValue(network.caip2)
						:
							network.slug
					),
					runeId: selection.entitySelector.runeId,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={bitcoinRune}>
			{#snippet children(entity)}
				{[(entity.spacedRune ?? ''), (entity.rune ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={bitcoinRune}>
			{#snippet children(entity)}
				{[selection.entitySelector.runeId, String(entity.number ?? '')].filter(Boolean).join(' ') || [(entity.spacedRune ?? ''), (entity.rune ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Rune ID</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.runeId} />
				</dd>
			</div>

			<ResourceBoundary
				resource={bitcoinRune}
			>
				{#snippet children(entity)}
					{@const spacedRune = entity.spacedRune}
					{#if spacedRune != null}
						<div>
							<dt>Spaced rune</dt>
							<dd>
								{spacedRune}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={bitcoinRune}
			>
				{#snippet children(entity)}
					{@const rune = entity.rune}
					{#if rune != null}
						<div>
							<dt>Rune</dt>
							<dd>
								{rune}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={bitcoinRune}
			>
				{#snippet children(entity)}
					{@const number = entity.number}
					{#if number != null}
						<div>
							<dt>Number</dt>
							<dd>
								{number}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							symbol: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const symbol = entity.symbol}
					{#if symbol != null}
						<div>
							<dt>Symbol</dt>
							<dd>
								{symbol}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							divisibility: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const divisibility = entity.divisibility}
					{#if divisibility != null}
						<div>
							<dt>Divisibility</dt>
							<dd>
								{divisibility}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$etchingTransaction}
			>
				{#snippet children(utxoTransaction)}
					{#if utxoTransaction != null}
						{@const utxoTransactionInitial = untrack(() => utxoTransaction)}
						<div>
							<dt>Etching transaction</dt>
							<dd>
								<UtxoTransactionView
									selection={select(EntityType.UtxoTransaction, (utxoTransaction ?? utxoTransactionInitial)[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							etchingHeight: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const etchingHeight = entity.etchingHeight}
					{#if etchingHeight != null}
						<div>
							<dt>Etching height</dt>
							<dd>
								{etchingHeight}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							etchingTxIndex: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const etchingTxIndex = entity.etchingTxIndex}
					{#if etchingTxIndex != null}
						<div>
							<dt>Etching tx index</dt>
							<dd>
								{etchingTxIndex}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							etchingTimestampMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const etchingTimestampMs = entity.etchingTimestampMs}
					{#if etchingTimestampMs != null}
						<div>
							<dt>Etching timestamp</dt>
							<dd>
								<Timestamp timestamp={etchingTimestampMs} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							premine: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const premine = entity.premine}
					{#if premine != null}
						<div>
							<dt>Premine</dt>
							<dd>
								{premine}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							supply: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const supply = entity.supply}
					{#if supply != null}
						<div>
							<dt>Supply</dt>
							<dd>
								{supply}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							mints: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const mints = entity.mints}
					{#if mints != null}
						<div>
							<dt>Mints</dt>
							<dd>
								{mints}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							burned: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const burned = entity.burned}
					{#if burned != null}
						<div>
							<dt>Burned</dt>
							<dd>
								{burned}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							holders: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const holders = entity.holders}
					{#if holders != null}
						<div>
							<dt>Holders</dt>
							<dd>
								{holders}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							transactions: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const transactions = entity.transactions}
					{#if transactions != null}
						<div>
							<dt>Transactions</dt>
							<dd>
								{transactions}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							mintable: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const mintable = entity.mintable}
					{#if mintable != null}
						<div>
							<dt>Mintable</dt>
							<dd>
								{mintable ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							remaining: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const remaining = entity.remaining}
					{#if remaining != null}
						<div>
							<dt>Remaining</dt>
							<dd>
								{remaining}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							termsAmount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const termsAmount = entity.termsAmount}
					{#if termsAmount != null}
						<div>
							<dt>Terms amount</dt>
							<dd>
								{termsAmount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							termsCap: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const termsCap = entity.termsCap}
					{#if termsCap != null}
						<div>
							<dt>Terms cap</dt>
							<dd>
								{termsCap}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							termsHeightStart: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const termsHeightStart = entity.termsHeightStart}
					{#if termsHeightStart != null}
						<div>
							<dt>Terms height start</dt>
							<dd>
								{termsHeightStart}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							termsHeightEnd: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const termsHeightEnd = entity.termsHeightEnd}
					{#if termsHeightEnd != null}
						<div>
							<dt>Terms height end</dt>
							<dd>
								{termsHeightEnd}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							termsOffsetStart: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const termsOffsetStart = entity.termsOffsetStart}
					{#if termsOffsetStart != null}
						<div>
							<dt>Terms offset start</dt>
							<dd>
								{termsOffsetStart}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							termsOffsetEnd: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const termsOffsetEnd = entity.termsOffsetEnd}
					{#if termsOffsetEnd != null}
						<div>
							<dt>Terms offset end</dt>
							<dd>
								{termsOffsetEnd}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
