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
	}: EntitySelectionViewProps<EntityType.MoneroTransaction> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.MoneroDaemonRpc_JsonRpc,
		],
	}))
	const moneroTransaction = $derived(viewSelection({
		fields: {
			feeAtomicUnits: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.txHash ?? '') || 'monero transaction')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import MoneroKeyImagesView from '$/views/MoneroKeyImagesView.svelte'
	import MoneroStealthOutputsView from '$/views/MoneroStealthOutputsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import MoneroBlockView from '$/views/MoneroBlockView.svelte'
</script>


<EntityView
	entityType={EntityType.MoneroTransaction}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<TruncatedValue value={pendingEntity.txHash} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary
			resource={selection.$block}
		>
			{#snippet children(moneroBlock)}
				{#if moneroBlock != null}
					<MoneroBlockView
						selection={select(EntityType.MoneroBlock, moneroBlock[EntityMetaKey.Selector])}
						prefetched={moneroBlock}
						href=""
						layout={EntityLayout.Value}
						open={false}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={moneroTransaction}>
			{#snippet children(entity)}
				{@const feeAtomicUnits0 = entity.feeAtomicUnits}
				{#if feeAtomicUnits0 != null}
					<span data-text="muted">
						<NumberValue
							value={feeAtomicUnits0}
						/>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Transaction hash</dt>
				<dd>
					<TruncatedValue value={pendingEntity.txHash} />
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$block}
			>
				{#snippet children(moneroBlock)}
					{#if moneroBlock != null}
						<div>
							<dt>Block</dt>
							<dd>
								<MoneroBlockView
									selection={select(EntityType.MoneroBlock, moneroBlock[EntityMetaKey.Selector])}
									prefetched={moneroBlock}
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
					viewSelection({
						fields: {
							version: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const version = entity.version}
					{#if version != null}
						<div>
							<dt>Version</dt>
							<dd>
								<NumberValue
									value={version}
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
							unlockTime: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const unlockTime = entity.unlockTime}
					{#if unlockTime != null}
						<div>
							<dt>Unlock time</dt>
							<dd>
								<NumberValue
									value={unlockTime}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={moneroTransaction}
			>
				{#snippet children(entity)}
					{@const feeAtomicUnits = entity.feeAtomicUnits}
					{#if feeAtomicUnits != null}
						<div>
							<dt>Fee atomic units</dt>
							<dd>
								<NumberValue
									value={feeAtomicUnits}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const moneroTransactionMoneroKeyImagesViewKeyImagesResource = selection.$$keyImages}
		<ResourceBoundary
			resource={moneroTransactionMoneroKeyImagesViewKeyImagesResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<MoneroKeyImagesView
						selection={moneroTransactionMoneroKeyImagesViewKeyImagesResource}
						countResource={moneroTransactionMoneroKeyImagesViewKeyImagesResource.count}
						title='Key images'
						id='key-images'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const moneroTransactionMoneroStealthOutputsViewStealthOutputsResource = selection.$$stealthOutputs}
		<ResourceBoundary
			resource={moneroTransactionMoneroStealthOutputsViewStealthOutputsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<MoneroStealthOutputsView
						selection={moneroTransactionMoneroStealthOutputsViewStealthOutputsResource}
						countResource={moneroTransactionMoneroStealthOutputsViewStealthOutputsResource.count}
						title='Stealth outputs'
						id='stealth-outputs'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
