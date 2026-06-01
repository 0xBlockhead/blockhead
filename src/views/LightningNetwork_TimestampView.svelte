<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// State
	let {
		entityId,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.LightningNetwork_Timestamp>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const snapshot = useEntity(
		EntityType.LightningNetwork_Timestamp,
		entityId,
		{
			$: [
				Source.LightningMempoolSpace_Rest,
			],
			nodeCount: {},
			channelCount: {},
			totalCapacitySats: {},
			averageFeeRatePpm: {},
			medianFeeRatePpm: {},
			...open && {
				torNodeCount: {},
				clearnetNodeCount: {},
				unannouncedNodeCount: {},
				averageCapacitySats: {},
				medianCapacitySats: {},
			},
		},
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.LightningNetwork_Timestamp}
	{entityId}
	title="Lightning Network snapshot"
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary
			resource={snapshot}
			placeholderText="Loading snapshot…"
		>
			{#snippet children(row)}
				{#if lightningNetworkTimestamp.nodeCount != null}
					<NumberValue value={lightningNetworkTimestamp.nodeCount} />
					nodes
				{:else if lightningNetworkTimestamp.channelCount != null}
					<NumberValue value={lightningNetworkTimestamp.channelCount} />
					channels
				{:else}
					Snapshot
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		{@render Value()}
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={snapshot}
			placeholderText="Loading snapshot…"
		>
			{#snippet children(row)}
				<dl>
					{#if lightningNetworkTimestamp.nodeCount != null}
						<div>
							<dt>Nodes</dt>
							<dd><NumberValue value={lightningNetworkTimestamp.nodeCount} /></dd>
						</div>
					{/if}

					{#if lightningNetworkTimestamp.channelCount != null}
						<div>
							<dt>Channels</dt>
							<dd><NumberValue value={lightningNetworkTimestamp.channelCount} /></dd>
						</div>
					{/if}

					{#if lightningNetworkTimestamp.totalCapacitySats != null}
						<div>
							<dt>Capacity</dt>
							<dd>{lightningNetworkTimestamp.totalCapacitySats.toString()} sats</dd>
						</div>
					{/if}

					{#if lightningNetworkTimestamp.averageFeeRatePpm != null}
						<div>
							<dt>Average fee rate</dt>
							<dd><NumberValue value={lightningNetworkTimestamp.averageFeeRatePpm} /> ppm</dd>
						</div>
					{/if}

					{#if lightningNetworkTimestamp.medianFeeRatePpm != null}
						<div>
							<dt>Median fee rate</dt>
							<dd><NumberValue value={lightningNetworkTimestamp.medianFeeRatePpm} /> ppm</dd>
						</div>
					{/if}

					{#if open && lightningNetworkTimestamp.torNodeCount != null}
						<div>
							<dt>Tor nodes</dt>
							<dd><NumberValue value={lightningNetworkTimestamp.torNodeCount} /></dd>
						</div>
					{/if}

					{#if open && lightningNetworkTimestamp.clearnetNodeCount != null}
						<div>
							<dt>Clearnet nodes</dt>
							<dd><NumberValue value={lightningNetworkTimestamp.clearnetNodeCount} /></dd>
						</div>
					{/if}

					{#if open && lightningNetworkTimestamp.unannouncedNodeCount != null}
						<div>
							<dt>Unannounced nodes</dt>
							<dd><NumberValue value={lightningNetworkTimestamp.unannouncedNodeCount} /></dd>
						</div>
					{/if}

					{#if open && lightningNetworkTimestamp.averageCapacitySats != null}
						<div>
							<dt>Average capacity</dt>
							<dd>{lightningNetworkTimestamp.averageCapacitySats.toString()} sats</dd>
						</div>
					{/if}

					{#if open && lightningNetworkTimestamp.medianCapacitySats != null}
						<div>
							<dt>Median capacity</dt>
							<dd>{lightningNetworkTimestamp.medianCapacitySats.toString()} sats</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
