<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
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
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.BlockheadZcashWalletState>, 'prefetched'> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
			Source.ZcashClientBackend_Local,
			Source.ZcashLightwalletd_Grpc,
			Source.ZcashdWallet_JsonRpc,
		],
	}))
	const blockheadZcashWalletState = $derived(viewSelection({
		fields: {
			unifiedAddress: true,
		},
	}))
	const viewDomId = $derived('blockhead-zcash-wallet-state-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadWalletView from '$/views/BlockheadWalletView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import BlockheadZcashViewingKeysView from '$/views/BlockheadZcashViewingKeysView.svelte'
	import BlockheadZcashNoteStatesView from '$/views/BlockheadZcashNoteStatesView.svelte'
	import BlockheadZcashWalletState_TimestampsView from '$/views/BlockheadZcashWalletState_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadZcashWalletState}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? (selection.entitySelector.walletId || 'blockhead zcash wallet state')}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary
			resource={selection.$network}
		>
			{#snippet children(network)}
				<NetworkView
					selection={select(EntityType.Network, network[EntityMetaKey.Selector])}
					prefetched={network}
					href={null}
					layout={EntityLayout.Value}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadZcashWalletState}>
			{#snippet children(entity)}
				{@const unifiedAddress = entity.unifiedAddress}
				{#if unifiedAddress != null}
					<span data-text="muted">
						<TruncatedValue value={unifiedAddress} />
					</span>
				{/if}
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
						{#snippet children(network)}
							<NetworkView
								selection={select(EntityType.Network, network[EntityMetaKey.Selector])}
								prefetched={network}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							accountIndex: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const accountIndex = entity.accountIndex}
					{#if accountIndex != null}
						<div>
							<dt>account index</dt>
							<dd>
								<NumberValue
									value={accountIndex}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={blockheadZcashWalletState}
			>
				{#snippet children(entity)}
					{@const unifiedAddress = entity.unifiedAddress}
					{#if unifiedAddress != null}
						<div>
							<dt>unified address</dt>
							<dd>
								<TruncatedValue value={unifiedAddress} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							transparentAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const transparentAddress = entity.transparentAddress}
					{#if transparentAddress != null}
						<div>
							<dt>transparent address</dt>
							<dd>
								<TruncatedValue value={transparentAddress} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							saplingAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const saplingAddress = entity.saplingAddress}
					{#if saplingAddress != null}
						<div>
							<dt>sapling address</dt>
							<dd>
								<TruncatedValue value={saplingAddress} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							orchardAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const orchardAddress = entity.orchardAddress}
					{#if orchardAddress != null}
						<div>
							<dt>orchard address</dt>
							<dd>
								<TruncatedValue value={orchardAddress} />
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
							birthdayHeight: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const birthdayHeight = entity.birthdayHeight}
					{#if birthdayHeight != null}
						<div>
							<dt>birthday height</dt>
							<dd>
								<NumberValue
									value={birthdayHeight}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		<CollapsibleTabs
			id={viewDomId + '-carousel-zcash-wallet-keys-notes'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'zcash-viewing-keys',
						label: 'Viewing keys',
					},
					{
						id: 'zcash-notes',
						label: 'Notes',
					},
				]
			}
			data-card
			class='network-view-collapsible-keys-notes'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Keys and notes</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionZcashViewingKeys({ id, label })}
				<BlockheadZcashViewingKeysView
					selection={selection.$$viewingKeys}
					collapsible={false}
					title={label}
					emptyText='No Zcash viewing keys.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionZcashNotes({ id, label })}
				<BlockheadZcashNoteStatesView
					selection={selection.$$notes}
					collapsible={false}
					title={label}
					emptyText='No Zcash notes.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-zcash-wallet-observations'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'zcash-wallet-timestamps',
						label: 'Observations',
					},
				]
			}
			data-card
			class='network-view-collapsible-observations'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Observations</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionZcashWalletTimestamps({ id, label })}
				<BlockheadZcashWalletState_TimestampsView
					selection={selection.$$timestamps}
					collapsible={false}
					title={label}
					emptyText='No Zcash wallet observations.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
