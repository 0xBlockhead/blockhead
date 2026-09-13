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
	}: Omit<EntitySelectionViewProps<EntityType.StellarTrustline_Timestamp>, 'prefetched'> = $props()

	const trustline = $derived(selection.entitySelector.$trustline)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import StellarTrustlineView from '$/views/StellarTrustlineView.svelte'
</script>


<EntityView
	entityType={EntityType.StellarTrustline_Timestamp}
	entitySelector={selection.entitySelector}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/account/stellar/[accountId=stringSegment]/(stellarAccount)/asset/[assetKey=stringSegment]/(stellarTrustline)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					network: (
						trustline.$account.$network.$network.caip2 !== undefined ?
							caip2StringFromValue(trustline.$account.$network.$network.caip2)
						:
							trustline.$account.$network.$network.slug
					),
					accountId: trustline.$account.accountId,
					assetKey: trustline.$asset.assetKey,
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
				<dt>trustline</dt>
				<dd>
					<StellarTrustlineView
						selection={select(EntityType.StellarTrustline, selection.entitySelector.$trustline)}
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
							balance: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const balance = entity.balance}
					{#if balance != null}
						<div>
							<dt>balance</dt>
							<dd>
								{balance}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							limit: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const limit = entity.limit}
					{#if limit != null}
						<div>
							<dt>limit</dt>
							<dd>
								{limit}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							buyingLiabilities: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const buyingLiabilities = entity.buyingLiabilities}
					{#if buyingLiabilities != null}
						<div>
							<dt>buying liabilities</dt>
							<dd>
								{buyingLiabilities}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							sellingLiabilities: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const sellingLiabilities = entity.sellingLiabilities}
					{#if sellingLiabilities != null}
						<div>
							<dt>selling liabilities</dt>
							<dd>
								{sellingLiabilities}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							authorized: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const authorized = entity.authorized}
					{#if authorized != null}
						<div>
							<dt>authorized</dt>
							<dd>
								{authorized ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							authorizedToMaintainLiabilities: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const authorizedToMaintainLiabilities = entity.authorizedToMaintainLiabilities}
					{#if authorizedToMaintainLiabilities != null}
						<div>
							<dt>authorized to maintain liabilities</dt>
							<dd>
								{authorizedToMaintainLiabilities ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							clawbackEnabled: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const clawbackEnabled = entity.clawbackEnabled}
					{#if clawbackEnabled != null}
						<div>
							<dt>clawback enabled</dt>
							<dd>
								{clawbackEnabled ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
