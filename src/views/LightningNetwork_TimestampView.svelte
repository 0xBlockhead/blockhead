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
	import { select } from '$/routes/+layout.svelte'
	// State
	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.LightningNetwork_Timestamp>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	const snapshot = $derived(selection(
		({ sources: [
				Source.LightningMempoolSpace_Rest,
			], fields: { nodeCount: true, channelCount: true, totalCapacitySats: true, averageFeeRatePpm: true, medianFeeRatePpm: true, ...(open && ({ torNodeCount: true, clearnetNodeCount: true, unannouncedNodeCount: true, averageCapacitySats: true, medianCapacitySats: true })) } }),
	))


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.LightningNetwork_Timestamp}
	entitySelector={selection.entitySelector}
	title="Lightning Network snapshot"
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary
			resource={snapshot}
			placeholderText="Loading snapshot…"
		>
			{#snippet children(lightningNetworkTimestamp)}
				{#if lightningNetworkTimestamp.fields.nodeCount != null}
					<NumberValue value={lightningNetworkTimestamp.fields.nodeCount} />
					nodes
				{:else if lightningNetworkTimestamp.fields.channelCount != null}
					<NumberValue value={lightningNetworkTimestamp.fields.channelCount} />
					channels
				{:else}
					Snapshot
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={snapshot}
			placeholderText="Loading snapshot…"
		>
			{#snippet children(lightningNetworkTimestamp)}
				<dl>
					{#if lightningNetworkTimestamp.fields.nodeCount != null}
						<div>
							<dt>Nodes</dt>
							<dd><NumberValue value={lightningNetworkTimestamp.fields.nodeCount} /></dd>
						</div>
					{/if}

					{#if lightningNetworkTimestamp.fields.channelCount != null}
						<div>
							<dt>Channels</dt>
							<dd><NumberValue value={lightningNetworkTimestamp.fields.channelCount} /></dd>
						</div>
					{/if}

					{#if lightningNetworkTimestamp.fields.totalCapacitySats != null}
						<div>
							<dt>Capacity</dt>
							<dd>{lightningNetworkTimestamp.fields.totalCapacitySats.toString()} sats</dd>
						</div>
					{/if}

					{#if lightningNetworkTimestamp.fields.averageFeeRatePpm != null}
						<div>
							<dt>Average fee rate</dt>
							<dd><NumberValue value={lightningNetworkTimestamp.fields.averageFeeRatePpm} /> ppm</dd>
						</div>
					{/if}

					{#if lightningNetworkTimestamp.fields.medianFeeRatePpm != null}
						<div>
							<dt>Median fee rate</dt>
							<dd><NumberValue value={lightningNetworkTimestamp.fields.medianFeeRatePpm} /> ppm</dd>
						</div>
					{/if}

					{#if open && lightningNetworkTimestamp.fields.torNodeCount != null}
						<div>
							<dt>Tor nodes</dt>
							<dd><NumberValue value={lightningNetworkTimestamp.fields.torNodeCount} /></dd>
						</div>
					{/if}

					{#if open && lightningNetworkTimestamp.fields.clearnetNodeCount != null}
						<div>
							<dt>Clearnet nodes</dt>
							<dd><NumberValue value={lightningNetworkTimestamp.fields.clearnetNodeCount} /></dd>
						</div>
					{/if}

					{#if open && lightningNetworkTimestamp.fields.unannouncedNodeCount != null}
						<div>
							<dt>Unannounced nodes</dt>
							<dd><NumberValue value={lightningNetworkTimestamp.fields.unannouncedNodeCount} /></dd>
						</div>
					{/if}

					{#if open && lightningNetworkTimestamp.fields.averageCapacitySats != null}
						<div>
							<dt>Average capacity</dt>
							<dd>{lightningNetworkTimestamp.fields.averageCapacitySats.toString()} sats</dd>
						</div>
					{/if}

					{#if open && lightningNetworkTimestamp.fields.medianCapacitySats != null}
						<div>
							<dt>Median capacity</dt>
							<dd>{lightningNetworkTimestamp.fields.medianCapacitySats.toString()} sats</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
