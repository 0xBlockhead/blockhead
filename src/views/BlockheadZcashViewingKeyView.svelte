<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
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
	}: Omit<EntitySelectionViewProps<EntityType.BlockheadZcashViewingKey>, 'prefetched'> = $props()

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
	href={
		href === undefined ?
			resolve(
				'/~/zcash/wallet/[walletId=stringSegment]/viewing-key/[keyFingerprint=stringSegment]',
				{
					walletId: selection.entitySelector.walletId,
					keyFingerprint: selection.entitySelector.keyFingerprint,
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
				{@const networkInitial = untrack(() => network)}
				<span data-text="muted">
					<NetworkView
						selection={select(EntityType.Network, (network ?? networkInitial)[EntityMetaKey.Selector])}
						prefetched={network ?? networkInitial}
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
						{@const blockheadWalletInitial = untrack(() => blockheadWallet)}
						<div>
							<dt>wallet</dt>
							<dd>
								<BlockheadWalletView
									selection={select(EntityType.BlockheadWallet, (blockheadWallet ?? blockheadWalletInitial)[EntityMetaKey.Selector])}
									prefetched={blockheadWallet ?? blockheadWalletInitial}
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
							{@const networkInitial = untrack(() => network)}
							<NetworkView
								selection={select(EntityType.Network, (network ?? networkInitial)[EntityMetaKey.Selector])}
								prefetched={network ?? networkInitial}
								layout={EntityLayout.Value}
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

	{#snippet Details()}
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
