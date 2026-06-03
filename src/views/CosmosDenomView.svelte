<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { useEntity } from '$/collections/$queries.svelte.ts'
	// State
	let {
		entityId,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.CosmosDenom>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	const cosmosDenom = useEntity(
		EntityType.CosmosDenom,
		entityId,
		{
			display: {},
			base: {},
			symbol: {},
		},
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
</script>


<EntityView
	entityType={EntityType.CosmosDenom}
	{entityId}
	title={entityId.denom}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		{entityId.denom.toString()}
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={cosmosDenom}
			placeholderText={`Loading Cosmos Denom...`}
		>
			{#snippet children(cosmosDenom)}
				<dl>
					{#if cosmosDenom.display != null}
						<div>
							<dt>Display</dt>
							<dd>{cosmosDenom.display}</dd>
						</div>
					{/if}

					{#if cosmosDenom.base != null}
						<div>
							<dt>Base</dt>
							<dd>{cosmosDenom.base}</dd>
						</div>
					{/if}

					{#if cosmosDenom.symbol != null}
						<div>
							<dt>Symbol</dt>
							<dd>{cosmosDenom.symbol}</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
