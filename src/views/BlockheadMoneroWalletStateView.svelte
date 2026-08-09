<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.BlockheadMoneroWalletState>, 'prefetched'> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
		],
	}))
	const blockheadMoneroWalletState = $derived(viewSelection({
		fields: {
			primaryAddress: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.walletId || 'blockhead monero wallet state')
	const viewDomId = $derived('blockhead-monero-wallet-state-' + encodeURIComponent(stringify(selection.entitySelector)))


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
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/~/monero/wallet/[walletId=stringSegment]/state',
				{
					walletId: selection.entitySelector.walletId,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary resource={blockheadMoneroWalletState}>
			{#snippet children(entity)}
				{(entity.primaryAddress ?? '') || selection.entitySelector.walletId || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={selection.$network}
		>
			{#snippet children(moneroNetwork)}
				<span data-text="muted">
					<MoneroNetworkView
						selection={select(EntityType.MoneroNetwork, moneroNetwork[EntityMetaKey.Selector])}
						layout={EntityLayout.Title}
					/>
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>wallet ID</dt>
				<dd>
					{selection.entitySelector.walletId}
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$wallet}
			>
				{#snippet children(blockheadWallet)}
					{#if blockheadWallet != null}
						<div>
							<dt>wallet</dt>
							<dd>
								<BlockheadWalletView
									selection={select(EntityType.BlockheadWallet, blockheadWallet[EntityMetaKey.Selector])}
									prefetched={blockheadWallet}
									layout={EntityLayout.Value}
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
							<MoneroNetworkView
								selection={select(EntityType.MoneroNetwork, moneroNetwork[EntityMetaKey.Selector])}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={blockheadMoneroWalletState}
			>
				{#snippet children(entity)}
					{@const primaryAddress = entity.primaryAddress}
					{#if primaryAddress != null}
						<div>
							<dt>primary address</dt>
							<dd>
								<TruncatedValue value={primaryAddress} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							viewOnly: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const viewOnly = entity.viewOnly}
					{#if viewOnly != null}
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
					viewSelection({
						fields: {
							trustedDaemon: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const trustedDaemon = entity.trustedDaemon}
					{#if trustedDaemon != null}
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
					viewSelection({
						fields: {
							viewKeyFingerprint: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const viewKeyFingerprint = entity.viewKeyFingerprint}
					{#if viewKeyFingerprint != null}
						<div>
							<dt>view key fingerprint</dt>
							<dd>
								{viewKeyFingerprint}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							spendKeyAvailable: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const spendKeyAvailable = entity.spendKeyAvailable}
					{#if spendKeyAvailable != null}
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

	{#snippet Details()}
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
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Addresses and outputs</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionMoneroSubaddresses({ id, label })}
				<BlockheadMoneroSubaddressStatesView
					selection={selection.$$subaddresses}
					collapsible={false}
					title={label}
					emptyText='No Monero subaddresses.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionMoneroOutputs({ id, label })}
				<BlockheadMoneroOutputStatesView
					selection={selection.$$outputs}
					collapsible={false}
					title={label}
					emptyText='No Monero outputs.'
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
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Transfers and observations</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionMoneroTransfers({ id, label })}
				<BlockheadMoneroTransferStatesView
					selection={selection.$$transfers}
					collapsible={false}
					title={label}
					emptyText='No Monero transfers.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionMoneroWalletTimestamps({ id, label })}
				<BlockheadMoneroWalletState_TimestampsView
					selection={selection.$$timestamps}
					collapsible={false}
					title={label}
					emptyText='No Monero wallet observations.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
