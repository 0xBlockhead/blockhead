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
	}: Omit<EntitySelectionViewProps<EntityType.BitcoinMiningPool_Timestamp>, 'prefetched'> = $props()

	const pool = $derived(selection.entitySelector.$pool)
	const bitcoinMiningPoolTimestamp = $derived(selection({
		fields: {
			blockCount24h: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import BitcoinMiningPoolView from '$/views/BitcoinMiningPoolView.svelte'
</script>


<EntityView
	entityType={EntityType.BitcoinMiningPool_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.timestampMs)}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/mining-pool/[slug=stringSegment]/(bitcoinMiningPool)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					network: (
						'caip2' in pool.$network ?
							caip2StringFromValue(pool.$network.caip2)
						:
							pool.$network.slug
					),
					slug: pool.slug,
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
		<ResourceBoundary resource={bitcoinMiningPoolTimestamp}>
			{#snippet children(entity)}
				<BitcoinMiningPoolView
					selection={select(EntityType.BitcoinMiningPool, selection.entitySelector.$pool)}
					href={null}
					layout={EntityLayout.Value}
				/>
				{@const blockCount24h = entity.blockCount24h}
				{#if blockCount24h != null}
					<NumberValue
						value={blockCount24h}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Pool</dt>
				<dd>
					<BitcoinMiningPoolView
						selection={select(EntityType.BitcoinMiningPool, selection.entitySelector.$pool)}
						layout={EntityLayout.Value}
					/>
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
				resource={
					selection({
						fields: {
							blockCountAll: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const blockCountAll = entity.blockCountAll}
					{#if blockCountAll != null}
						<div>
							<dt>Blocks attributed (all)</dt>
							<dd>
								<NumberValue
									value={blockCountAll}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={bitcoinMiningPoolTimestamp}
			>
				{#snippet children(entity)}
					{@const blockCount24h = entity.blockCount24h}
					{#if blockCount24h != null}
						<div>
							<dt>Blocks attributed (24h)</dt>
							<dd>
								<NumberValue
									value={blockCount24h}
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
							blockCount1w: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const blockCount1w = entity.blockCount1w}
					{#if blockCount1w != null}
						<div>
							<dt>Blocks attributed (1w)</dt>
							<dd>
								<NumberValue
									value={blockCount1w}
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
					selection({
						fields: {
							blockShareAll: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const blockShareAll = entity.blockShareAll}
					{#if blockShareAll != null}
						<div>
							<dt>Block share (all)</dt>
							<dd>
								<NumberValue
									value={blockShareAll}
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
							blockShare24h: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const blockShare24h = entity.blockShare24h}
					{#if blockShare24h != null}
						<div>
							<dt>Block share (24h)</dt>
							<dd>
								<NumberValue
									value={blockShare24h}
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
							blockShare1w: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const blockShare1w = entity.blockShare1w}
					{#if blockShare1w != null}
						<div>
							<dt>Block share (1w)</dt>
							<dd>
								<NumberValue
									value={blockShare1w}
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
					selection({
						fields: {
							estimatedHashrateHashesPerSecond: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const estimatedHashrateHashesPerSecond = entity.estimatedHashrateHashesPerSecond}
					{#if estimatedHashrateHashesPerSecond != null}
						<div>
							<dt>Estimated hashrate</dt>
							<dd>
								{estimatedHashrateHashesPerSecond}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							reportedHashrateHashesPerSecond: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const reportedHashrateHashesPerSecond = entity.reportedHashrateHashesPerSecond}
					{#if reportedHashrateHashesPerSecond != null}
						<div>
							<dt>Reported hashrate</dt>
							<dd>
								{reportedHashrateHashesPerSecond}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							avgBlockHealth: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const avgBlockHealth = entity.avgBlockHealth}
					{#if avgBlockHealth != null}
						<div>
							<dt>Average block health</dt>
							<dd>
								<NumberValue
									value={avgBlockHealth}
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
							totalRewardSats: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const totalRewardSats = entity.totalRewardSats}
					{#if totalRewardSats != null}
						<div>
							<dt>Total attributed reward</dt>
							<dd>
								<NumberValue
									value={totalRewardSats}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
