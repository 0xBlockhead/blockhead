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
			selection: RegisteredEntityProxyResource<EntityType.TonNftTransfer>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.TonNftTransfer>>
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
	const tonNftTransfer = $derived(selection({
		sources: selection.sources,
	}))
	const titleFallback = $derived('TON NFT transfer')
	const viewDomId = $derived('ton-nft-transfer-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import TonNftItemView from '$/views/TonNftItemView.svelte'
	import TonNftCollectionView from '$/views/TonNftCollectionView.svelte'
	import TonAccountView from '$/views/TonAccountView.svelte'
	import TonTraceView from '$/views/TonTraceView.svelte'
	import TonMessageView from '$/views/TonMessageView.svelte'
</script>


<EntityView
	entityType={EntityType.TonNftTransfer}
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
			<ResourceBoundary resource={tonNftTransfer}>
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
				<dt>transfer ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									transferId: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const transferId = resolvedEntity.transferId}
							{#if transferId !== undefined && transferId !== null}
								{String((transferId) ?? '')}
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
								sources: selection.sources,
								fields: {
									source: true,
								},
							})
						}
					>
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

			<ResourceBoundary
				resource={selection.$item}
			>
				{#snippet children(tonNftItem)}
					{#if tonNftItem != null && tonNftItem[EntityMetaKey.Selector] != null}
						<div>
							<dt>item</dt>
							<dd>
								<TonNftItemView
									selection={select(EntityType.TonNftItem, tonNftItem[EntityMetaKey.Selector])}
									prefetched={tonNftItem}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$collection}
			>
				{#snippet children(tonNftCollection)}
					{#if tonNftCollection != null && tonNftCollection[EntityMetaKey.Selector] != null}
						<div>
							<dt>collection</dt>
							<dd>
								<TonNftCollectionView
									selection={select(EntityType.TonNftCollection, tonNftCollection[EntityMetaKey.Selector])}
									prefetched={tonNftCollection}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$from}
			>
				{#snippet children(tonAccount)}
					{#if tonAccount != null && tonAccount[EntityMetaKey.Selector] != null}
						<div>
							<dt>from</dt>
							<dd>
								<TonAccountView
									selection={select(EntityType.TonAccount, tonAccount[EntityMetaKey.Selector])}
									prefetched={tonAccount}
									href={
										(tonAccount[EntityMetaKey.Selector].address !== undefined && tonAccount[EntityMetaKey.Selector].$network !== undefined && tonAccount[EntityMetaKey.Selector].$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
											accountId: String(tonAccount[EntityMetaKey.Selector].address ?? ''),
											network: String(caip2StringFromValue(tonAccount[EntityMetaKey.Selector].$network.caip2) ?? ''),
										}) : tonAccount[EntityMetaKey.Selector].address !== undefined && tonAccount[EntityMetaKey.Selector].$network !== undefined && tonAccount[EntityMetaKey.Selector].$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
											accountId: String(tonAccount[EntityMetaKey.Selector].address ?? ''),
											network: String(tonAccount[EntityMetaKey.Selector].$network.slug ?? ''),
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
				resource={selection.$to}
			>
				{#snippet children(tonAccount)}
					{#if tonAccount != null && tonAccount[EntityMetaKey.Selector] != null}
						<div>
							<dt>to</dt>
							<dd>
								<TonAccountView
									selection={select(EntityType.TonAccount, tonAccount[EntityMetaKey.Selector])}
									prefetched={tonAccount}
									href={
										(tonAccount[EntityMetaKey.Selector].address !== undefined && tonAccount[EntityMetaKey.Selector].$network !== undefined && tonAccount[EntityMetaKey.Selector].$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
											accountId: String(tonAccount[EntityMetaKey.Selector].address ?? ''),
											network: String(caip2StringFromValue(tonAccount[EntityMetaKey.Selector].$network.caip2) ?? ''),
										}) : tonAccount[EntityMetaKey.Selector].address !== undefined && tonAccount[EntityMetaKey.Selector].$network !== undefined && tonAccount[EntityMetaKey.Selector].$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
											accountId: String(tonAccount[EntityMetaKey.Selector].address ?? ''),
											network: String(tonAccount[EntityMetaKey.Selector].$network.slug ?? ''),
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
				resource={selection.$message}
			>
				{#snippet children(tonMessage)}
					{#if tonMessage != null && tonMessage[EntityMetaKey.Selector] != null}
						<div>
							<dt>message</dt>
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

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							transactionLt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const transactionLt = resolvedEntity.transactionLt}
					{#if transactionLt !== undefined && transactionLt !== null}
						<div>
							<dt>transaction lt</dt>
							<dd>
								{String((transactionLt) ?? '')}
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
							transactionHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const transactionHash = resolvedEntity.transactionHash}
					{#if transactionHash !== undefined && transactionHash !== null}
						<div>
							<dt>transaction hash</dt>
							<dd>
								<TruncatedValue value={String((transactionHash) ?? '')} />
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
							timestampMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const timestampMs = resolvedEntity.timestampMs}
					{#if timestampMs !== undefined && timestampMs !== null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={Number(timestampMs)} />
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
							queryId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const queryId = resolvedEntity.queryId}
					{#if queryId !== undefined && queryId !== null}
						<div>
							<dt>query ID</dt>
							<dd>
								{String((queryId) ?? '')}
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
							forwardAmountNano: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const forwardAmountNano = resolvedEntity.forwardAmountNano}
					{#if forwardAmountNano !== undefined && forwardAmountNano !== null}
						<div>
							<dt>forward amount nano</dt>
							<dd>
								{String((forwardAmountNano) ?? '')}
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
							responseDestination: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const responseDestination = resolvedEntity.responseDestination}
					{#if responseDestination !== undefined && responseDestination !== null}
						<div>
							<dt>response destination</dt>
							<dd>
								{String((responseDestination) ?? '')}
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
							customPayloadHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const customPayloadHash = resolvedEntity.customPayloadHash}
					{#if customPayloadHash !== undefined && customPayloadHash !== null}
						<div>
							<dt>custom payload hash</dt>
							<dd>
								<TruncatedValue value={String((customPayloadHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
