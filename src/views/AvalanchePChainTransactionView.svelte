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
			selection: EntityProxyResource<typeof schema, EntityType.AvalanchePChainTransaction>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.AvalanchePChainTransaction>>
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
	const avalanchePChainTransaction = $derived(selection({
		fields: {
			txType: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.txId) ?? '')].filter(Boolean).join(' ') || 'avalanche p chain transaction')
	const viewDomId = $derived('avalanche-pchain-transaction-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


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
			{#snippet Pending()}
				{@const txId0 = pendingEntity.txId}
				{#if txId0 !== undefined && txId0 !== null}
					<TruncatedValue value={String((txId0) ?? '')} />
				{/if}
			{/snippet}

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
			{#snippet Pending()}
				{[String((pendingEntity.txType) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.txId) ?? '')].filter(Boolean).join(' ') || title || 'avalanche p chain transaction'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.txType) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.txId) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={avalanchePChainTransaction}>
			{#snippet Pending()}
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
						selection={select(EntityType.Network, selection.entitySelector.$network, {})}
						href={
							(selection.entitySelector.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
							}) : selection.entitySelector.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(selection.entitySelector.$network.slug ?? ''),
							}) : undefined)
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
								fields: {
									txId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const txId = pendingEntity.txId}
							{#if txId !== undefined && txId !== null}
								<TruncatedValue value={String((txId) ?? '')} />
							{/if}
						{/snippet}

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
						fields: {
							txType: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const txType = pendingEntity.txType}
					{#if txType !== undefined && txType !== null}
						<div>
							<dt>transaction type</dt>
							<dd>
								{String((txType) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
				{#snippet Pending()}{/snippet}

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
						fields: {
							subnetId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const subnetId = pendingEntity.subnetId}
					{#if subnetId !== undefined && subnetId !== null}
						<div>
							<dt>subnet ID</dt>
							<dd>
								{String((subnetId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							blockchainId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const blockchainId = pendingEntity.blockchainId}
					{#if blockchainId !== undefined && blockchainId !== null}
						<div>
							<dt>blockchain ID</dt>
							<dd>
								{String((blockchainId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							nodeId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const nodeId = pendingEntity.nodeId}
					{#if nodeId !== undefined && nodeId !== null}
						<div>
							<dt>node ID</dt>
							<dd>
								{String((nodeId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							startTimeMs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const startTimeMs = pendingEntity.startTimeMs}
					{#if startTimeMs !== undefined && startTimeMs !== null}
						<div>
							<dt>start time ms</dt>
							<dd>
								<Timestamp timestamp={Number(startTimeMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							endTimeMs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const endTimeMs = pendingEntity.endTimeMs}
					{#if endTimeMs !== undefined && endTimeMs !== null}
						<div>
							<dt>end time ms</dt>
							<dd>
								<Timestamp timestamp={Number(endTimeMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							stakeAmountNavax: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const stakeAmountNavax = pendingEntity.stakeAmountNavax}
					{#if stakeAmountNavax !== undefined && stakeAmountNavax !== null}
						<div>
							<dt>stake amount navax</dt>
							<dd>
								<NumberValue value={Number(stakeAmountNavax)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const stakeAmountNavax = resolvedEntity.stakeAmountNavax}
					{#if stakeAmountNavax !== undefined && stakeAmountNavax !== null}
						<div>
							<dt>stake amount navax</dt>
							<dd>
								<NumberValue value={Number(stakeAmountNavax)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							feeNavax: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const feeNavax = pendingEntity.feeNavax}
					{#if feeNavax !== undefined && feeNavax !== null}
						<div>
							<dt>fee navax</dt>
							<dd>
								<NumberValue value={Number(feeNavax)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const feeNavax = resolvedEntity.feeNavax}
					{#if feeNavax !== undefined && feeNavax !== null}
						<div>
							<dt>fee navax</dt>
							<dd>
								<NumberValue value={Number(feeNavax)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							memo: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const memo = pendingEntity.memo}
					{#if memo !== undefined && memo !== null}
						<div>
							<dt>memo</dt>
							<dd>
								{String((memo) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							sourceChain: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const sourceChain = pendingEntity.sourceChain}
					{#if sourceChain !== undefined && sourceChain !== null}
						<div>
							<dt>source chain</dt>
							<dd>
								{String((sourceChain) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							destinationChain: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const destinationChain = pendingEntity.destinationChain}
					{#if destinationChain !== undefined && destinationChain !== null}
						<div>
							<dt>destination chain</dt>
							<dd>
								{String((destinationChain) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
		{#if detailsOpen}
			<AvalanchePChainTransaction_TimestampsView
				selection={selection.$$timestamps}
				title='timestamps'
				emptyText='No observations yet.'
				id='AvalanchePChainTransaction_TimestampsView-timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
