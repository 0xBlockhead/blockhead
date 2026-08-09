<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
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
	}: Omit<EntitySelectionViewProps<EntityType.BlockheadMoneroOutputState>, 'prefetched'> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
		],
	}))
	const blockheadMoneroOutputState = $derived(viewSelection({
		fields: {
			amountAtomicUnits: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadMoneroOutputState_TimestampsView from '$/views/BlockheadMoneroOutputState_TimestampsView.svelte'
	import BlockheadWalletView from '$/views/BlockheadWalletView.svelte'
	import MoneroNetworkView from '$/views/MoneroNetworkView.svelte'
	import MoneroStealthOutputView from '$/views/MoneroStealthOutputView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadMoneroOutputState}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.txHash || 'blockhead monero output state')}
	href={
		href === undefined ?
			resolve(
				'/~/monero/wallet/[walletId=stringSegment]/output-state/[txHash=stringSegment]/[outputIndex=nonNegativeInteger]',
				{
					walletId: selection.entitySelector.walletId,
					txHash: selection.entitySelector.txHash,
					outputIndex: String(selection.entitySelector.outputIndex),
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
		<NumberValue
			value={selection.entitySelector.outputIndex}
		/>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadMoneroOutputState}>
			{#snippet children(entity)}
				{@const amountAtomicUnits = entity.amountAtomicUnits}
				{#if amountAtomicUnits != null}
					<span data-text="muted">
						<NumberValue
							value={amountAtomicUnits}
						/>
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
				resource={selection.$stealthOutput}
			>
				{#snippet children(moneroStealthOutput)}
					{#if moneroStealthOutput != null}
						<div>
							<dt>stealth output</dt>
							<dd>
								<MoneroStealthOutputView
									selection={select(EntityType.MoneroStealthOutput, moneroStealthOutput[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Transaction hash</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.txHash} />
				</dd>
			</div>

			<div>
				<dt>output index</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.outputIndex}
					/>
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

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							addressIndex: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const addressIndex = entity.addressIndex}
					{#if addressIndex != null}
						<div>
							<dt>address index</dt>
							<dd>
								<NumberValue
									value={addressIndex}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={blockheadMoneroOutputState}
			>
				{#snippet children(entity)}
					{@const amountAtomicUnits = entity.amountAtomicUnits}
					{#if amountAtomicUnits != null}
						<div>
							<dt>amount atomic units</dt>
							<dd>
								<NumberValue
									value={amountAtomicUnits}
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
					viewSelection({
						fields: {
							keyImage: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const keyImage = entity.keyImage}
					{#if keyImage != null}
						<div>
							<dt>key image</dt>
							<dd>
								{keyImage}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							keyImageSignature: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const keyImageSignature = entity.keyImageSignature}
					{#if keyImageSignature != null}
						<div>
							<dt>key image signature</dt>
							<dd>
								<TruncatedValue value={keyImageSignature} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							globalOutputIndex: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const globalOutputIndex = entity.globalOutputIndex}
					{#if globalOutputIndex != null}
						<div>
							<dt>global output index</dt>
							<dd>
								<NumberValue
									value={globalOutputIndex}
								/>
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
					<BlockheadMoneroOutputState_TimestampsView
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
