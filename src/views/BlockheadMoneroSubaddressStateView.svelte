<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.BlockheadMoneroSubaddressState>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.BlockheadMoneroSubaddressState>>
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
	const blockheadMoneroSubaddressState = $derived(selection({
		sources: selection.sources,
		fields: {
			address: true,
			label: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.address) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.walletId) ?? '')].filter(Boolean).join(' ') || 'blockhead monero subaddress state')
	const viewDomId = $derived('blockhead-monero-subaddress-state-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadMoneroSubaddressState_TimestampsView from '$/views/BlockheadMoneroSubaddressState_TimestampsView.svelte'
	import BlockheadWalletView from '$/views/BlockheadWalletView.svelte'
	import MoneroNetworkView from '$/views/MoneroNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadMoneroSubaddressState}
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
			{[String((pendingEntity.address) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={blockheadMoneroSubaddressState}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.address) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.accountIndex) ?? ''), String((pendingEntity.addressIndex) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.address) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={blockheadMoneroSubaddressState}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.accountIndex) ?? ''), String((resolvedEntity.addressIndex) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.address) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{@const label0 = pendingEntity.label}
			{#if label0 !== undefined && label0 !== null}
				<span data-text="muted">
					{String((label0) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={blockheadMoneroSubaddressState}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const label0 = resolvedEntity.label}
					{#if label0 !== undefined && label0 !== null}
						<span data-text="muted">
							{String((label0) ?? '')}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>wallet ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									walletId: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const walletId = resolvedEntity.walletId}
							{#if walletId !== undefined && walletId !== null}
								{String((walletId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$wallet}
			>
				{#snippet children(blockheadWallet)}
					{#if blockheadWallet != null && blockheadWallet[EntityMetaKey.Selector] != null}
						<div>
							<dt>wallet</dt>
							<dd>
								<BlockheadWalletView
									selection={select(EntityType.BlockheadWallet, blockheadWallet[EntityMetaKey.Selector])}
									prefetched={blockheadWallet}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>network</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$network}
					>
						{#snippet children(moneroNetwork)}
							{#if moneroNetwork != null && moneroNetwork[EntityMetaKey.Selector] != null}
								<MoneroNetworkView
									selection={select(EntityType.MoneroNetwork, moneroNetwork[EntityMetaKey.Selector])}
									prefetched={moneroNetwork}
									layout={EntityLayout.Value}
									open={false}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>account index</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									accountIndex: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const accountIndex = resolvedEntity.accountIndex}
							{#if accountIndex !== undefined && accountIndex !== null}
								<NumberValue
									value={accountIndex}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>address index</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									addressIndex: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const addressIndex = resolvedEntity.addressIndex}
							{#if addressIndex !== undefined && addressIndex !== null}
								<NumberValue
									value={addressIndex}
								/>
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
							address: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const address = resolvedEntity.address}
					{#if address !== undefined && address !== null}
						<div>
							<dt>Address</dt>
							<dd>
								<TruncatedValue value={String((address) ?? '')} />
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
							label: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const label = resolvedEntity.label}
					{#if label !== undefined && label !== null}
						<div>
							<dt>Label</dt>
							<dd>
								{String((label) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<BlockheadMoneroSubaddressState_TimestampsView
				selection={
						selection.$$timestamps({
							count: true,
						})
					}
				title='timestamps'
				emptyText='No Monero subaddress observations.'
				id='BlockheadMoneroSubaddressState_TimestampsView-timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
