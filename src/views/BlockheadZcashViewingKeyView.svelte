<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.BlockheadZcashViewingKey> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
			Source.ZcashClientBackend_Local,
			Source.ZcashdWallet_JsonRpc,
		],
	}))
	const blockheadZcashViewingKey = $derived(viewSelection({
		fields: {
			keyKind: true,
			canViewIncoming: true,
			canViewOutgoing: true,
			canSpend: true,
			importedAt: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.keyFingerprint || 'blockhead zcash viewing key')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import BlockheadZcashViewingKey_TimestampsView from '$/views/BlockheadZcashViewingKey_TimestampsView.svelte'
	import BlockheadWalletView from '$/views/BlockheadWalletView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadZcashViewingKey}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{selection.entitySelector.keyFingerprint || 'blockhead zcash viewing key'}
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadZcashViewingKey}>
			{#snippet children(entity)}
				{entity.keyKind || selection.entitySelector.keyFingerprint || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={selection.$network}
		>
			{#snippet children(network)}
				<span data-text="muted">
					<NetworkView
						selection={select(EntityType.Network, network[EntityMetaKey.Selector])}
						prefetched={network}
						layout={EntityLayout.Title}
						open={false}
					/>
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
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
						{#snippet children(network)}
							<NetworkView
								selection={select(EntityType.Network, network[EntityMetaKey.Selector])}
								prefetched={network}
								layout={EntityLayout.Value}
								open={false}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>key fingerprint</dt>
				<dd>
					{selection.entitySelector.keyFingerprint}
				</dd>
			</div>

			<div>
				<dt>key kind</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadZcashViewingKey}
					>
						{#snippet children(entity)}
							{entity.keyKind}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							pools: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const pools = entity.pools}
					{#if pools != null}
						<div>
							<dt>pools</dt>
							<dd>
								{pools}
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

			<div>
				<dt>can view incoming</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadZcashViewingKey}
					>
						{#snippet children(entity)}
							{entity.canViewIncoming ? 'Yes' : 'No'}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>can view outgoing</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadZcashViewingKey}
					>
						{#snippet children(entity)}
							{entity.canViewOutgoing ? 'Yes' : 'No'}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>can spend</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadZcashViewingKey}
					>
						{#snippet children(entity)}
							{entity.canSpend ? 'Yes' : 'No'}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>imported AT</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadZcashViewingKey}
					>
						{#snippet children(entity)}
							<Timestamp timestamp={entity.importedAt} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							viewingKeyMaterial: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const viewingKeyMaterial = entity.viewingKeyMaterial}
					{#if viewingKeyMaterial != null}
						<div>
							<dt>viewing key material</dt>
							<dd>
								{viewingKeyMaterial}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const timestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BlockheadZcashViewingKey_TimestampsView
						selection={timestampsResource}
						countResource={timestampsResource.count}
						title='timestamps'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
