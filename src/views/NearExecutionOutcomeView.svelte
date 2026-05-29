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
			entityId: EntityId<typeof schema, EntityType.NearExecutionOutcome>
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

	const nearExecutionOutcome = useEntity(
		EntityType.NearExecutionOutcome,
		entityId,
		{
			status: {},
			gasBurnt: {},
		},
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.NearExecutionOutcome}
	{entityId}
	title={entityId.outcomeId}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		<TruncatedValue
			value={entityId.outcomeId}
			format={TruncatedValueFormat.Abbr}
		/>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={nearExecutionOutcome}
			placeholderText={`Loading NEAR Execution Outcome...`}
		>
			{#snippet children(nearExecutionOutcome)}
				<dl>
					{#if nearExecutionOutcome.status != null}
						<div>
							<dt>Status</dt>
							<dd>{nearExecutionOutcome.status}</dd>
						</div>
					{/if}

					{#if nearExecutionOutcome.gasBurnt != null}
						<div>
							<dt>Gas Burnt</dt>
							<dd><NumberValue value={nearExecutionOutcome.gasBurnt} /></dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
