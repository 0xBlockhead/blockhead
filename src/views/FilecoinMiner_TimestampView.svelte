<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
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
			selection: RegisteredEntityProxyResource<EntityType.FilecoinMiner_Timestamp>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.FilecoinMiner_Timestamp>
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
	const filecoinMinerTimestamp = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			timestampMs: true,
			qualityAdjustedPower: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			timestampMs: true,
			qualityAdjustedPower: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || 'filecoin miner timestamp')
	const viewDomId = $derived('filecoin-miner-timestamp-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


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
	href={
		href ?? (
			selection.entitySelector != null && 'height' in selection.entitySelector
			&& selection.entitySelector.height != null
			&& selection.entitySelector != null && 'tipsetKey' in selection.entitySelector
			&& selection.entitySelector.tipsetKey != null
			&& selection.entitySelector != null && 'source' in selection.entitySelector
			&& selection.entitySelector.source != null
			&& selection.entitySelector != null && '$miner' in selection.entitySelector
			&& selection.entitySelector.$miner != null && 'minerAddress' in selection.entitySelector.$miner
			&& selection.entitySelector.$miner.minerAddress != null
			&& selection.entitySelector.$miner != null && '$network' in selection.entitySelector.$miner ?
				selection.entitySelector.$miner.$network != null && 'caip2' in selection.entitySelector.$miner.$network
				&& selection.entitySelector.$miner.$network.caip2 != null ?
					resolve('/network/[network=networkCaip2OrNetworkSlug]/miner/[minerAddress=stringSegment]/observations/[height=nonNegativeBigInt]/[tipsetKey=stringSegment]/[source=stringSegment]', {
				height: String(selection.entitySelector.height ?? ''),
				tipsetKey: String(selection.entitySelector.tipsetKey ?? ''),
				source: String(selection.entitySelector.source ?? ''),
				minerAddress: String(selection.entitySelector.$miner.minerAddress ?? ''),
				network: String(caip2StringFromValue(selection.entitySelector.$miner.$network.caip2) ?? ''),
			})
			:
					selection.entitySelector.$miner.$network != null && 'slug' in selection.entitySelector.$miner.$network
					&& selection.entitySelector.$miner.$network.slug != null ?
						resolve('/network/[network=networkCaip2OrNetworkSlug]/miner/[minerAddress=stringSegment]/observations/[height=nonNegativeBigInt]/[tipsetKey=stringSegment]/[source=stringSegment]', {
					height: String(selection.entitySelector.height ?? ''),
					tipsetKey: String(selection.entitySelector.tipsetKey ?? ''),
					source: String(selection.entitySelector.source ?? ''),
					minerAddress: String(selection.entitySelector.$miner.minerAddress ?? ''),
					network: String(selection.entitySelector.$miner.$network.slug ?? ''),
				})
				:
					undefined
		:
				undefined
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'timestampMs') && Object.hasOwn(prefetched, 'qualityAdjustedPower')}
			{@const timestampMs0 = pendingEntity.timestampMs}
			{#if timestampMs0 !== undefined && timestampMs0 !== null}
				<Timestamp timestamp={Number(timestampMs0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={filecoinMinerTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const timestampMs0 = resolvedEntity.timestampMs}
					{#if timestampMs0 !== undefined && timestampMs0 !== null}
						<Timestamp timestamp={Number(timestampMs0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'timestampMs') && Object.hasOwn(prefetched, 'qualityAdjustedPower')}
			{@const qualityAdjustedPower0 = pendingEntity.qualityAdjustedPower}
			{#if qualityAdjustedPower0 !== undefined && qualityAdjustedPower0 !== null}
				<NumberValue
					value={qualityAdjustedPower0}
				/>
			{/if}
		{:else}
			<ResourceBoundary resource={filecoinMinerTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const qualityAdjustedPower0 = resolvedEntity.qualityAdjustedPower}
					{#if qualityAdjustedPower0 !== undefined && qualityAdjustedPower0 !== null}
						<NumberValue
							value={qualityAdjustedPower0}
						/>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'timestampMs') && Object.hasOwn(prefetched, 'qualityAdjustedPower')}
			{@const height0 = pendingEntity.height}
			{#if height0 !== undefined && height0 !== null}
				<span data-text="muted">
					<NumberValue
						value={height0}
					/>
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={filecoinMinerTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const height0 = resolvedEntity.height}
					{#if height0 !== undefined && height0 !== null}
						<span data-text="muted">
							<NumberValue
								value={height0}
							/>
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Miner</dt>
				<dd>
					<FilecoinMinerView
						selection={select(EntityType.FilecoinMiner, selection.entitySelector.$miner)}
						href={
							(
								selection.entitySelector.$miner != null && 'minerAddress' in selection.entitySelector.$miner
								&& selection.entitySelector.$miner.minerAddress != null
								&& selection.entitySelector.$miner != null && '$network' in selection.entitySelector.$miner ?
									selection.entitySelector.$miner.$network != null && 'caip2' in selection.entitySelector.$miner.$network
									&& selection.entitySelector.$miner.$network.caip2 != null ?
										resolve('/network/[network=networkCaip2OrNetworkSlug]/miner/[minerAddress=stringSegment]', {
									minerAddress: String(selection.entitySelector.$miner.minerAddress ?? ''),
									network: String(caip2StringFromValue(selection.entitySelector.$miner.$network.caip2) ?? ''),
								})
								:
										selection.entitySelector.$miner.$network != null && 'slug' in selection.entitySelector.$miner.$network
										&& selection.entitySelector.$miner.$network.slug != null ?
											resolve('/network/[network=networkCaip2OrNetworkSlug]/miner/[minerAddress=stringSegment]', {
										minerAddress: String(selection.entitySelector.$miner.minerAddress ?? ''),
										network: String(selection.entitySelector.$miner.$network.slug ?? ''),
									})
									:
										undefined
							:
									undefined
							)
						}
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
								sources: selection.sources,
								fields: {
									timestampMs: true,
								},
							})
						}
					>
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
								sources: selection.sources,
								fields: {
									source: true,
								},
							})
						}
					>
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

			<div>
				<dt>Height</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									height: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const height = resolvedEntity.height}
							{#if height !== undefined && height !== null}
								<NumberValue
									value={height}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Tipset key</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									tipsetKey: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const tipsetKey = resolvedEntity.tipsetKey}
							{#if tipsetKey !== undefined && tipsetKey !== null}
								{String((tipsetKey) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Tipset</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection
								.$tipset({
									sources: [
										Source.Lotus_JsonRpc,
									],
								})
						}
					>
						{#snippet children(filecoinTipset)}
							{#if filecoinTipset != null && filecoinTipset[EntityMetaKey.Selector] != null}
								<FilecoinTipsetView
									selection={select(EntityType.FilecoinTipset, filecoinTipset[EntityMetaKey.Selector])}
									prefetched={filecoinTipset}
									layout={EntityLayout.Value}
									open={false}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection
						.$owner({
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
									href={
										(
											filecoinActor[EntityMetaKey.Selector] != null && 'address' in filecoinActor[EntityMetaKey.Selector]
											&& filecoinActor[EntityMetaKey.Selector].address != null
											&& filecoinActor[EntityMetaKey.Selector] != null && '$network' in filecoinActor[EntityMetaKey.Selector] ?
												filecoinActor[EntityMetaKey.Selector].$network != null && 'caip2' in filecoinActor[EntityMetaKey.Selector].$network
												&& filecoinActor[EntityMetaKey.Selector].$network.caip2 != null ?
													resolve('/network/[network=networkCaip2OrNetworkSlug]/actor/[address=stringSegment]', {
												address: String(filecoinActor[EntityMetaKey.Selector].address ?? ''),
												network: String(caip2StringFromValue(filecoinActor[EntityMetaKey.Selector].$network.caip2) ?? ''),
											})
											:
													filecoinActor[EntityMetaKey.Selector].$network != null && 'slug' in filecoinActor[EntityMetaKey.Selector].$network
													&& filecoinActor[EntityMetaKey.Selector].$network.slug != null ?
														resolve('/network/[network=networkCaip2OrNetworkSlug]/actor/[address=stringSegment]', {
													address: String(filecoinActor[EntityMetaKey.Selector].address ?? ''),
													network: String(filecoinActor[EntityMetaKey.Selector].$network.slug ?? ''),
												})
												:
													undefined
										:
												undefined
										)
									}
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
					selection
						.$worker({
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
									href={
										(
											filecoinActor[EntityMetaKey.Selector] != null && 'address' in filecoinActor[EntityMetaKey.Selector]
											&& filecoinActor[EntityMetaKey.Selector].address != null
											&& filecoinActor[EntityMetaKey.Selector] != null && '$network' in filecoinActor[EntityMetaKey.Selector] ?
												filecoinActor[EntityMetaKey.Selector].$network != null && 'caip2' in filecoinActor[EntityMetaKey.Selector].$network
												&& filecoinActor[EntityMetaKey.Selector].$network.caip2 != null ?
													resolve('/network/[network=networkCaip2OrNetworkSlug]/actor/[address=stringSegment]', {
												address: String(filecoinActor[EntityMetaKey.Selector].address ?? ''),
												network: String(caip2StringFromValue(filecoinActor[EntityMetaKey.Selector].$network.caip2) ?? ''),
											})
											:
													filecoinActor[EntityMetaKey.Selector].$network != null && 'slug' in filecoinActor[EntityMetaKey.Selector].$network
													&& filecoinActor[EntityMetaKey.Selector].$network.slug != null ?
														resolve('/network/[network=networkCaip2OrNetworkSlug]/actor/[address=stringSegment]', {
													address: String(filecoinActor[EntityMetaKey.Selector].address ?? ''),
													network: String(filecoinActor[EntityMetaKey.Selector].$network.slug ?? ''),
												})
												:
													undefined
										:
												undefined
										)
									}
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
						sources: selection.sources,
						fields: {
							peerId: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							rawBytePower: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const rawBytePower = resolvedEntity.rawBytePower}
					{#if rawBytePower !== undefined && rawBytePower !== null}
						<div>
							<dt>Raw byte power</dt>
							<dd>
								<NumberValue
									value={rawBytePower}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							qualityAdjustedPower: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const qualityAdjustedPower = resolvedEntity.qualityAdjustedPower}
					{#if qualityAdjustedPower !== undefined && qualityAdjustedPower !== null}
						<div>
							<dt>Quality adjusted power</dt>
							<dd>
								<NumberValue
									value={qualityAdjustedPower}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							networkRawBytePower: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const networkRawBytePower = resolvedEntity.networkRawBytePower}
					{#if networkRawBytePower !== undefined && networkRawBytePower !== null}
						<div>
							<dt>Network raw byte power</dt>
							<dd>
								<NumberValue
									value={networkRawBytePower}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							networkQualityAdjustedPower: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const networkQualityAdjustedPower = resolvedEntity.networkQualityAdjustedPower}
					{#if networkQualityAdjustedPower !== undefined && networkQualityAdjustedPower !== null}
						<div>
							<dt>Network quality adjusted power</dt>
							<dd>
								<NumberValue
									value={networkQualityAdjustedPower}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							activeSectorCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const activeSectorCount = resolvedEntity.activeSectorCount}
					{#if activeSectorCount !== undefined && activeSectorCount !== null}
						<div>
							<dt>Active sectors</dt>
							<dd>
								<NumberValue
									value={activeSectorCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							liveSectorCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const liveSectorCount = resolvedEntity.liveSectorCount}
					{#if liveSectorCount !== undefined && liveSectorCount !== null}
						<div>
							<dt>Live sectors</dt>
							<dd>
								<NumberValue
									value={liveSectorCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							faultySectorCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const faultySectorCount = resolvedEntity.faultySectorCount}
					{#if faultySectorCount !== undefined && faultySectorCount !== null}
						<div>
							<dt>Faulty sectors</dt>
							<dd>
								<NumberValue
									value={faultySectorCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
