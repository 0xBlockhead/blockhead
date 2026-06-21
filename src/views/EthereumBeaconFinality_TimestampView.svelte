<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		selection,
		href = resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]', {
			caip2: `${selection.entitySelector.$network.caip2.namespace}:${selection.entitySelector.$network.caip2.reference}`,
		}),
		layout,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.EthereumBeaconFinality_Timestamp>
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
	import { select } from '$/routes/+layout.svelte'

	const networkBeaconFinalityTimestamp = $derived(selection({
			sources: [
				Source.Beacon_Rest,
			],
		},
	))


	const finalizedCheckpointEpoch = $derived(networkBeaconFinalityTimestamp.finalizedCheckpointEpoch)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import BeaconEpochView from '$/views/BeaconEpochView.svelte'
</script>


<EntityView
	entityType={EntityType.EthereumBeaconFinality_Timestamp}
	entitySelector={selection.entitySelector}
	{href}
	{layout}
	{open}
	title="Beacon finality"
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary
			resource={finalizedCheckpointEpoch}
			placeholderText="Loading finality…"
		>
			{#snippet children(finalizedCheckpointEpoch)}
				{#if finalizedCheckpointEpoch !== undefined}
					<BeaconEpochView
						selection={select(EntityType.BeaconEpoch, {
							$network: selection.entitySelector.$network,
							epoch: finalizedCheckpointEpoch,
						})}
						layout={EntityLayout.Value}

						open={false}
						/>
					finalized
				{:else}
					<span>chain {String(evmChainIdFromCaip2(`${selection.entitySelector.$network.caip2.namespace}:${selection.entitySelector.$network.caip2.reference}`))}</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={finalizedCheckpointEpoch}
			placeholderText="Loading finality…"
		>
			{#snippet children(finalizedCheckpointEpoch)}
				{#if finalizedCheckpointEpoch !== undefined}
					<BeaconEpochView
						selection={select(EntityType.BeaconEpoch, {
							$network: selection.entitySelector.$network,
							epoch: finalizedCheckpointEpoch,
						})}
						layout={EntityLayout.Value}

						open={false}
						/>
					finalized
				{:else}
					<span>chain {String(evmChainIdFromCaip2(`${selection.entitySelector.$network.caip2.namespace}:${selection.entitySelector.$network.caip2.reference}`))}</span>
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
		<dl data-column-item="center">
			<div>
				<dt>As of</dt>
				<dd><Timestamp timestamp={selection.entitySelector.timestampMs} /></dd>
			</div>

			<ResourceBoundary resource={networkBeaconFinalityTimestamp.currentJustifiedCheckpointEpoch} placeholderText="Loading justified checkpoint…">
				{#snippet children(currentJustifiedCheckpointEpoch)}
					{#if currentJustifiedCheckpointEpoch !== undefined}
						<div>
							<dt>Justified</dt>
							<dd data-row="wrap align-start gap-2">
									<BeaconEpochView selection={select(EntityType.BeaconEpoch, { $network: selection.entitySelector.$network, epoch: currentJustifiedCheckpointEpoch })} layout={EntityLayout.Title} open={false} />
								<ResourceBoundary resource={networkBeaconFinalityTimestamp.currentJustifiedCheckpointRoot} placeholderText="Loading justified root…">
									{#snippet children(currentJustifiedCheckpointRoot)}
										{#if currentJustifiedCheckpointRoot !== undefined}
											<TruncatedValue format={TruncatedValueFormat.Abbr} value={currentJustifiedCheckpointRoot} />
										{/if}
									{/snippet}
								</ResourceBoundary>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={finalizedCheckpointEpoch} placeholderText="Loading finalized checkpoint…">
				{#snippet children(finalizedCheckpointEpoch)}
					{#if finalizedCheckpointEpoch !== undefined}
						<div>
							<dt>Finalized</dt>
							<dd data-row="wrap align-start gap-2">
									<BeaconEpochView selection={select(EntityType.BeaconEpoch, { $network: selection.entitySelector.$network, epoch: finalizedCheckpointEpoch })} layout={EntityLayout.Title} open={false} />
								<ResourceBoundary resource={networkBeaconFinalityTimestamp.finalizedCheckpointRoot} placeholderText="Loading finalized root…">
									{#snippet children(finalizedCheckpointRoot)}
										{#if finalizedCheckpointRoot !== undefined}
											<TruncatedValue format={TruncatedValueFormat.Abbr} value={finalizedCheckpointRoot} />
										{/if}
									{/snippet}
								</ResourceBoundary>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={networkBeaconFinalityTimestamp.previousJustifiedCheckpointEpoch} placeholderText="Loading previous justified checkpoint…">
				{#snippet children(previousJustifiedCheckpointEpoch)}
					{#if previousJustifiedCheckpointEpoch !== undefined}
						<div>
							<dt>Previous justified</dt>
							<dd data-row="wrap align-start gap-2">
									<BeaconEpochView selection={select(EntityType.BeaconEpoch, { $network: selection.entitySelector.$network, epoch: previousJustifiedCheckpointEpoch })} layout={EntityLayout.Title} open={false} />
								<ResourceBoundary resource={networkBeaconFinalityTimestamp.previousJustifiedCheckpointRoot} placeholderText="Loading previous justified root…">
									{#snippet children(previousJustifiedCheckpointRoot)}
										{#if previousJustifiedCheckpointRoot !== undefined}
											<TruncatedValue format={TruncatedValueFormat.Abbr} value={previousJustifiedCheckpointRoot} />
										{/if}
									{/snippet}
								</ResourceBoundary>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

</EntityView>
