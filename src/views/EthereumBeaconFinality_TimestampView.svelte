<script lang="ts">
	// Types/constants
	import { caip2RouteParamsFromEvmChainId } from '$/lib/caip.ts'


	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve(
			'/(explore)/network/[caip2Namespace]:[caip2Reference]',
			{ ...caip2RouteParamsFromEvmChainId(entityId.$network.chainId) },
		),
		layout,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.EthereumBeaconFinality_Timestamp>
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'showTypeAnnotation'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const networkBeaconFinalityTimestamp = useEntity(
		EntityType.EthereumBeaconFinality_Timestamp,
		entityId,
		{
			$: [
				Source.Beacon_Rest,
			],
			currentJustifiedCheckpointEpoch: {},
			currentJustifiedCheckpointRoot: {},
			previousJustifiedCheckpointEpoch: {},
			previousJustifiedCheckpointRoot: {},
			finalizedCheckpointEpoch: {},
			finalizedCheckpointRoot: {},
		},
	)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import BeaconEpochView from '$/views/BeaconEpochView.svelte'
</script>


<EntityView
	entityType={EntityType.EthereumBeaconFinality_Timestamp}
	{entityId}
	{href}
	{layout}
	{open}
	title="Beacon finality"
	{...EntityViewProps}
>
	{#snippet Value()}
		<span>
			chain {String(entityId.$network.chainId)}
		</span>
	{/snippet}

	{#snippet Heading()}
		<Timestamp
			timestamp={entityId.timestampMs}
		/>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Justified and finalized checkpoints from the beacon node’s head state—epoch numbers and block roots the chain treats as safe under Casper FFG rules.
		</p>
	{/snippet}

	{#snippet Title()}
		<span>
			chain {String(entityId.$network.chainId)}
		</span>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<ResourceBoundary
			resource={networkBeaconFinalityTimestamp}
			placeholderText="Loading finality…"
		>
			{#snippet children(networkBeaconFinalityTimestamp)}
				<dl data-column-item="center">
					<div>
						<dt>As of</dt>
						<dd>
							<Timestamp
								timestamp={entityId.timestampMs}
							/>
						</dd>
					</div>
					<div>
						<dt>Justified</dt>
						<dd data-row="wrap align-start gap-2">
							<BeaconEpochView
								entityId={{
									$network: { chainId: entityId.$network.chainId },
									epoch: networkBeaconFinalityTimestamp.currentJustifiedCheckpointEpoch,
								}}
								layout={EntityLayout.Title}
								open={false}
							/>
							<TruncatedValue
								format={TruncatedValueFormat.Abbr}
								value={networkBeaconFinalityTimestamp.currentJustifiedCheckpointRoot}
							/>
						</dd>
					</div>
					<div>
						<dt>Finalized</dt>
						<dd data-row="wrap align-start gap-2">
							<BeaconEpochView
								entityId={{
									$network: { chainId: entityId.$network.chainId },
									epoch: networkBeaconFinalityTimestamp.finalizedCheckpointEpoch,
								}}
								layout={EntityLayout.Title}
								open={false}
							/>
							<TruncatedValue
								format={TruncatedValueFormat.Abbr}
								value={networkBeaconFinalityTimestamp.finalizedCheckpointRoot}
							/>
						</dd>
					</div>
					<div>
						<dt>Previous justified</dt>
						<dd data-row="wrap align-start gap-2">
							<BeaconEpochView
								entityId={{
									$network: { chainId: entityId.$network.chainId },
									epoch: networkBeaconFinalityTimestamp.previousJustifiedCheckpointEpoch,
								}}
								layout={EntityLayout.Title}
								open={false}
							/>
							<TruncatedValue
								format={TruncatedValueFormat.Abbr}
								value={networkBeaconFinalityTimestamp.previousJustifiedCheckpointRoot}
							/>
						</dd>
					</div>
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>

