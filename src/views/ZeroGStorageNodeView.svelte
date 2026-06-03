<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { useEntity } from '$/collections/$queries.svelte.ts'
	// State
	let {
		entityId,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.ZeroGStorageNode>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	const storageNode = useEntity(
		EntityType.ZeroGStorageNode,
		entityId,
		{
			operatorAddress: {},
			endpoint: {},
		},
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.ZeroGStorageNode}
	{entityId}
	title={entityId.nodeId}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		<TruncatedValue
			value={entityId.nodeId}
			format={TruncatedValueFormat.Abbr}
		/>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A 0G storage node stores chunks and participates in storage proof and reward flows.
		</p>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={storageNode}
			placeholderText="Loading 0G storage node…"
		>
			{#snippet children(storageNode)}
				<dl>
					{#if storageNode.operatorAddress != null}
						<div>
							<dt>Operator</dt>
							<dd>
								<TruncatedValue
									value={storageNode.operatorAddress}
									format={TruncatedValueFormat.Abbr}
								/>
							</dd>
						</div>
					{/if}

					{#if storageNode.endpoint != null}
						<div>
							<dt>Endpoint</dt>
							<dd>{storageNode.endpoint}</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
