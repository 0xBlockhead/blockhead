<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { proxy } from '$/routes/+layout.svelte'
	// State
	let {
		selector,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.NearExecutionOutcome>
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
	entityType={EntityType.NearExecutionOutcome}
	entitySelector={selector}
	title={selector.outcomeId}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		<TruncatedValue
			value={selector.outcomeId}
			format={TruncatedValueFormat.Abbr}
		/>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={proxy(EntityType.NearExecutionOutcome, selector, ({ fields: { status: true, gasBurnt: true } }))}
			placeholderText={`Loading NEAR Execution Outcome...`}
		>
			{#snippet children(nearExecutionOutcome)}
				<dl>
					{#if nearExecutionOutcome.fields.status != null}
						<div>
							<dt>Status</dt>
							<dd>{nearExecutionOutcome.fields.status}</dd>
						</div>
					{/if}

					{#if nearExecutionOutcome.fields.gasBurnt != null}
						<div>
							<dt>Gas Burnt</dt>
							<dd><NumberValue value={nearExecutionOutcome.fields.gasBurnt} /></dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
