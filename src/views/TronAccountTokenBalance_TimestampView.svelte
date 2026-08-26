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
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.TronAccountTokenBalance_Timestamp> = $props()

	const account = $derived(selection.entitySelector.$account)
	const tronAccountTokenBalanceTimestamp = $derived(selection({
		fields: {
			tokenSymbol: true,
			balance: true,
			tokenName: true,
			tokenId: true,
		},
	}))
	const titleFallback = $derived((prefetched.tokenSymbol ?? '') || [(prefetched.tokenName ?? ''), (prefetched.tokenId ?? '')].filter(Boolean).join(' ') || 'tron account token balance timestamp')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TronTokenView from '$/views/TronTokenView.svelte'
	import TronAccountView from '$/views/TronAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.TronAccountTokenBalance_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/token/[tokenId=stringSegment]/(hederaTokenAssociation)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					network: (
						'caip2' in account.$network ?
							caip2StringFromValue(account.$network.caip2)
						:
							account.$network.slug
					),
					accountId: account.address,
					tokenId: selection.entitySelector.$token.tokenId,
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
		<ResourceBoundary resource={tronAccountTokenBalanceTimestamp}>
			{#snippet children(entity)}
				{(entity.tokenSymbol ?? '') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={tronAccountTokenBalanceTimestamp}>
			{#snippet children(entity)}
				{@const balance = entity.balance}
				{#if balance != null}
					<NumberValue
						value={balance}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<TronAccountView
				selection={select(EntityType.TronAccount, selection.entitySelector.$account)}
				layout={EntityLayout.Title}
			/>
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Token</dt>
				<dd>
					<TronTokenView
						selection={select(EntityType.TronToken, selection.entitySelector.$token)}
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
							blockHeight: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const blockHeight = entity.blockHeight}
					{#if blockHeight != null}
						<div>
							<dt>Block height</dt>
							<dd>
								{blockHeight}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							standard: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const standard = entity.standard}
					{#if standard != null}
						<div>
							<dt>Standard</dt>
							<dd>
								{standard}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Owned serial numbers</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									ownedSerialNumbers: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.ownedSerialNumbers.values.join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							frozenBalance: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const frozenBalance = entity.frozenBalance}
					{#if frozenBalance != null}
						<div>
							<dt>Frozen balance</dt>
							<dd>
								{frozenBalance}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							delegatedBalance: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const delegatedBalance = entity.delegatedBalance}
					{#if delegatedBalance != null}
						<div>
							<dt>Delegated balance</dt>
							<dd>
								{delegatedBalance}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
