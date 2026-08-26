<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.OracleFeed_Timestamp>, 'prefetched'> = $props()

	const oracleFeed = $derived(selection.entitySelector.$oracleFeed)
	const oracleFeedTimestamp = $derived(selection({
		fields: {
			description: true,
			latestRoundId: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import OracleFeedView from '$/views/OracleFeedView.svelte'
</script>


<EntityView
	entityType={EntityType.OracleFeed_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.timestampMs)}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/oracle/feed/[address=evmAddress]/(oracleFeed)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					network: (
						'caip2' in oracleFeed.$network ?
							caip2StringFromValue(oracleFeed.$network.caip2)
						:
							oracleFeed.$network.slug
					),
					address: oracleFeed.address,
					timestampMs: String(selection.entitySelector.timestampMs),
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
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={oracleFeedTimestamp}>
			{#snippet children(entity)}
				{[(entity.description ?? ''), String(entity.latestRoundId ?? '')].filter(Boolean).join(' ') || String(selection.entitySelector.timestampMs)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			{selection.entitySelector.source}
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>oracle feed</dt>
				<dd>
					<OracleFeedView
						selection={select(EntityType.OracleFeed, selection.entitySelector.$oracleFeed)}
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
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={oracleFeedTimestamp}
			>
				{#snippet children(entity)}
					{@const description = entity.description}
					{#if description != null}
						<div>
							<dt>Description</dt>
							<dd>
								{description}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							decimals: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const decimals = entity.decimals}
					{#if decimals != null}
						<div>
							<dt>Decimals</dt>
							<dd>
								<NumberValue
									value={decimals}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
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
							<dt>version</dt>
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
					selection({
						fields: {
							typeAndVersion: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const typeAndVersion = entity.typeAndVersion}
					{#if typeAndVersion != null}
						<div>
							<dt>type and version</dt>
							<dd>
								{typeAndVersion}
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
						fields: {
							aggregatorAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const aggregatorAddress = entity.aggregatorAddress}
					{#if aggregatorAddress != null}
						<div>
							<dt>aggregator address</dt>
							<dd>
								<TruncatedValue value={aggregatorAddress} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={oracleFeedTimestamp}
			>
				{#snippet children(entity)}
					{@const latestRoundId = entity.latestRoundId}
					{#if latestRoundId != null}
						<div>
							<dt>latest round ID</dt>
							<dd>
								<NumberValue
									value={latestRoundId}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							latestUpdatedAtMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const latestUpdatedAtMs = entity.latestUpdatedAtMs}
					{#if latestUpdatedAtMs != null}
						<div>
							<dt>latest updated AT ms</dt>
							<dd>
								<Timestamp timestamp={latestUpdatedAtMs} />
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
						fields: {
							configDigest: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const configDigest = entity.configDigest}
					{#if configDigest != null}
						<div>
							<dt>config digest</dt>
							<dd>
								<TruncatedValue value={configDigest} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							configBlockNumber: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const configBlockNumber = entity.configBlockNumber}
					{#if configBlockNumber != null}
						<div>
							<dt>config block number</dt>
							<dd>
								<NumberValue
									value={configBlockNumber}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
