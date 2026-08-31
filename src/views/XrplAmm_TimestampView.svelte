<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.XrplAmm_Timestamp>, 'prefetched'> = $props()

	const amm = $derived(selection.entitySelector.$amm)


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
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/amm/[ammAccount=stringSegment]/(xrplAmm)/observations/[ledgerIndex=nonNegativeBigInt]/[source=stringSegment]',
				{
					network: (
						'caip2' in amm.$network ?
							caip2StringFromValue(amm.$network.caip2)
						:
							amm.$network.slug
					),
					ammAccount: amm.ammAccount,
					ledgerIndex: String(selection.entitySelector.ledgerIndex),
					source: selection.entitySelector.source,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content()}
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
