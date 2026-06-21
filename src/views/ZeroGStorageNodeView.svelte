<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// State
	import { select } from '$/routes/+layout.svelte'

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.ZeroGStorageNode>
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
	entitySelector={selection.entitySelector}
	title={selection.entitySelector.nodeId}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<TruncatedValue
			value={selection.entitySelector.nodeId}
			format={TruncatedValueFormat.Abbr}
		/>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>A 0G storage node stores chunks and participates in storage proof and reward flows.</p>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={selection({
				sources: [Source.ZeroGStorageScan_Rest],
				fields: { $operator: true, balance: true, totalReward: true },
			})}
			placeholderText="Loading 0G storage node…"
		>
			{#snippet children(storageNode)}
				<dl>
					{#if storageNode.$operator != null}
						<div>
							<dt>Operator</dt>
							<dd>
								<EvmAccountView
									selection={select(EntityType.EvmAccount, storageNode.$operator[EntityMetaKey.Selector])}
									layout={EntityLayout.Title}

									open={false}
									/>
							</dd>
						</div>
					{/if}

					{#if storageNode.balance != null}
						<div>
							<dt>Balance</dt>
							<dd>{storageNode.balance}</dd>
						</div>
					{/if}

					{#if storageNode.totalReward != null}
						<div>
							<dt>Total reward</dt>
							<dd>{storageNode.totalReward}</dd>
						</div>
					{/if}

				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
