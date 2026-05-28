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
	{#snippet Title()}
		Snapshot
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={snapshot}
			placeholderText="Loading snapshot…"
		>
			{#snippet children(row)}
				<dl>
					{#if row.nodeCount != null}
						<div>
							<dt>Nodes</dt>
							<dd><NumberValue value={row.nodeCount} /></dd>
						</div>
					{/if}

					{#if row.channelCount != null}
						<div>
							<dt>Channels</dt>
							<dd><NumberValue value={row.channelCount} /></dd>
						</div>
					{/if}

					{#if row.totalCapacitySats != null}
						<div>
							<dt>Capacity</dt>
							<dd>{row.totalCapacitySats.toString()} sats</dd>
						</div>
					{/if}

					{#if row.averageFeeRatePpm != null}
						<div>
							<dt>Average fee rate</dt>
							<dd><NumberValue value={row.averageFeeRatePpm} /> ppm</dd>
						</div>
					{/if}

					{#if row.medianFeeRatePpm != null}
						<div>
							<dt>Median fee rate</dt>
							<dd><NumberValue value={row.medianFeeRatePpm} /> ppm</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
