<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
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
	}: WithRest<
		{
			selection: RegisteredEntityProxyResource<EntityType.TonTransaction>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.TonTransaction>>
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
	const tonTransaction = $derived(selection({
		sources: selection.sources,
	}))
	const titleFallback = $derived('TON transaction')
	const viewDomId = $derived('ton-transaction-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


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
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{title || titleFallback}
		{:else}
			<ResourceBoundary resource={tonTransaction}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>account</dt>
				<dd>
					<TonAccountView
						selection={select(EntityType.TonAccount, selection.entitySelector.$account, {})}
						href={
							(selection.entitySelector.$account.address !== undefined && selection.entitySelector.$account.$network !== undefined && selection.entitySelector.$account.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
								accountId: String(selection.entitySelector.$account.address ?? ''),
								network: String(caip2StringFromValue(selection.entitySelector.$account.$network.caip2) ?? ''),
							}) : selection.entitySelector.$account.address !== undefined && selection.entitySelector.$account.$network !== undefined && selection.entitySelector.$account.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
								accountId: String(selection.entitySelector.$account.address ?? ''),
								network: String(selection.entitySelector.$account.$network.slug ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>lt</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									lt: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const lt = resolvedEntity.lt}
							{#if lt !== undefined && lt !== null}
								{String((lt) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Hash</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									hash: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const hash = resolvedEntity.hash}
							{#if hash !== undefined && hash !== null}
								<TruncatedValue value={String((hash) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							nowMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const nowMs = resolvedEntity.nowMs}
					{#if nowMs !== undefined && nowMs !== null}
						<div>
							<dt>now ms</dt>
							<dd>
								{String((nowMs) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							origStatus: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const origStatus = resolvedEntity.origStatus}
					{#if origStatus !== undefined && origStatus !== null}
						<div>
							<dt>orig status</dt>
							<dd>
								{String((origStatus) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							endStatus: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const endStatus = resolvedEntity.endStatus}
					{#if endStatus !== undefined && endStatus !== null}
						<div>
							<dt>end status</dt>
							<dd>
								{String((endStatus) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							transactionKind: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const transactionKind = resolvedEntity.transactionKind}
					{#if transactionKind !== undefined && transactionKind !== null}
						<div>
							<dt>transaction kind</dt>
							<dd>
								{String((transactionKind) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							outMessageCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const outMessageCount = resolvedEntity.outMessageCount}
					{#if outMessageCount !== undefined && outMessageCount !== null}
						<div>
							<dt>out message count</dt>
							<dd>
								{String((outMessageCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							totalFeesNano: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const totalFeesNano = resolvedEntity.totalFeesNano}
					{#if totalFeesNano !== undefined && totalFeesNano !== null}
						<div>
							<dt>total fees nano</dt>
							<dd>
								{String((totalFeesNano) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							previousTransactionHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const previousTransactionHash = resolvedEntity.previousTransactionHash}
					{#if previousTransactionHash !== undefined && previousTransactionHash !== null}
						<div>
							<dt>previous transaction hash</dt>
							<dd>
								<TruncatedValue value={String((previousTransactionHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							previousTransactionLt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const previousTransactionLt = resolvedEntity.previousTransactionLt}
					{#if previousTransactionLt !== undefined && previousTransactionLt !== null}
						<div>
							<dt>previous transaction lt</dt>
							<dd>
								{String((previousTransactionLt) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$block}
			>
				{#snippet children(tonBlock)}
					{#if tonBlock != null && tonBlock[EntityMetaKey.Selector] != null}
						<div>
							<dt>block</dt>
							<dd>
								<TonBlockView
									selection={select(EntityType.TonBlock, tonBlock[EntityMetaKey.Selector])}
									prefetched={tonBlock}
									layout={EntityLayout.Value}
									open={false}
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
					{#if tonTrace != null && tonTrace[EntityMetaKey.Selector] != null}
						<div>
							<dt>trace</dt>
							<dd>
								<TonTraceView
									selection={select(EntityType.TonTrace, tonTrace[EntityMetaKey.Selector])}
									prefetched={tonTrace}
									layout={EntityLayout.Value}
									open={false}
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
					{#if tonMessage != null && tonMessage[EntityMetaKey.Selector] != null}
						<div>
							<dt>in message</dt>
							<dd>
								<TonMessageView
									selection={select(EntityType.TonMessage, tonMessage[EntityMetaKey.Selector])}
									prefetched={tonMessage}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
