<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'


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


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const cosmosTransaction = useEntity(
		EntityType.CosmosTransaction,
		entityId,
		{
			code: {},
			gasWanted: {},
			gasUsed: {},
			memo: {},
		},
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
					{#if cosmosTransaction.code != null}
						<div>
							<dt>Code</dt>
							<dd><NumberValue value={cosmosTransaction.code} /></dd>
						</div>
					{/if}

					{#if cosmosTransaction.gasWanted != null}
						<div>
							<dt>Gas Wanted</dt>
							<dd><NumberValue value={cosmosTransaction.gasWanted} /></dd>
						</div>
					{/if}

					{#if cosmosTransaction.gasUsed != null}
						<div>
							<dt>Gas Used</dt>
							<dd><NumberValue value={cosmosTransaction.gasUsed} /></dd>
						</div>
					{/if}

					{#if cosmosTransaction.memo != null}
						<div>
							<dt>Memo</dt>
							<dd>{cosmosTransaction.memo}</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
