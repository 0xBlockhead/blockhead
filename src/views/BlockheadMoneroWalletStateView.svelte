<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadMoneroWalletState>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BlockheadMoneroWalletState>>
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
	const blockheadMoneroWalletState = $derived(selection({
		sources: [
			Source.Local_Internal,
		],
		fields: {
			$network: true,
			primaryAddress: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.walletId) ?? '')].filter(Boolean).join(' ') || 'blockhead monero wallet state')
	const viewDomId = $derived('blockhead-monero-wallet-state-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadWalletView from '$/views/BlockheadWalletView.svelte'
	import MoneroNetworkView from '$/views/MoneroNetworkView.svelte'
	import BlockheadMoneroSubaddressStatesView from '$/views/BlockheadMoneroSubaddressStatesView.svelte'
	import BlockheadMoneroOutputStatesView from '$/views/BlockheadMoneroOutputStatesView.svelte'
	import BlockheadMoneroTransferStatesView from '$/views/BlockheadMoneroTransferStatesView.svelte'
	import BlockheadMoneroWalletState_TimestampsView from '$/views/BlockheadMoneroWalletState_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadMoneroWalletState}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadMoneroWalletState}>
			{#snippet Pending()}
				{[String((pendingEntity.walletId) ?? '')].filter(Boolean).join(' ') || title || 'blockhead monero wallet state'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.walletId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadMoneroWalletState}>
			{#snippet Pending()}
				{[String((pendingEntity.primaryAddress) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.walletId) ?? '')].filter(Boolean).join(' ') || title || 'blockhead monero wallet state'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.primaryAddress) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.walletId) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadMoneroWalletState}>
			{#snippet Pending()}
				<ResourceBoundary
					resource={selection.$network}
				>
					{#snippet children(moneroNetwork)}
						<span data-text="muted">
							<MoneroNetworkView
								selection={select(EntityType.MoneroNetwork, moneroNetwork[EntityMetaKey.Selector])}
								prefetched={moneroNetwork}
								layout={EntityLayout.Title}
								open={false}
							/>
						</span>
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<ResourceBoundary
					resource={selection.$network}
				>
					{#snippet children(moneroNetwork)}
						<span data-text="muted">
							<MoneroNetworkView
								selection={select(EntityType.MoneroNetwork, moneroNetwork[EntityMetaKey.Selector])}
								prefetched={moneroNetwork}
								layout={EntityLayout.Title}
								open={false}
							/>
						</span>
					{/snippet}
				</ResourceBoundary>
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
							{@const walletId = pendingEntity.walletId}
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
				resource={selection.$wallet}
			>
				{#snippet Pending()}{/snippet}

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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							primaryAddress: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const primaryAddress = pendingEntity.primaryAddress}
					{#if primaryAddress !== undefined && primaryAddress !== null}
						<div>
							<dt>primary address</dt>
							<dd>
								<TruncatedValue value={String((primaryAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const primaryAddress = resolvedEntity.primaryAddress}
					{#if primaryAddress !== undefined && primaryAddress !== null}
						<div>
							<dt>primary address</dt>
							<dd>
								<TruncatedValue value={String((primaryAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							viewOnly: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const viewOnly = pendingEntity.viewOnly}
					{#if viewOnly !== undefined && viewOnly !== null}
						<div>
							<dt>view only</dt>
							<dd>
								{viewOnly ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const viewOnly = resolvedEntity.viewOnly}
					{#if viewOnly !== undefined && viewOnly !== null}
						<div>
							<dt>view only</dt>
							<dd>
								{viewOnly ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							trustedDaemon: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const trustedDaemon = pendingEntity.trustedDaemon}
					{#if trustedDaemon !== undefined && trustedDaemon !== null}
						<div>
							<dt>trusted daemon</dt>
							<dd>
								{trustedDaemon ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const trustedDaemon = resolvedEntity.trustedDaemon}
					{#if trustedDaemon !== undefined && trustedDaemon !== null}
						<div>
							<dt>trusted daemon</dt>
							<dd>
								{trustedDaemon ? 'Yes' : 'No'}
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
							viewKeyFingerprint: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const viewKeyFingerprint = pendingEntity.viewKeyFingerprint}
					{#if viewKeyFingerprint !== undefined && viewKeyFingerprint !== null}
						<div>
							<dt>view key fingerprint</dt>
							<dd>
								{String((viewKeyFingerprint) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const viewKeyFingerprint = resolvedEntity.viewKeyFingerprint}
					{#if viewKeyFingerprint !== undefined && viewKeyFingerprint !== null}
						<div>
							<dt>view key fingerprint</dt>
							<dd>
								{String((viewKeyFingerprint) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							spendKeyAvailable: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const spendKeyAvailable = pendingEntity.spendKeyAvailable}
					{#if spendKeyAvailable !== undefined && spendKeyAvailable !== null}
						<div>
							<dt>spend key available</dt>
							<dd>
								{spendKeyAvailable ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const spendKeyAvailable = resolvedEntity.spendKeyAvailable}
					{#if spendKeyAvailable !== undefined && spendKeyAvailable !== null}
						<div>
							<dt>spend key available</dt>
							<dd>
								{spendKeyAvailable ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<CollapsibleTabs
				id={viewDomId + '-carousel-monero-wallet-addresses'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'monero-subaddresses',
							label: 'Subaddresses',
						},
						{
							id: 'monero-outputs',
							label: 'Outputs',
						},
					]
				}
				data-card
				class='network-view-collapsible-addresses'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Addresses and outputs</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionMoneroSubaddresses({ id, label, open })}
					<BlockheadMoneroSubaddressStatesView
						selection={selection.$$subaddresses}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Monero subaddresses.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionMoneroOutputs({ id, label, open })}
					<BlockheadMoneroOutputStatesView
						selection={selection.$$outputs}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Monero outputs.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-monero-wallet-activity'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'monero-transfers',
							label: 'Transfers',
						},
						{
							id: 'monero-wallet-timestamps',
							label: 'Observations',
						},
					]
				}
				data-card
				class='network-view-collapsible-activity'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Transfers and observations</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionMoneroTransfers({ id, label, open })}
					<BlockheadMoneroTransferStatesView
						selection={selection.$$transfers}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Monero transfers.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionMoneroWalletTimestamps({ id, label, open })}
					<BlockheadMoneroWalletState_TimestampsView
						selection={selection.$$timestamps}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Monero wallet observations.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>
		{/if}
	{/snippet}
</EntityView>
