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
			entityId: EntityId<typeof schema, EntityType.HyperliquidValidator>
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

	const hyperliquidValidator = useEntity(
		EntityType.HyperliquidValidator,
		entityId,
		{
			stake: {},
			isJailed: {},
		},
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.HyperliquidValidator}
	{entityId}
	title={entityId.validator}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{entityId.validator.toString()}
	{/snippet}

	{#snippet Heading()}
		{entityId.validator.toString()}
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={hyperliquidValidator}
			placeholderText={`Loading Hyperliquid Validator...`}
		>
			{#snippet children(hyperliquidValidator)}
				<dl>
					{#if hyperliquidValidator.stake != null}
						<div>
							<dt>Stake</dt>
							<dd><NumberValue value={hyperliquidValidator.stake} /></dd>
						</div>
					{/if}

					{#if hyperliquidValidator.isJailed != null}
						<div>
							<dt>Is Jailed</dt>
							<dd>{hyperliquidValidator.isJailed ? 'Yes' : 'No'}</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
