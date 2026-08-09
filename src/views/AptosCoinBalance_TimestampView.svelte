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
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.AptosCoinBalance_Timestamp> = $props()

	const account = $derived(selection.entitySelector.$account)
	const aptosCoinBalanceTimestamp = $derived(selection({
		fields: {
			assetType: true,
			amount: true,
			unit: true,
		},
	}))
	const titleFallback = $derived((prefetched.assetType ?? '') || 'current Aptos coin balance observation')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AptosAccountView from '$/views/AptosAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.AptosCoinBalance_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/coin-balance/[storageId=stringSegment]/observation/[ledgerVersion=nonNegativeBigInt]/[source=stringSegment]',
				{
					network: (
						'caip2' in account.$network.$network ?
							caip2StringFromValue(account.$network.$network.caip2)
						:
							account.$network.$network.slug
					),
					accountId: account.address,
					storageId: selection.entitySelector.storageId,
					ledgerVersion: String(selection.entitySelector.ledgerVersion),
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
		<ResourceBoundary resource={aptosCoinBalanceTimestamp}>
			{#snippet children(entity)}
				{entity.assetType || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={aptosCoinBalanceTimestamp}>
			{#snippet children(entity)}
				<NumberValue
					value={entity.amount}
				/>

				<span>{entity.unit == null ? '' : ` ${entity.unit}`}</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<NumberValue
				value={selection.entitySelector.ledgerVersion}
			/>
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>account</dt>
				<dd>
					<AptosAccountView
						selection={select(EntityType.AptosAccount, selection.entitySelector.$account)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>asset type</dt>
				<dd>
					<ResourceBoundary
						resource={aptosCoinBalanceTimestamp}
					>
						{#snippet children(entity)}
							{entity.assetType}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>storage ID</dt>
				<dd>
					{selection.entitySelector.storageId}
				</dd>
			</div>

			<div>
				<dt>primary store</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									isPrimary: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.isPrimary ? 'Yes' : 'No'}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							coinType: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const coinType = entity.coinType}
					{#if coinType != null}
						<div>
							<dt>coin type</dt>
							<dd>
								{coinType}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>amount</dt>
				<dd>
					<ResourceBoundary
						resource={aptosCoinBalanceTimestamp}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.amount}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>last transaction version</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.ledgerVersion}
					/>
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

			<div>
				<dt>owner address</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									ownerAddress: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.ownerAddress} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
