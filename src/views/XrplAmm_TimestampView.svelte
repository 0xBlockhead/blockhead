<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
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
	}: EntitySelectionViewProps<EntityType.XrplAmm_Timestamp> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import XrplAmmView from '$/views/XrplAmmView.svelte'
	import XrplLedgerEntryView from '$/views/XrplLedgerEntryView.svelte'
</script>


<EntityView
	entityType={EntityType.XrplAmm_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? 'XRPL AMM timestamp'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>AMM</dt>
				<dd>
					<XrplAmmView
						selection={select(EntityType.XrplAmm, selection.entitySelector.$amm)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>ledger index</dt>
				<dd>
					{selection.entitySelector.ledgerIndex}
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
							timestampMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const timestampMs = entity.timestampMs}
					{#if timestampMs != null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={timestampMs} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							assetAmount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const assetAmount = entity.assetAmount}
					{#if assetAmount != null}
						<div>
							<dt>asset amount</dt>
							<dd>
								{assetAmount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							asset2Amount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const asset2Amount = entity.asset2Amount}
					{#if asset2Amount != null}
						<div>
							<dt>asset2 amount</dt>
							<dd>
								{asset2Amount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							lpTokenBalance: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const lpTokenBalance = entity.lpTokenBalance}
					{#if lpTokenBalance != null}
						<div>
							<dt>LP token balance</dt>
							<dd>
								{lpTokenBalance}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							tradingFee: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const tradingFee = entity.tradingFee}
					{#if tradingFee != null}
						<div>
							<dt>trading fee</dt>
							<dd>
								{tradingFee}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$ledgerEntry}
			>
				{#snippet children(xrplLedgerEntry)}
					{#if xrplLedgerEntry != null}
						<div>
							<dt>ledger entry</dt>
							<dd>
								<XrplLedgerEntryView
									selection={select(EntityType.XrplLedgerEntry, xrplLedgerEntry[EntityMetaKey.Selector])}
									prefetched={xrplLedgerEntry}
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
