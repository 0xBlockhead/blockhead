<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	import { select } from '$/routes/+layout.svelte'

	let {
		selector,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.ZeroGStorageNode>
			open?: boolean
		},
		Pick<ComponentProps<typeof EntityView>, 'layout' | 'showTypeAnnotation'>
	> = $props()

	


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.ZeroGStorageNode}
	entitySelector={selector}
	title={selector.nodeId}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<TruncatedValue
			value={selector.nodeId}
			format={TruncatedValueFormat.Abbr}
		/>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>A 0G storage node stores chunks and participates in storage proof and reward flows.</p>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={select(EntityType.ZeroGStorageNode, selector, ({ fields: { $operator: true, endpoint: true, balance: true, totalReward: true, winCount: true, miningAttempts: true } }))}
			placeholderText="Loading 0G storage node…"
		>
			{#snippet children(storageNode)}
				<dl>
					{#if storageNode.fields.$operator != null}
						<div>
							<dt>Operator</dt>
							<dd>
								<EvmAccountView
									selector={storageNode.fields.$operator[EntityMetaKey.Selector]}
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
