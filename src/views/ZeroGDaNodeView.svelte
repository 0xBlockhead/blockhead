<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	import { useEntity } from '$/collections/$collections.ts'
	import { entityCollectionsContext } from '$/collections/entityCollections.ts'

	let {
		entityId,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.ZeroGDaNode>
			open?: boolean
		},
		Pick<ComponentProps<typeof EntityView>, 'layout' | 'showTypeAnnotation'>
	> = $props()

	const zeroGDaNode = useEntity(entityCollectionsContext, EntityType.ZeroGDaNode, entityId, ({ fields: { $quorum: true, $operator: true, endpoint: true } }))


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
	import ZeroGDaQuorumView from '$/views/ZeroGDaQuorumView.svelte'
</script>


<EntityView
	entityType={EntityType.ZeroGDaNode}
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

	{#snippet Content()}
		<ResourceBoundary
			resource={zeroGDaNode}
			placeholderText={`Loading 0G DA node...`}
		>
			{#snippet children(zeroGDaNode)}
				<dl>
					{#if zeroGDaNode.fields.$operator != null}
						<div>
							<dt>Operator</dt>
							<dd>
								<EvmAccountView
									entityId={zeroGDaNode.fields.$operator[EntityMetaKey.Id]}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}

					{#if zeroGDaNode.fields.endpoint != null}
						<div>
							<dt>Endpoint</dt>
							<dd>{zeroGDaNode.fields.endpoint}</dd>
						</div>
					{/if}

					{#if zeroGDaNode.fields.$quorum != null}
						<div>
							<dt>Quorum</dt>
							<dd>
								<ZeroGDaQuorumView
									entityId={zeroGDaNode.fields.$quorum[EntityMetaKey.Id]}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
