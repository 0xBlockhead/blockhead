<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.BitcoinRune> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.UniSat_Rest,
		],
	}))
	const bitcoinRune = $derived(viewSelection({
		fields: {
			spacedRune: true,
			rune: true,
		},
	}))
	const titleFallback = $derived([(prefetched.spacedRune ?? ''), (prefetched.rune ?? '')].filter(Boolean).join(' ') || 'Bitcoin Rune')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import UtxoTransactionView from '$/views/UtxoTransactionView.svelte'
</script>


<EntityView
	entityType={EntityType.BitcoinRune}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
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
		<TruncatedValue value={selection.entitySelector.runeId} />
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
						<div>
							<dt>Etching transaction</dt>
							<dd>
								<UtxoTransactionView
									selection={select(EntityType.UtxoTransaction, utxoTransaction[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
