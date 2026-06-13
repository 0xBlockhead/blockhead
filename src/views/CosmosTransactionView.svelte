<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	// State
	let {
		entityId,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.CosmosTransaction>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	const cosmosTransaction = subscribe(EntityType.CosmosTransaction,
		entityId,
		({ fields: { code: true, gasWanted: true, gasUsed: true, memo: true } }),
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.CosmosTransaction}
	{entityId}
	title={entityId.txHash}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		<TruncatedValue
			value={entityId.txHash}
			format={TruncatedValueFormat.Abbr}
		/>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={cosmosTransaction}
			placeholderText={`Loading Cosmos Transaction...`}
		>
			{#snippet children(cosmosTransaction)}
				<dl>
					{#if cosmosTransaction.fields.code != null}
						<div>
							<dt>Code</dt>
							<dd><NumberValue value={cosmosTransaction.fields.code} /></dd>
						</div>
					{/if}

					{#if cosmosTransaction.fields.gasWanted != null}
						<div>
							<dt>Gas Wanted</dt>
							<dd><NumberValue value={cosmosTransaction.fields.gasWanted} /></dd>
						</div>
					{/if}

					{#if cosmosTransaction.fields.gasUsed != null}
						<div>
							<dt>Gas Used</dt>
							<dd><NumberValue value={cosmosTransaction.fields.gasUsed} /></dd>
						</div>
					{/if}

					{#if cosmosTransaction.fields.memo != null}
						<div>
							<dt>Memo</dt>
							<dd>{cosmosTransaction.fields.memo}</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
