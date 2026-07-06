<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityProxyField, type EntityProxyData, type EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
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
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.FilecoinMiner_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.FilecoinMiner_Timestamp>>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const filecoinMinerTimestamp = $derived(selection({
		sources: [
			Source.Lotus_JsonRpc,
		],
		fields: {
			qualityAdjustedPower: true,
			height: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.timestampMs ?? prefetched.timestampMs) ?? '')].filter(Boolean).join(' ') || 'filecoin miner timestamp')
	const viewDomId = $derived('filecoin-miner-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import FilecoinMinerView from '$/views/FilecoinMinerView.svelte'
	import FilecoinTipsetView from '$/views/FilecoinTipsetView.svelte'
	import FilecoinActorView from '$/views/FilecoinActorView.svelte'
</script>


<EntityView
	entityType={EntityType.FilecoinMiner_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={filecoinMinerTimestamp}>
			{#snippet Pending()}
				{@const timestampMs0 = selection.entitySelector.timestampMs ?? prefetched.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<Timestamp timestamp={Number(timestampMs0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const timestampMs0 = resolvedEntity.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<Timestamp timestamp={Number(timestampMs0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={filecoinMinerTimestamp}>
			{#snippet Pending()}
				{@const qualityAdjustedPower0 = prefetched.qualityAdjustedPower}
				{#if qualityAdjustedPower0 !== undefined && qualityAdjustedPower0 !== null}
					<NumberValue value={Number(qualityAdjustedPower0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const qualityAdjustedPower0 = resolvedEntity.qualityAdjustedPower}
				{#if qualityAdjustedPower0 !== undefined && qualityAdjustedPower0 !== null}
					<NumberValue value={Number(qualityAdjustedPower0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={filecoinMinerTimestamp}>
			{#snippet Pending()}
				{@const height0 = prefetched.height}
				{#if height0 !== undefined && height0 !== null}
					<span data-text="muted">
						<NumberValue value={Number(height0)} />
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const height0 = resolvedEntity.height}
				{#if height0 !== undefined && height0 !== null}
					<span data-text="muted">
						<NumberValue value={Number(height0)} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Miner</dt>
				<dd>
					<FilecoinMinerView
						selection={select(EntityType.FilecoinMiner, selection.entitySelector.$miner)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									timestampMs: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const timestampMs = selection.entitySelector.timestampMs ?? prefetched.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const timestampMs = resolvedEntity.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									source: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const source = selection.entitySelector.source ?? prefetched.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const source = resolvedEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							height: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const height = prefetched.height}
					{#if height !== undefined && height !== null}
						<div>
							<dt>Height</dt>
							<dd>
								<NumberValue value={Number(height)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const height = resolvedEntity.height}
					{#if height !== undefined && height !== null}
						<div>
							<dt>Height</dt>
							<dd>
								<NumberValue value={Number(height)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							tipsetKey: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const tipsetKey = prefetched.tipsetKey}
					{#if tipsetKey !== undefined && tipsetKey !== null}
						<div>
							<dt>Tipset key</dt>
							<dd>
								{String((tipsetKey) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const tipsetKey = resolvedEntity.tipsetKey}
					{#if tipsetKey !== undefined && tipsetKey !== null}
						<div>
							<dt>Tipset key</dt>
							<dd>
								{String((tipsetKey) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.FilecoinTipset, false>('$tipset')}
			>
				{#snippet children(filecoinTipset)}
					{#if filecoinTipset != null && filecoinTipset[EntityMetaKey.Selector] != null}
						<div>
							<dt>Tipset</dt>
							<dd>
								<FilecoinTipsetView
									selection={select(EntityType.FilecoinTipset, filecoinTipset[EntityMetaKey.Selector])}
									prefetched={filecoinTipset}
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
					selection[EntityProxyField]<EntityType.FilecoinActor, false>('$owner', {
						sources: [
							Source.Lotus_JsonRpc,
						],
					})
				}
			>
				{#snippet children(filecoinActor)}
					{#if filecoinActor != null && filecoinActor[EntityMetaKey.Selector] != null}
						<div>
							<dt>Owner</dt>
							<dd>
								<FilecoinActorView
									selection={select(EntityType.FilecoinActor, filecoinActor[EntityMetaKey.Selector])}
									prefetched={filecoinActor}
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
					selection[EntityProxyField]<EntityType.FilecoinActor, false>('$worker', {
						sources: [
							Source.Lotus_JsonRpc,
						],
					})
				}
			>
				{#snippet children(filecoinActor)}
					{#if filecoinActor != null && filecoinActor[EntityMetaKey.Selector] != null}
						<div>
							<dt>Worker</dt>
							<dd>
								<FilecoinActorView
									selection={select(EntityType.FilecoinActor, filecoinActor[EntityMetaKey.Selector])}
									prefetched={filecoinActor}
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
					selection({
						sources: [
							Source.Lotus_JsonRpc,
						],
						fields: {
							peerId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const peerId = prefetched.peerId}
					{#if peerId !== undefined && peerId !== null}
						<div>
							<dt>Peer ID</dt>
							<dd>
								{String((peerId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const peerId = resolvedEntity.peerId}
					{#if peerId !== undefined && peerId !== null}
						<div>
							<dt>Peer ID</dt>
							<dd>
								{String((peerId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.Lotus_JsonRpc,
						],
						fields: {
							rawBytePower: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const rawBytePower = prefetched.rawBytePower}
					{#if rawBytePower !== undefined && rawBytePower !== null}
						<div>
							<dt>Raw byte power</dt>
							<dd>
								<NumberValue value={Number(rawBytePower)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const rawBytePower = resolvedEntity.rawBytePower}
					{#if rawBytePower !== undefined && rawBytePower !== null}
						<div>
							<dt>Raw byte power</dt>
							<dd>
								<NumberValue value={Number(rawBytePower)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.Lotus_JsonRpc,
						],
						fields: {
							qualityAdjustedPower: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const qualityAdjustedPower = prefetched.qualityAdjustedPower}
					{#if qualityAdjustedPower !== undefined && qualityAdjustedPower !== null}
						<div>
							<dt>Quality adjusted power</dt>
							<dd>
								<NumberValue value={Number(qualityAdjustedPower)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const qualityAdjustedPower = resolvedEntity.qualityAdjustedPower}
					{#if qualityAdjustedPower !== undefined && qualityAdjustedPower !== null}
						<div>
							<dt>Quality adjusted power</dt>
							<dd>
								<NumberValue value={Number(qualityAdjustedPower)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.Lotus_JsonRpc,
						],
						fields: {
							networkRawBytePower: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const networkRawBytePower = prefetched.networkRawBytePower}
					{#if networkRawBytePower !== undefined && networkRawBytePower !== null}
						<div>
							<dt>Network raw byte power</dt>
							<dd>
								<NumberValue value={Number(networkRawBytePower)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const networkRawBytePower = resolvedEntity.networkRawBytePower}
					{#if networkRawBytePower !== undefined && networkRawBytePower !== null}
						<div>
							<dt>Network raw byte power</dt>
							<dd>
								<NumberValue value={Number(networkRawBytePower)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.Lotus_JsonRpc,
						],
						fields: {
							networkQualityAdjustedPower: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const networkQualityAdjustedPower = prefetched.networkQualityAdjustedPower}
					{#if networkQualityAdjustedPower !== undefined && networkQualityAdjustedPower !== null}
						<div>
							<dt>Network quality adjusted power</dt>
							<dd>
								<NumberValue value={Number(networkQualityAdjustedPower)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const networkQualityAdjustedPower = resolvedEntity.networkQualityAdjustedPower}
					{#if networkQualityAdjustedPower !== undefined && networkQualityAdjustedPower !== null}
						<div>
							<dt>Network quality adjusted power</dt>
							<dd>
								<NumberValue value={Number(networkQualityAdjustedPower)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.Lotus_JsonRpc,
						],
						fields: {
							liveSectorCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const liveSectorCount = prefetched.liveSectorCount}
					{#if liveSectorCount !== undefined && liveSectorCount !== null}
						<div>
							<dt>Live sectors</dt>
							<dd>
								<NumberValue value={Number(liveSectorCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const liveSectorCount = resolvedEntity.liveSectorCount}
					{#if liveSectorCount !== undefined && liveSectorCount !== null}
						<div>
							<dt>Live sectors</dt>
							<dd>
								<NumberValue value={Number(liveSectorCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							faultySectorCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const faultySectorCount = prefetched.faultySectorCount}
					{#if faultySectorCount !== undefined && faultySectorCount !== null}
						<div>
							<dt>Faulty sectors</dt>
							<dd>
								<NumberValue value={Number(faultySectorCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const faultySectorCount = resolvedEntity.faultySectorCount}
					{#if faultySectorCount !== undefined && faultySectorCount !== null}
						<div>
							<dt>Faulty sectors</dt>
							<dd>
								<NumberValue value={Number(faultySectorCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
