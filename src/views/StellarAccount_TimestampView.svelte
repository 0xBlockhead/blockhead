<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.StellarAccount_Timestamp>, 'prefetched'> = $props()

	const account = $derived(selection.entitySelector.$account)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import StellarAccountView from '$/views/StellarAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.StellarAccount_Timestamp}
	entitySelector={selection.entitySelector}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/account/stellar/[accountId=stringSegment]/(stellarAccount)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					network: (
						'caip2' in account.$network.$network ?
							caip2StringFromValue(account.$network.$network.caip2)
						:
							account.$network.$network.slug
					),
					accountId: account.accountId,
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
					<StellarAccountView
						selection={select(EntityType.StellarAccount, selection.entitySelector.$account)}
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
							sequence: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const sequence = entity.sequence}
					{#if sequence != null}
						<div>
							<dt>sequence</dt>
							<dd>
								{sequence}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							nativeBalance: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const nativeBalance = entity.nativeBalance}
					{#if nativeBalance != null}
						<div>
							<dt>native balance</dt>
							<dd>
								{nativeBalance}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							subentryCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const subentryCount = entity.subentryCount}
					{#if subentryCount != null}
						<div>
							<dt>subentry count</dt>
							<dd>
								{subentryCount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							signerCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const signerCount = entity.signerCount}
					{#if signerCount != null}
						<div>
							<dt>signer count</dt>
							<dd>
								{signerCount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
