<script lang="ts">
	// Types/constants
	import {
		caip2RouteParamsFromNetworkId,
		evmChainIdFromNetworkId,
	} from '$/lib/caip.ts'


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
			{ ...caip2RouteParamsFromNetworkId(entityId.$network) },
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
		<ResourceBoundary
			resource={networkBeaconFinalityTimestamp}
			placeholderText="Loading finality…"
		>
			{#snippet children(networkBeaconFinalityTimestamp)}
				{#if networkBeaconFinalityTimestamp.finalizedCheckpointEpoch !== undefined}
					<BeaconEpochView
						entityId={{
							$network: entityId.$network,
							epoch: networkBeaconFinalityTimestamp.finalizedCheckpointEpoch,
						}}
						layout={EntityLayout.Value}
						open={false}
					/>
					finalized
				{:else if networkBeaconFinalityTimestamp.currentJustifiedCheckpointEpoch !== undefined}
					<BeaconEpochView
						entityId={{
							$network: entityId.$network,
							epoch: networkBeaconFinalityTimestamp.currentJustifiedCheckpointEpoch,
						}}
						layout={EntityLayout.Value}
						open={false}
					/>
					justified
				{:else}
					<span>
						chain {String(evmChainIdFromNetworkId(entityId.$network))}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		{@render Value()}
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Justified and finalized checkpoints from the beacon node’s head state—epoch numbers and block roots the chain treats as safe under Casper FFG rules.
		</p>
	{/snippet}

	{#snippet Content({})}
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
									$network: networkIdFromEvmChainId(evmChainIdFromNetworkId(entityId.$network)),
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
									$network: networkIdFromEvmChainId(evmChainIdFromNetworkId(entityId.$network)),
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
									$network: networkIdFromEvmChainId(evmChainIdFromNetworkId(entityId.$network)),
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
