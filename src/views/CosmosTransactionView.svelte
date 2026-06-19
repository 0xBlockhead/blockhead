<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	// State
	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.CosmosTransaction>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.CosmosTransaction}
	entitySelector={selection.entitySelector}
	title={selection.entitySelector.txHash}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		<TruncatedValue
			value={selection.entitySelector.txHash}
			format={TruncatedValueFormat.Abbr}
		/>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={selection( { fields: { code: true, gasWanted: true, gasUsed: true, memo: true } })}
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
