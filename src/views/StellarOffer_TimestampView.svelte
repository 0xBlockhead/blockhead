<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


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
	}: EntitySelectionViewProps<EntityType.StellarOffer_Timestamp> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import StellarOfferView from '$/views/StellarOfferView.svelte'
</script>


<EntityView
	entityType={EntityType.StellarOffer_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? 'stellar offer timestamp'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		stellar offer timestamp
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>offer</dt>
				<dd>
					<StellarOfferView
						selection={select(EntityType.StellarOffer, selection.entitySelector.$offer)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							ledgerSequence: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const ledgerSequence = entity.ledgerSequence}
					{#if ledgerSequence != null}
						<div>
							<dt>ledger sequence</dt>
							<dd>
								{ledgerSequence}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							amount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const amount = entity.amount}
					{#if amount != null}
						<div>
							<dt>amount</dt>
							<dd>
								{amount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							price: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const price = entity.price}
					{#if price != null}
						<div>
							<dt>price</dt>
							<dd>
								{price}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							priceNumerator: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const priceNumerator = entity.priceNumerator}
					{#if priceNumerator != null}
						<div>
							<dt>price numerator</dt>
							<dd>
								{priceNumerator}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							priceDenominator: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const priceDenominator = entity.priceDenominator}
					{#if priceDenominator != null}
						<div>
							<dt>price denominator</dt>
							<dd>
								{priceDenominator}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							sponsor: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const sponsor = entity.sponsor}
					{#if sponsor != null}
						<div>
							<dt>sponsor</dt>
							<dd>
								{sponsor}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							active: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const active = entity.active}
					{#if active != null}
						<div>
							<dt>active</dt>
							<dd>
								{active ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							lastModifiedTimeMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const lastModifiedTimeMs = entity.lastModifiedTimeMs}
					{#if lastModifiedTimeMs != null}
						<div>
							<dt>last modified time ms</dt>
							<dd>
								{lastModifiedTimeMs}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
