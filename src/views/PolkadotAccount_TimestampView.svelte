<!-- Generated from APP.ts. Do not edit by hand. -->

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
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.PolkadotAccount_Timestamp> = $props()

	const account = $derived(selection.entitySelector.$account)
	const polkadotAccountTimestamp = $derived(selection({
		fields: {
			freeBalancePlancks: true,
			nonce: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.source || 'Polkadot account timestamp')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import PolkadotAccountView from '$/views/PolkadotAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.PolkadotAccount_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]/(selection)/observation/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					network: (
						'caip2' in account.$network ?
							caip2StringFromValue(account.$network.caip2)
						:
							account.$network.slug
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
	{#snippet Title()}
		{selection.entitySelector.source || 'Polkadot account timestamp'}
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={polkadotAccountTimestamp}>
			{#snippet children(entity)}
				{String(entity.freeBalancePlancks ?? '') || selection.entitySelector.source || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={polkadotAccountTimestamp}>
			{#snippet children(entity)}
				{@const nonce = entity.nonce}
				{#if nonce != null}
					<span data-text="muted">
						{nonce}
					</span>
				{/if}

				<span data-text="muted">
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
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
				resource={polkadotAccountTimestamp}
			>
				{#snippet children(entity)}
					{@const nonce = entity.nonce}
					{#if nonce != null}
						<div>
							<dt>Nonce</dt>
							<dd>
								{nonce}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={polkadotAccountTimestamp}
			>
				{#snippet children(entity)}
					{@const freeBalancePlancks = entity.freeBalancePlancks}
					{#if freeBalancePlancks != null}
						<div>
							<dt>Free balance plancks</dt>
							<dd>
								{freeBalancePlancks}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Account</dt>
				<dd>
					<PolkadotAccountView
						selection={select(EntityType.PolkadotAccount, selection.entitySelector.$account)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
