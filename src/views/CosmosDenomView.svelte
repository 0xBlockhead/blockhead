<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { useEntity } from '$/collections/$collections.ts'
	import { entityCollectionsContext } from '$/collections/entityCollections.ts'
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

	const cosmosDenom = useEntity(entityCollectionsContext, EntityType.CosmosDenom,
		entityId,
		({ fields: { display: true, base: true, symbol: true } }),
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
					{#if cosmosDenom.fields.display != null}
						<div>
							<dt>Display</dt>
							<dd>{cosmosDenom.fields.display}</dd>
						</div>
					{/if}

					{#if cosmosDenom.fields.base != null}
						<div>
							<dt>Base</dt>
							<dd>{cosmosDenom.fields.base}</dd>
						</div>
					{/if}

					{#if cosmosDenom.fields.symbol != null}
						<div>
							<dt>Symbol</dt>
							<dd>{cosmosDenom.fields.symbol}</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
