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
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.HyperliquidVaultEquity_Timestamp> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import HyperliquidAccountView from '$/views/HyperliquidAccountView.svelte'
	import HyperliquidVaultView from '$/views/HyperliquidVaultView.svelte'
</script>


<EntityView
	entityType={EntityType.HyperliquidVaultEquity_Timestamp}
	entitySelector={selection.entitySelector}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>account</dt>
				<dd>
					<HyperliquidAccountView
						selection={select(EntityType.HyperliquidAccount, selection.entitySelector.$account)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>vault</dt>
				<dd>
					<HyperliquidVaultView
						selection={select(EntityType.HyperliquidVault, selection.entitySelector.$vault)}
						layout={EntityLayout.Value}
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
							equity: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const equity = entity.equity}
					{#if equity != null}
						<div>
							<dt>equity</dt>
							<dd>
								{equity}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							pnl: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const pnl = entity.pnl}
					{#if pnl != null}
						<div>
							<dt>pnl</dt>
							<dd>
								{pnl}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							allTimePnl: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const allTimePnl = entity.allTimePnl}
					{#if allTimePnl != null}
						<div>
							<dt>all time pnl</dt>
							<dd>
								{allTimePnl}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							daysFollowing: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const daysFollowing = entity.daysFollowing}
					{#if daysFollowing != null}
						<div>
							<dt>days following</dt>
							<dd>
								{daysFollowing}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							vaultEntryTimeMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const vaultEntryTimeMs = entity.vaultEntryTimeMs}
					{#if vaultEntryTimeMs != null}
						<div>
							<dt>vault entry time ms</dt>
							<dd>
								{vaultEntryTimeMs}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							lockupUntilMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const lockupUntilMs = entity.lockupUntilMs}
					{#if lockupUntilMs != null}
						<div>
							<dt>lockup until ms</dt>
							<dd>
								{lockupUntilMs}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
