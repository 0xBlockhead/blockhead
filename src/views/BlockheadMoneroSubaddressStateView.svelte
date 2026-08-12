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
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.BlockheadMoneroSubaddressState> = $props()

	const blockheadMoneroSubaddressState = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
			Source.MoneroWalletRpc_JsonRpc,
		],
		fields: {
			address: true,
			label: true,
		},
	}))
	const titleFallback = $derived((prefetched.address ?? '') || selection.entitySelector.walletId || 'blockhead monero subaddress state')


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
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/~/monero/wallet/[walletId=stringSegment]/subaddress-state/[accountIndex=nonNegativeInteger]/[addressIndex=nonNegativeInteger]',
				{
					walletId: selection.entitySelector.walletId,
					accountIndex: String(selection.entitySelector.accountIndex),
					addressIndex: String(selection.entitySelector.addressIndex),
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadMoneroSubaddressState}>
			{#snippet children(entity)}
				{(entity.address ?? '') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		{[String(selection.entitySelector.accountIndex), String(selection.entitySelector.addressIndex)].filter(Boolean).join(' ') || (prefetched.address ?? '') || titleFallback}
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadMoneroSubaddressState}>
			{#snippet children(entity)}
				{@const label = entity.label}
				{#if label != null}
					<span data-text="muted">
						{label}
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
						{#snippet children(moneroNetwork)}
							{@const moneroNetworkInitial = untrack(() => moneroNetwork)}
							<MoneroNetworkView
								selection={select(EntityType.MoneroNetwork, (moneroNetwork ?? moneroNetworkInitial)[EntityMetaKey.Selector])}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>account index</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.accountIndex}
					/>
				</dd>
			</div>

			<div>
				<dt>address index</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.addressIndex}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={blockheadMoneroSubaddressState}
			>
				{#snippet children(entity)}
					{@const address = entity.address}
					{#if address != null}
						<div>
							<dt>Address</dt>
							<dd>
								<TruncatedValue value={address} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={blockheadMoneroSubaddressState}
			>
				{#snippet children(entity)}
					{@const label = entity.label}
					{#if label != null}
						<div>
							<dt>Label</dt>
							<dd>
								{label}
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
					<BlockheadMoneroSubaddressState_TimestampsView
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
