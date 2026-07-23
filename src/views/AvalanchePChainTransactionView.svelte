<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
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
			selection: RegisteredEntityProxyResource<EntityType.AvalanchePChainTransaction>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.AvalanchePChainTransaction>
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
	const avalanchePChainTransaction = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			txType: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			txType: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.txId) ?? '')].filter(Boolean).join(' ') || 'avalanche p chain transaction')
	const viewDomId = $derived('avalanche-pchain-transaction-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AvalanchePChainTransaction_TimestampsView from '$/views/AvalanchePChainTransaction_TimestampsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import AvalanchePChainBlockView from '$/views/AvalanchePChainBlockView.svelte'
</script>


<EntityView
	entityType={EntityType.AvalanchePChainTransaction}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={avalanchePChainTransaction}>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const txId0 = resolvedEntity.txId}
				{#if txId0 !== undefined && txId0 !== null}
					<TruncatedValue value={String((txId0) ?? '')} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={avalanchePChainTransaction}>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.txType) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.txId) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={avalanchePChainTransaction}>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<ResourceBoundary
					resource={selection.$block}
				>
					{#snippet children(avalanchePChainBlock)}
						{#if avalanchePChainBlock != null && avalanchePChainBlock[EntityMetaKey.Selector] != null}
							<span data-text="muted">
								<AvalanchePChainBlockView
									selection={select(EntityType.AvalanchePChainBlock, avalanchePChainBlock[EntityMetaKey.Selector])}
									prefetched={avalanchePChainBlock}
									layout={EntityLayout.Title}
									open={false}
								/>
							</span>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						href={
							(
								selection.entitySelector.$network != null && 'caip2' in selection.entitySelector.$network
								&& selection.entitySelector.$network.caip2 != null ?
									resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
							})
							:
									selection.entitySelector.$network != null && 'slug' in selection.entitySelector.$network
									&& selection.entitySelector.$network.slug != null ?
										resolve('/network/[network=networkCaip2OrNetworkSlug]', {
									network: String(selection.entitySelector.$network.slug ?? ''),
								})
								:
									undefined
							)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>transaction ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									txId: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const txId = resolvedEntity.txId}
							{#if txId !== undefined && txId !== null}
								<TruncatedValue value={String((txId) ?? '')} />
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
							txType: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const txType = resolvedEntity.txType}
					{#if txType !== undefined && txType !== null}
						<div>
							<dt>transaction type</dt>
							<dd>
								{String((txType) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$block}
			>
				{#snippet children(avalanchePChainBlock)}
					{#if avalanchePChainBlock != null && avalanchePChainBlock[EntityMetaKey.Selector] != null}
						<div>
							<dt>block</dt>
							<dd>
								<AvalanchePChainBlockView
									selection={select(EntityType.AvalanchePChainBlock, avalanchePChainBlock[EntityMetaKey.Selector])}
									prefetched={avalanchePChainBlock}
									layout={EntityLayout.Value}
									open={false}
								/>
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
						sources: selection.sources,
						fields: {
							subnetId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const subnetId = resolvedEntity.subnetId}
					{#if subnetId !== undefined && subnetId !== null}
						<div>
							<dt>subnet ID</dt>
							<dd>
								{String((subnetId) ?? '')}
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
							blockchainId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const blockchainId = resolvedEntity.blockchainId}
					{#if blockchainId !== undefined && blockchainId !== null}
						<div>
							<dt>blockchain ID</dt>
							<dd>
								{String((blockchainId) ?? '')}
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
							nodeId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const nodeId = resolvedEntity.nodeId}
					{#if nodeId !== undefined && nodeId !== null}
						<div>
							<dt>node ID</dt>
							<dd>
								{String((nodeId) ?? '')}
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
							startTimeMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const startTimeMs = resolvedEntity.startTimeMs}
					{#if startTimeMs !== undefined && startTimeMs !== null}
						<div>
							<dt>start time ms</dt>
							<dd>
								<Timestamp timestamp={Number(startTimeMs)} />
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
							endTimeMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const endTimeMs = resolvedEntity.endTimeMs}
					{#if endTimeMs !== undefined && endTimeMs !== null}
						<div>
							<dt>end time ms</dt>
							<dd>
								<Timestamp timestamp={Number(endTimeMs)} />
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
						sources: selection.sources,
						fields: {
							stakeAmountNavax: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const stakeAmountNavax = resolvedEntity.stakeAmountNavax}
					{#if stakeAmountNavax !== undefined && stakeAmountNavax !== null}
						<div>
							<dt>stake amount navax</dt>
							<dd>
								<NumberValue
									value={stakeAmountNavax}
								/>
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
							feeNavax: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const feeNavax = resolvedEntity.feeNavax}
					{#if feeNavax !== undefined && feeNavax !== null}
						<div>
							<dt>fee navax</dt>
							<dd>
								<NumberValue
									value={feeNavax}
								/>
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
							memo: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const memo = resolvedEntity.memo}
					{#if memo !== undefined && memo !== null}
						<div>
							<dt>memo</dt>
							<dd>
								{String((memo) ?? '')}
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
							sourceChain: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sourceChain = resolvedEntity.sourceChain}
					{#if sourceChain !== undefined && sourceChain !== null}
						<div>
							<dt>source chain</dt>
							<dd>
								{String((sourceChain) ?? '')}
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
							destinationChain: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const destinationChain = resolvedEntity.destinationChain}
					{#if destinationChain !== undefined && destinationChain !== null}
						<div>
							<dt>destination chain</dt>
							<dd>
								{String((destinationChain) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const avalanchePChainTransactionAvalanchePChainTransactionTimestampsViewTimestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={avalanchePChainTransactionAvalanchePChainTransactionTimestampsViewTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
				<AvalanchePChainTransaction_TimestampsView
					selection={avalanchePChainTransactionAvalanchePChainTransactionTimestampsViewTimestampsResource}
					countResource={avalanchePChainTransactionAvalanchePChainTransactionTimestampsViewTimestampsResource.count}
					title='timestamps'
					id='AvalanchePChainTransaction_TimestampsView-timestamps'
				/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
