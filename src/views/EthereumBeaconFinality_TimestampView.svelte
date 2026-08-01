<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


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
	}: EntitySelectionViewProps<EntityType.EthereumBeaconFinality_Timestamp> = $props()

	const network = $derived(selection.entitySelector.$network)
	const ethereumBeaconFinalityTimestamp = $derived(selection({
		fields: {
			finalizedCheckpointEpoch: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.EthereumBeaconFinality_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? 'Finalized epoch ' + String(prefetched.finalizedCheckpointEpoch ?? '')}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/finality/[timestampMs=nonNegativeInteger]',
				{
					network: (
						'caip2' in network ?
							caip2StringFromValue(network.caip2)
						:
							network.slug
					),
					timestampMs: String(selection.entitySelector.timestampMs),
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
		<ResourceBoundary resource={ethereumBeaconFinalityTimestamp}>
			{#snippet children(entity)}
				<span>Finalized epoch </span>
				<NumberValue
					value={entity.finalizedCheckpointEpoch}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={ethereumBeaconFinalityTimestamp}>
			{#snippet children(entity)}
				<NumberValue
					value={entity.finalizedCheckpointEpoch}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<Timestamp timestamp={selection.entitySelector.timestampMs} />
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>

			<div>
				<dt>Finalized checkpoint epoch</dt>
				<dd>
					<ResourceBoundary
						resource={ethereumBeaconFinalityTimestamp}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.finalizedCheckpointEpoch}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Finalized checkpoint root</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									finalizedCheckpointRoot: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.finalizedCheckpointRoot} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Current justified checkpoint epoch</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									currentJustifiedCheckpointEpoch: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.currentJustifiedCheckpointEpoch}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Current justified checkpoint root</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									currentJustifiedCheckpointRoot: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.currentJustifiedCheckpointRoot} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Previous justified checkpoint epoch</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									previousJustifiedCheckpointEpoch: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.previousJustifiedCheckpointEpoch}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Previous justified checkpoint root</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									previousJustifiedCheckpointRoot: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.previousJustifiedCheckpointRoot} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
