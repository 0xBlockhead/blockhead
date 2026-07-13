<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'


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
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.PayoutClaim_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.PayoutClaim_Timestamp>>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const payoutClaimTimestamp = $derived(selection({}))
	const titleFallback = $derived('payout claim timestamp')
	const viewDomId = $derived('payout-claim-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import PayoutView from '$/views/PayoutView.svelte'
	import AccountView from '$/views/AccountView.svelte'
	import EvmTransactionView from '$/views/EvmTransactionView.svelte'
</script>


<EntityView
	entityType={EntityType.PayoutClaim_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={payoutClaimTimestamp}>
			{#snippet Pending()}
				{title || 'payout claim timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>payout</dt>
				<dd>
					<PayoutView
						selection={select(EntityType.Payout, selection.entitySelector.$payout, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>account</dt>
				<dd>
					<AccountView
						selection={select(EntityType.Account, selection.entitySelector.$account, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									timestampMs: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const timestampMs = pendingEntity.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const timestampMs = resolvedEntity.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									source: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const source = pendingEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const source = resolvedEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							eligibleAmount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const eligibleAmount = pendingEntity.eligibleAmount}
					{#if eligibleAmount !== undefined && eligibleAmount !== null}
						<div>
							<dt>eligible amount</dt>
							<dd>
								{String((eligibleAmount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const eligibleAmount = resolvedEntity.eligibleAmount}
					{#if eligibleAmount !== undefined && eligibleAmount !== null}
						<div>
							<dt>eligible amount</dt>
							<dd>
								{String((eligibleAmount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							claimedAmount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const claimedAmount = pendingEntity.claimedAmount}
					{#if claimedAmount !== undefined && claimedAmount !== null}
						<div>
							<dt>claimed amount</dt>
							<dd>
								{String((claimedAmount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const claimedAmount = resolvedEntity.claimedAmount}
					{#if claimedAmount !== undefined && claimedAmount !== null}
						<div>
							<dt>claimed amount</dt>
							<dd>
								{String((claimedAmount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							claimStatus: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const claimStatus = pendingEntity.claimStatus}
					{#if claimStatus !== undefined && claimStatus !== null}
						<div>
							<dt>claim status</dt>
							<dd>
								{String((claimStatus) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const claimStatus = resolvedEntity.claimStatus}
					{#if claimStatus !== undefined && claimStatus !== null}
						<div>
							<dt>claim status</dt>
							<dd>
								{String((claimStatus) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							proofHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const proofHash = pendingEntity.proofHash}
					{#if proofHash !== undefined && proofHash !== null}
						<div>
							<dt>proof hash</dt>
							<dd>
								<TruncatedValue value={String((proofHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const proofHash = resolvedEntity.proofHash}
					{#if proofHash !== undefined && proofHash !== null}
						<div>
							<dt>proof hash</dt>
							<dd>
								<TruncatedValue value={String((proofHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$claimTransaction}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(evmTransaction)}
					{#if evmTransaction != null && evmTransaction[EntityMetaKey.Selector] != null}
						<div>
							<dt>claim transaction</dt>
							<dd>
								<EvmTransactionView
									selection={select(EntityType.EvmTransaction, evmTransaction[EntityMetaKey.Selector])}
									prefetched={evmTransaction}
									href={
										(evmTransaction[EntityMetaKey.Selector].$network !== undefined && evmTransaction[EntityMetaKey.Selector].$network.slug !== undefined && evmTransaction[EntityMetaKey.Selector].txHash !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]', {
											network: String(evmTransaction[EntityMetaKey.Selector].$network.slug ?? ''),
											transactionId: String(evmTransaction[EntityMetaKey.Selector].txHash ?? ''),
										}) : undefined)
									}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							expiresAt: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const expiresAt = pendingEntity.expiresAt}
					{#if expiresAt !== undefined && expiresAt !== null}
						<div>
							<dt>expires AT</dt>
							<dd>
								<Timestamp timestamp={Number(expiresAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const expiresAt = resolvedEntity.expiresAt}
					{#if expiresAt !== undefined && expiresAt !== null}
						<div>
							<dt>expires AT</dt>
							<dd>
								<Timestamp timestamp={Number(expiresAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							error: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const error = pendingEntity.error}
					{#if error !== undefined && error !== null}
						<div>
							<dt>error</dt>
							<dd>
								{String((error) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const error = resolvedEntity.error}
					{#if error !== undefined && error !== null}
						<div>
							<dt>error</dt>
							<dd>
								{String((error) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
