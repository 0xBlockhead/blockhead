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
			entityId: EntityId<typeof schema, EntityType.CosmosModule>
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

	const cosmosModule = useEntity(
		EntityType.CosmosModule,
		entityId,
		{
			authority: {},
		},
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
</script>


<EntityView
	entityType={EntityType.CosmosModule}
	{entityId}
	title={entityId.moduleName}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		{entityId.moduleName.toString()}
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={cosmosModule}
			placeholderText={`Loading Cosmos Module...`}
		>
			{#snippet children(cosmosModule)}
				<dl>
					{#if cosmosModule.authority != null}
						<div>
							<dt>Authority</dt>
							<dd>{cosmosModule.authority}</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
