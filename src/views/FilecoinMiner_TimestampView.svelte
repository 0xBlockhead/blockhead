<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
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
	}: EntitySelectionViewProps<EntityType.FilecoinMiner_Timestamp> = $props()

	const miner = $derived(selection.entitySelector.$miner)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Lotus_JsonRpc,
		],
	}))
	const filecoinMinerTimestamp = $derived(viewSelection({
		fields: {
			timestampMs: true,
			qualityAdjustedPower: true,
		},
	}))


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
	entitySelector={selection.entitySelector}
	title={title ?? (String(prefetched.timestampMs ?? '') || 'filecoin miner timestamp')}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/miner/[minerAddress=stringSegment]/(filecoinMiner)/observations/[height=nonNegativeBigInt]/[tipsetKey=stringSegment]/[source=stringSegment]',
				{
					network: (
						'caip2' in miner.$network ?
							caip2StringFromValue(miner.$network.caip2)
						:
							miner.$network.slug
					),
					minerAddress: miner.minerAddress,
					height: String(selection.entitySelector.height),
					tipsetKey: selection.entitySelector.tipsetKey,
					source: selection.entitySelector.source,
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
		<ResourceBoundary resource={filecoinMinerTimestamp}>
			{#snippet children(entity)}
				<Timestamp timestamp={entity.timestampMs} />
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={filecoinMinerTimestamp}>
			{#snippet children(entity)}
				{@const qualityAdjustedPower = entity.qualityAdjustedPower}
				{#if qualityAdjustedPower != null}
					<NumberValue
						value={qualityAdjustedPower}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<NumberValue
				value={selection.entitySelector.height}
			/>
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Miner</dt>
				<dd>
					<FilecoinMinerView
						selection={select(EntityType.FilecoinMiner, selection.entitySelector.$miner)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<ResourceBoundary
						resource={filecoinMinerTimestamp}
					>
						{#snippet children(entity)}
							<Timestamp timestamp={entity.timestampMs} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>

			<div>
				<dt>Height</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.height}
					/>
				</dd>
			</div>

			<div>
				<dt>Tipset key</dt>
				<dd>
					{selection.entitySelector.tipsetKey}
				</dd>
			</div>

			<div>
				<dt>Tipset</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$tipset}
					>
						{#snippet children(filecoinTipset)}
							<FilecoinTipsetView
								selection={select(EntityType.FilecoinTipset, filecoinTipset[EntityMetaKey.Selector])}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$owner}
			>
				{#snippet children(filecoinActor)}
					{#if filecoinActor != null}
						<div>
							<dt>Owner</dt>
							<dd>
								<FilecoinActorView
									selection={select(EntityType.FilecoinActor, filecoinActor[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$worker}
			>
				{#snippet children(filecoinActor)}
					{#if filecoinActor != null}
						<div>
							<dt>Worker</dt>
							<dd>
								<FilecoinActorView
									selection={select(EntityType.FilecoinActor, filecoinActor[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
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
							peerId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const peerId = entity.peerId}
					{#if peerId != null}
						<div>
							<dt>Peer ID</dt>
							<dd>
								{peerId}
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
							rawBytePower: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const rawBytePower = entity.rawBytePower}
					{#if rawBytePower != null}
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
				resource={filecoinMinerTimestamp}
			>
				{#snippet children(entity)}
					{@const qualityAdjustedPower = entity.qualityAdjustedPower}
					{#if qualityAdjustedPower != null}
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
					viewSelection({
						fields: {
							networkRawBytePower: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const networkRawBytePower = entity.networkRawBytePower}
					{#if networkRawBytePower != null}
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
					viewSelection({
						fields: {
							networkQualityAdjustedPower: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const networkQualityAdjustedPower = entity.networkQualityAdjustedPower}
					{#if networkQualityAdjustedPower != null}
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
					viewSelection({
						fields: {
							activeSectorCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const activeSectorCount = entity.activeSectorCount}
					{#if activeSectorCount != null}
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
					viewSelection({
						fields: {
							liveSectorCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const liveSectorCount = entity.liveSectorCount}
					{#if liveSectorCount != null}
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
					viewSelection({
						fields: {
							faultySectorCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const faultySectorCount = entity.faultySectorCount}
					{#if faultySectorCount != null}
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
