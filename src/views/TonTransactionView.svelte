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
	}: Omit<EntitySelectionViewProps<EntityType.TonTransaction>, 'prefetched'> = $props()

	const account = $derived(selection.entitySelector.$account)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import TonAccountView from '$/views/TonAccountView.svelte'
	import TonBlockView from '$/views/TonBlockView.svelte'
	import TonTraceView from '$/views/TonTraceView.svelte'
	import TonMessageView from '$/views/TonMessageView.svelte'
</script>


<EntityView
	entityType={EntityType.TonTransaction}
	entitySelector={selection.entitySelector}
	title={title ?? 'TON transaction'}
	href={
		href === undefined ?
			(
				'hash' in selection.entitySelector ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/transaction/[lt=nonNegativeBigInt]/(tonTransaction)/[hash=stringSegment]',
						{
							network: (
								'caip2' in account.$network ?
									caip2StringFromValue(account.$network.caip2)
								:
									account.$network.slug
							),
							accountId: account.address,
							lt: String(selection.entitySelector.lt),
							hash: selection.entitySelector.hash,
						}
					)
				:
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/transaction/[lt=nonNegativeBigInt]',
						{
							network: (
								'caip2' in account.$network ?
									caip2StringFromValue(account.$network.caip2)
								:
									account.$network.slug
							),
							accountId: account.address,
							lt: String(selection.entitySelector.lt),
						}
					)
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
					<TonAccountView
						selection={select(EntityType.TonAccount, selection.entitySelector.$account)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>lt</dt>
				<dd>
					{selection.entitySelector.lt}
				</dd>
			</div>

			<div>
				<dt>Hash</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									hash: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.hash} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							nowMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const nowMs = entity.nowMs}
					{#if nowMs != null}
						<div>
							<dt>now ms</dt>
							<dd>
								{nowMs}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							origStatus: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const origStatus = entity.origStatus}
					{#if origStatus != null}
						<div>
							<dt>orig status</dt>
							<dd>
								{origStatus}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							endStatus: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const endStatus = entity.endStatus}
					{#if endStatus != null}
						<div>
							<dt>end status</dt>
							<dd>
								{endStatus}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							transactionKind: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const transactionKind = entity.transactionKind}
					{#if transactionKind != null}
						<div>
							<dt>transaction kind</dt>
							<dd>
								{transactionKind}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							outMessageCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const outMessageCount = entity.outMessageCount}
					{#if outMessageCount != null}
						<div>
							<dt>out message count</dt>
							<dd>
								{outMessageCount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							totalFeesNano: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const totalFeesNano = entity.totalFeesNano}
					{#if totalFeesNano != null}
						<div>
							<dt>total fees nano</dt>
							<dd>
								{totalFeesNano}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							previousTransactionHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const previousTransactionHash = entity.previousTransactionHash}
					{#if previousTransactionHash != null}
						<div>
							<dt>previous transaction hash</dt>
							<dd>
								<TruncatedValue value={previousTransactionHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							previousTransactionLt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const previousTransactionLt = entity.previousTransactionLt}
					{#if previousTransactionLt != null}
						<div>
							<dt>previous transaction lt</dt>
							<dd>
								{previousTransactionLt}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$block}
			>
				{#snippet children(tonBlock)}
					{#if tonBlock != null}
						{@const tonBlockInitial = untrack(() => tonBlock)}
						<div>
							<dt>block</dt>
							<dd>
								<TonBlockView
									selection={select(EntityType.TonBlock, (tonBlock ?? tonBlockInitial)[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$trace}
			>
				{#snippet children(tonTrace)}
					{#if tonTrace != null}
						{@const tonTraceInitial = untrack(() => tonTrace)}
						<div>
							<dt>trace</dt>
							<dd>
								<TonTraceView
									selection={select(EntityType.TonTrace, (tonTrace ?? tonTraceInitial)[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$inMessage}
			>
				{#snippet children(tonMessage)}
					{#if tonMessage != null}
						{@const tonMessageInitial = untrack(() => tonMessage)}
						<div>
							<dt>in message</dt>
							<dd>
								<TonMessageView
									selection={select(EntityType.TonMessage, (tonMessage ?? tonMessageInitial)[EntityMetaKey.Selector])}
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
