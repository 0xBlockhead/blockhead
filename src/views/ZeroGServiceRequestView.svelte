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
	}: EntitySelectionViewProps<EntityType.ZeroGServiceRequest> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.ZeroGChain_JsonRpc,
			Source.ZeroGStorageNode_JsonRpc,
			Source.ZeroGStorageScan_Rest,
		],
	}))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import ZeroGServiceProviderView from '$/views/ZeroGServiceProviderView.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
	import ZeroGSettlementTraceView from '$/views/ZeroGSettlementTraceView.svelte'
</script>


<EntityView
	entityType={EntityType.ZeroGServiceRequest}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.requestId || 'zero g service request')}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{selection.entitySelector.requestId || 'zero g service request'}
	{/snippet}

	{#snippet Value()}
		<ZeroGServiceProviderView
			selection={select(EntityType.ZeroGServiceProvider, selection.entitySelector.$serviceProvider)}
			layout={EntityLayout.Value}
			open={false}
		/>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={selection.$requester}
		>
			{#snippet children(evmAccount)}
				{#if evmAccount != null}
					<span data-text="muted">
						<EvmAccountView
							selection={select(EntityType.EvmAccount, evmAccount[EntityMetaKey.Selector])}
							prefetched={evmAccount}
							layout={EntityLayout.Title}
							open={false}
						/>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>service provider</dt>
				<dd>
					<ZeroGServiceProviderView
						selection={select(EntityType.ZeroGServiceProvider, selection.entitySelector.$serviceProvider)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>request ID</dt>
				<dd>
					{selection.entitySelector.requestId}
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$requester}
			>
				{#snippet children(evmAccount)}
					{#if evmAccount != null}
						<div>
							<dt>requester</dt>
							<dd>
								<EvmAccountView
									selection={select(EntityType.EvmAccount, evmAccount[EntityMetaKey.Selector])}
									prefetched={evmAccount}
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
							requestHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const requestHash = entity.requestHash}
					{#if requestHash != null}
						<div>
							<dt>request hash</dt>
							<dd>
								<TruncatedValue value={requestHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							responseHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const responseHash = entity.responseHash}
					{#if responseHash != null}
						<div>
							<dt>response hash</dt>
							<dd>
								<TruncatedValue value={responseHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$settlementTrace}
			>
				{#snippet children(zeroGSettlementTrace)}
					{#if zeroGSettlementTrace != null}
						<div>
							<dt>settlement trace</dt>
							<dd>
								<ZeroGSettlementTraceView
									selection={select(EntityType.ZeroGSettlementTrace, zeroGSettlementTrace[EntityMetaKey.Selector])}
									prefetched={zeroGSettlementTrace}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
