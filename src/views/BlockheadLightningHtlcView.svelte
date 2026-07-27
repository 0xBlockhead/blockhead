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
	}: EntitySelectionViewProps<EntityType.BlockheadLightningHtlc> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.LightningLnd_Grpc,
			Source.LightningLnd_Rest,
			Source.Local_Internal,
		],
	}))
	const blockheadLightningHtlc = $derived(viewSelection({
		fields: {
			direction: true,
		},
	}))
	const titleFallback = $derived((String(pendingEntity.htlcIndex ?? '') ? 'HTLC ' + String(pendingEntity.htlcIndex ?? '') : '') || 'blockhead Lightning htlc')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadLightningChannelStateView from '$/views/BlockheadLightningChannelStateView.svelte'
	import LightningChannelView from '$/views/LightningChannelView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadLightningHtlc}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{(String(pendingEntity.htlcIndex ?? '') ? 'HTLC ' + String(pendingEntity.htlcIndex ?? '') : '') || 'blockhead Lightning htlc'}
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary
			resource={selection.$channel}
		>
			{#snippet children(lightningChannel)}
				<LightningChannelView
					selection={select(EntityType.LightningChannel, lightningChannel[EntityMetaKey.Selector])}
					prefetched={lightningChannel}
					href=""
					layout={EntityLayout.Value}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadLightningHtlc}>
			{#snippet children(entity)}
				{@const direction0 = entity.direction}
				{#if direction0 != null}
					<span data-text="muted">
						{direction0}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>channel state</dt>
				<dd>
					<BlockheadLightningChannelStateView
						selection={select(EntityType.BlockheadLightningChannelState, selection.entitySelector.$channelState)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>channel</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$channel}
					>
						{#snippet children(lightningChannel)}
							<LightningChannelView
								selection={select(EntityType.LightningChannel, lightningChannel[EntityMetaKey.Selector])}
								prefetched={lightningChannel}
								layout={EntityLayout.Value}
								open={false}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>htlc index</dt>
				<dd>
					<NumberValue
						value={pendingEntity.htlcIndex}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={blockheadLightningHtlc}
			>
				{#snippet children(entity)}
					{@const direction = entity.direction}
					{#if direction != null}
						<div>
							<dt>direction</dt>
							<dd>
								{direction}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							amountMsat: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const amountMsat = entity.amountMsat}
					{#if amountMsat != null}
						<div>
							<dt>amount msat</dt>
							<dd>
								<NumberValue
									value={amountMsat}
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
							expiryHeight: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const expiryHeight = entity.expiryHeight}
					{#if expiryHeight != null}
						<div>
							<dt>expiry height</dt>
							<dd>
								<NumberValue
									value={expiryHeight}
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
							hashLock: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const hashLock = entity.hashLock}
					{#if hashLock != null}
						<div>
							<dt>hash lock</dt>
							<dd>
								<TruncatedValue value={hashLock} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							state: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const state = entity.state}
					{#if state != null}
						<div>
							<dt>state</dt>
							<dd>
								{state}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
