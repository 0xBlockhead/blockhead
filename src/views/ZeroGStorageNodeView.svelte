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
			entityId: EntityId<typeof schema, EntityType.ZeroGStorageNode>
			open?: boolean
		},
		Pick<ComponentProps<typeof EntityView>, 'layout' | 'showTypeAnnotation'>
	> = $props()

	const storageNode = useEntity(entityCollectionsContext, EntityType.ZeroGStorageNode, entityId, ({ fields: { $operator: true, endpoint: true, balance: true, totalReward: true, winCount: true, miningAttempts: true } }))


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
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
		<p>A 0G storage node stores chunks and participates in storage proof and reward flows.</p>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={storageNode}
			placeholderText="Loading 0G storage node…"
		>
			{#snippet children(storageNode)}
				<dl>
					{#if storageNode.fields.$operator != null}
						<div>
							<dt>Operator</dt>
							<dd>
								<EvmAccountView
									entityId={storageNode.fields.$operator[EntityMetaKey.Id]}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}

					{#if storageNode.fields.endpoint != null}
						<div>
							<dt>Endpoint</dt>
							<dd>{storageNode.fields.endpoint}</dd>
						</div>
					{/if}

					{#if storageNode.fields.balance != null}
						<div>
							<dt>Balance</dt>
							<dd>{storageNode.fields.balance}</dd>
						</div>
					{/if}

					{#if storageNode.fields.totalReward != null}
						<div>
							<dt>Total reward</dt>
							<dd>{storageNode.fields.totalReward}</dd>
						</div>
					{/if}

					{#if storageNode.fields.winCount != null}
						<div>
							<dt>Wins</dt>
							<dd><NumberValue value={storageNode.fields.winCount} /></dd>
						</div>
					{/if}

					{#if storageNode.fields.miningAttempts != null}
						<div>
							<dt>Mining attempts</dt>
							<dd><NumberValue value={storageNode.fields.miningAttempts} /></dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
