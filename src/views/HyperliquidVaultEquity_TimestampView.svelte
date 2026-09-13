<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.HyperliquidVaultEquity_Timestamp>, 'prefetched'> = $props()

	const vault = $derived(selection.entitySelector.$vault)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import HyperliquidAccountView from '$/views/HyperliquidAccountView.svelte'
	import HyperliquidVaultView from '$/views/HyperliquidVaultView.svelte'
</script>


<EntityView
	entityType={EntityType.HyperliquidVaultEquity_Timestamp}
	entitySelector={selection.entitySelector}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/vault/[vaultAddress=evmAddress]/(hyperliquidVault)/equity/account/[address=evmAddress]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					network: (
						vault.$network.caip2 !== undefined ?
							caip2StringFromValue(vault.$network.caip2)
						:
							vault.$network.slug
					),
					vaultAddress: vault.vaultAddress,
					address: selection.entitySelector.$account.address,
					timestampMs: String(selection.entitySelector.timestampMs),
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
