<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
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
	}: EntitySelectionViewProps<EntityType.BlockheadLightningChannelState_Timestamp> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.LightningLnd_Rest,
			Source.Local_Internal,
		],
	}))
	const blockheadLightningChannelStateTimestamp = $derived(viewSelection({
		fields: {
			active: true,
			localBalanceSats: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import BlockheadLightningChannelStateView from '$/views/BlockheadLightningChannelStateView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadLightningChannelState_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.timestampMs)}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadLightningChannelStateTimestamp}>
			{#snippet children(entity)}
				{String(entity.active ?? '') || String(selection.entitySelector.timestampMs)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadLightningChannelStateTimestamp}>
			{#snippet children(entity)}
				{@const localBalanceSats = entity.localBalanceSats}
				{#if localBalanceSats != null}
					<span data-text="muted">
						<NumberValue
							value={localBalanceSats}
						/>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>channel state</dt>
				<dd>
					<BlockheadLightningChannelStateView
						selection={select(EntityType.BlockheadLightningChannelState, selection.entitySelector.$channelState)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>

			<ResourceBoundary
				resource={blockheadLightningChannelStateTimestamp}
			>
				{#snippet children(entity)}
					{@const active = entity.active}
					{#if active != null}
						<div>
							<dt>active</dt>
							<dd>
								{active ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={blockheadLightningChannelStateTimestamp}
			>
				{#snippet children(entity)}
					{@const localBalanceSats = entity.localBalanceSats}
					{#if localBalanceSats != null}
						<div>
							<dt>local balance sats</dt>
							<dd>
								<NumberValue
									value={localBalanceSats}
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
							remoteBalanceSats: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const remoteBalanceSats = entity.remoteBalanceSats}
					{#if remoteBalanceSats != null}
						<div>
							<dt>remote balance sats</dt>
							<dd>
								<NumberValue
									value={remoteBalanceSats}
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
							unsettledBalanceSats: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const unsettledBalanceSats = entity.unsettledBalanceSats}
					{#if unsettledBalanceSats != null}
						<div>
							<dt>unsettled balance sats</dt>
							<dd>
								<NumberValue
									value={unsettledBalanceSats}
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
							commitFeeSats: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const commitFeeSats = entity.commitFeeSats}
					{#if commitFeeSats != null}
						<div>
							<dt>commit fee sats</dt>
							<dd>
								<NumberValue
									value={commitFeeSats}
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
							commitWeight: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const commitWeight = entity.commitWeight}
					{#if commitWeight != null}
						<div>
							<dt>commit weight</dt>
							<dd>
								<NumberValue
									value={commitWeight}
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
							feePerKw: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const feePerKw = entity.feePerKw}
					{#if feePerKw != null}
						<div>
							<dt>fee per kw</dt>
							<dd>
								<NumberValue
									value={feePerKw}
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
							numUpdates: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const numUpdates = entity.numUpdates}
					{#if numUpdates != null}
						<div>
							<dt>num updates</dt>
							<dd>
								<NumberValue
									value={numUpdates}
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
							lastSyncedAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const lastSyncedAt = entity.lastSyncedAt}
					{#if lastSyncedAt != null}
						<div>
							<dt>last synced AT</dt>
							<dd>
								<Timestamp timestamp={lastSyncedAt} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
