<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve('/(explore)/(networks)/network/[caip2Namespace=eip155Caip2Namespace]:[caip2Reference=eip155Caip2Reference]', {
			caip2Namespace: entityId.$network.caip2.namespace,
			caip2Reference: entityId.$network.caip2.reference,
		}),
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

	import { evmChainIdFromCaip2 } from '$/lib/caip.ts'
	import { subscribe } from '$/routes/+layout.svelte'

	const networkBeaconFinalityTimestamp = subscribe(EntityType.EthereumBeaconFinality_Timestamp,
		entityId,
		({ sources: [
				Source.Beacon_Rest,
			], fields: { currentJustifiedCheckpointEpoch: true, currentJustifiedCheckpointRoot: true, previousJustifiedCheckpointEpoch: true, previousJustifiedCheckpointRoot: true, finalizedCheckpointEpoch: true, finalizedCheckpointRoot: true } }),
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
				{#if networkBeaconFinalityTimestamp.fields.finalizedCheckpointEpoch !== undefined}
					<BeaconEpochView
						entityId={{
							$network: entityId.$network,
							epoch: networkBeaconFinalityTimestamp.fields.finalizedCheckpointEpoch,
						}}
						layout={EntityLayout.Value}
						open={false}
					/>
					finalized
				{:else if networkBeaconFinalityTimestamp.fields.currentJustifiedCheckpointEpoch !== undefined}
					<BeaconEpochView
						entityId={{
							$network: entityId.$network,
							epoch: networkBeaconFinalityTimestamp.fields.currentJustifiedCheckpointEpoch,
						}}
						layout={EntityLayout.Value}
						open={false}
					/>
					justified
				{:else}
					<span>
						chain {String(evmChainIdFromCaip2(`${entityId.$network.caip2.namespace}:${entityId.$network.caip2.reference}`))}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={networkBeaconFinalityTimestamp}
			placeholderText="Loading finality…"
		>
			{#snippet children(networkBeaconFinalityTimestamp)}
				{#if networkBeaconFinalityTimestamp.fields.finalizedCheckpointEpoch !== undefined}
					<BeaconEpochView
						entityId={{
							$network: entityId.$network,
							epoch: networkBeaconFinalityTimestamp.fields.finalizedCheckpointEpoch,
						}}
						layout={EntityLayout.Value}
						open={false}
					/>
					finalized
				{:else if networkBeaconFinalityTimestamp.fields.currentJustifiedCheckpointEpoch !== undefined}
					<BeaconEpochView
						entityId={{
							$network: entityId.$network,
							epoch: networkBeaconFinalityTimestamp.fields.currentJustifiedCheckpointEpoch,
						}}
						layout={EntityLayout.Value}
						open={false}
					/>
					justified
				{:else}
					<span>
						chain {String(evmChainIdFromCaip2(`${entityId.$network.caip2.namespace}:${entityId.$network.caip2.reference}`))}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
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
									$network: entityId.$network,
									epoch: networkBeaconFinalityTimestamp.fields.currentJustifiedCheckpointEpoch,
								}}
								layout={EntityLayout.Title}
								open={false}
							/>
							<TruncatedValue
								format={TruncatedValueFormat.Abbr}
								value={networkBeaconFinalityTimestamp.fields.currentJustifiedCheckpointRoot}
							/>
						</dd>
					</div>
					<div>
						<dt>Finalized</dt>
						<dd data-row="wrap align-start gap-2">
							<BeaconEpochView
								entityId={{
									$network: entityId.$network,
									epoch: networkBeaconFinalityTimestamp.fields.finalizedCheckpointEpoch,
								}}
								layout={EntityLayout.Title}
								open={false}
							/>
							<TruncatedValue
								format={TruncatedValueFormat.Abbr}
								value={networkBeaconFinalityTimestamp.fields.finalizedCheckpointRoot}
							/>
						</dd>
					</div>
					<div>
						<dt>Previous justified</dt>
						<dd data-row="wrap align-start gap-2">
							<BeaconEpochView
								entityId={{
									$network: entityId.$network,
									epoch: networkBeaconFinalityTimestamp.fields.previousJustifiedCheckpointEpoch,
								}}
								layout={EntityLayout.Title}
								open={false}
							/>
							<TruncatedValue
								format={TruncatedValueFormat.Abbr}
								value={networkBeaconFinalityTimestamp.fields.previousJustifiedCheckpointRoot}
							/>
						</dd>
					</div>
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
