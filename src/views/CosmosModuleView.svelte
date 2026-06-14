<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	import { subscribe } from '$/routes/+layout.svelte'

	let {
		selector,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.CosmosModule>
			open?: boolean
		},
		Pick<ComponentProps<typeof EntityView>, 'layout' | 'showTypeAnnotation'>
	> = $props()

	const cosmosModule = subscribe(EntityType.CosmosModule, selector, ({ fields: { $authority: true } }))


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import CosmosAccountView from '$/views/CosmosAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.CosmosModule}
	entitySelector={selector}
	title={selector.moduleName}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{selector.moduleName.toString()}
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={cosmosModule}
			placeholderText={`Loading Cosmos Module...`}
		>
			{#snippet children(cosmosModule)}
				<dl>
					{#if cosmosModule.fields.$authority != null}
						<div>
							<dt>Authority</dt>
							<dd>
								<CosmosAccountView
									selector={cosmosModule.fields.$authority[EntityMetaKey.Selector]}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
