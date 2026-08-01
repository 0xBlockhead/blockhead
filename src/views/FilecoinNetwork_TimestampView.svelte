<!-- Generated from APP.ts. -->

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
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.FilecoinNetwork_Timestamp>, 'prefetched'> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Lotus_JsonRpc,
		],
	}))
	const filecoinNetworkTimestamp = $derived(viewSelection({
		fields: {
			headHeight: true,
			headTipsetKey: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import FilecoinMinersView from '$/views/FilecoinMinersView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import FilecoinTipsetView from '$/views/FilecoinTipsetView.svelte'
</script>


<EntityView
	entityType={EntityType.FilecoinNetwork_Timestamp}
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
		<ResourceBoundary resource={filecoinNetworkTimestamp}>
			{#snippet children(entity)}
				{@const headHeight = entity.headHeight}
				{#if headHeight != null}
					<NumberValue
						value={headHeight}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={filecoinNetworkTimestamp}>
			{#snippet children(entity)}
				{@const headTipsetKey = entity.headTipsetKey}
				{#if headTipsetKey != null}
					<span data-text="muted">
						{headTipsetKey}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
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
				resource={filecoinNetworkTimestamp}
			>
				{#snippet children(entity)}
					{@const headHeight = entity.headHeight}
					{#if headHeight != null}
						<div>
							<dt>Head height</dt>
							<dd>
								<NumberValue
									value={headHeight}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={filecoinNetworkTimestamp}
			>
				{#snippet children(entity)}
					{@const headTipsetKey = entity.headTipsetKey}
					{#if headTipsetKey != null}
						<div>
							<dt>Head tipset key</dt>
							<dd>
								{headTipsetKey}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							headBlockCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const headBlockCount = entity.headBlockCount}
					{#if headBlockCount != null}
						<div>
							<dt>Head block count</dt>
							<dd>
								<NumberValue
									value={headBlockCount}
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
							headTimestampMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const headTimestampMs = entity.headTimestampMs}
					{#if headTimestampMs != null}
						<div>
							<dt>Head timestamp</dt>
							<dd>
								<Timestamp timestamp={headTimestampMs} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$headTipset}
			>
				{#snippet children(filecoinTipset)}
					{#if filecoinTipset != null}
						<div>
							<dt>Head tipset</dt>
							<dd>
								<FilecoinTipsetView
									selection={select(EntityType.FilecoinTipset, filecoinTipset[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
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
							networkVersion: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const networkVersion = entity.networkVersion}
					{#if networkVersion != null}
						<div>
							<dt>Network version</dt>
							<dd>
								<NumberValue
									value={networkVersion}
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
							lotusVersion: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const lotusVersion = entity.lotusVersion}
					{#if lotusVersion != null}
						<div>
							<dt>Lotus version</dt>
							<dd>
								{lotusVersion}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							lotusAgent: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const lotusAgent = entity.lotusAgent}
					{#if lotusAgent != null}
						<div>
							<dt>Lotus agent</dt>
							<dd>
								{lotusAgent}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							blockDelaySeconds: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const blockDelaySeconds = entity.blockDelaySeconds}
					{#if blockDelaySeconds != null}
						<div>
							<dt>Block delay seconds</dt>
							<dd>
								<NumberValue
									value={blockDelaySeconds}
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
							totalRawBytePower: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const totalRawBytePower = entity.totalRawBytePower}
					{#if totalRawBytePower != null}
						<div>
							<dt>Total raw byte power</dt>
							<dd>
								<NumberValue
									value={totalRawBytePower}
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
							totalQualityAdjustedPower: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const totalQualityAdjustedPower = entity.totalQualityAdjustedPower}
					{#if totalQualityAdjustedPower != null}
						<div>
							<dt>Total quality adjusted power</dt>
							<dd>
								<NumberValue
									value={totalQualityAdjustedPower}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const headMinersResource = selection.$$headMiners}
		<ResourceBoundary
			resource={headMinersResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<FilecoinMinersView
						selection={headMinersResource}
						countResource={headMinersResource.count}
						title='Head miners'
						id='head-miners'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
