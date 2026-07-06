<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityProxyField, type EntityProxyData, type EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadMoneroSubaddressState>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BlockheadMoneroSubaddressState>>
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
		sources: [
			Source.Local_Internal,
		],
		fields: {
			$network: true,
			address: true,
			label: true,
		},
	}))
	const titleFallback = $derived([String((prefetched.address) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.walletId ?? prefetched.walletId) ?? '')].filter(Boolean).join(' ') || 'blockhead monero subaddress state')
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
		<ResourceBoundary resource={blockheadMoneroSubaddressState}>
			{#snippet Pending()}
				{[String((prefetched.address) ?? '')].filter(Boolean).join(' ') || title || [String((selection.entitySelector.walletId ?? prefetched.walletId) ?? '')].filter(Boolean).join(' ') || 'blockhead monero subaddress state'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.address) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadMoneroSubaddressState}>
			{#snippet Pending()}
				{[String((selection.entitySelector.accountIndex ?? prefetched.accountIndex) ?? ''), String((selection.entitySelector.addressIndex ?? prefetched.addressIndex) ?? '')].filter(Boolean).join(' ') || [String((prefetched.address) ?? '')].filter(Boolean).join(' ') || title || [String((selection.entitySelector.walletId ?? prefetched.walletId) ?? '')].filter(Boolean).join(' ') || 'blockhead monero subaddress state'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.accountIndex) ?? ''), String((resolvedEntity.addressIndex) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.address) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadMoneroSubaddressState}>
			{#snippet Pending()}
				{@const label0 = prefetched.label}
				{#if label0 !== undefined && label0 !== null}
					<span data-text="muted">
						{String((label0) ?? '')}
					</span>
				{/if}
			{/snippet}

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
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>wallet ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									walletId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const walletId = selection.entitySelector.walletId ?? prefetched.walletId}
							{#if walletId !== undefined && walletId !== null}
								{String((walletId) ?? '')}
							{/if}
						{/snippet}

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
				resource={selection[EntityProxyField]<EntityType.BlockheadWallet, false>('$wallet')}
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
						resource={selection[EntityProxyField]<EntityType.MoneroNetwork, false>('$network')}
					>
						{#snippet children(moneroNetwork)}
							{#if moneroNetwork[EntityMetaKey.Selector] != null}
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
								fields: {
									accountIndex: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const accountIndex = selection.entitySelector.accountIndex ?? prefetched.accountIndex}
							{#if accountIndex !== undefined && accountIndex !== null}
								<NumberValue value={Number(accountIndex)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const accountIndex = resolvedEntity.accountIndex}
							{#if accountIndex !== undefined && accountIndex !== null}
								<NumberValue value={Number(accountIndex)} />
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
								fields: {
									addressIndex: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const addressIndex = selection.entitySelector.addressIndex ?? prefetched.addressIndex}
							{#if addressIndex !== undefined && addressIndex !== null}
								<NumberValue value={Number(addressIndex)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const addressIndex = resolvedEntity.addressIndex}
							{#if addressIndex !== undefined && addressIndex !== null}
								<NumberValue value={Number(addressIndex)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							address: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const address = prefetched.address}
					{#if address !== undefined && address !== null}
						<div>
							<dt>Address</dt>
							<dd>
								<TruncatedValue value={String((address) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							label: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const label = prefetched.label}
					{#if label !== undefined && label !== null}
						<div>
							<dt>Label</dt>
							<dd>
								{String((label) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
				selection={selection[EntityProxyField]<EntityType.BlockheadMoneroSubaddressState_Timestamp>('$$timestamps')}
				title='timestamps'
				emptyText='No Monero subaddress observations.'
				id='BlockheadMoneroSubaddressState_TimestampsView-$$timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
