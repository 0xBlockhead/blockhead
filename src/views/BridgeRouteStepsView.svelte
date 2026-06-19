<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	// State
	let {
		selection,
		title = 'Steps',
		open = $bindable(true),
		collapsible = true,
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.BridgeRouteStep>
			title?: string
			open?: boolean
			collapsible?: boolean
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'id'
			| 'CollapsibleProps'
		>
	> = $props()


	


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import BridgeRouteStepView from '$/views/BridgeRouteStepView.svelte'
</script>


<EntitiesList
	entityType={EntityType.BridgeRouteStep}
	{title}
	bind:open
	{collapsible}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Ordered execution steps for a live LI.FI quote. Mechanics on each step mirror the bridge catalog when a tool key is present.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No steps on this route.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			<ResourceBoundary resource={selection({
					sources: [
						Source.Lifi_Rest,
					],
				})} placeholderText="Loading steps…">
				{#snippet children(steps)}
					<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.BridgeRouteStep}
				{title}
				open={true}
				items={steps.entities}
				getKey={(step) => stringify(step.entitySelector)}
				getSortValue={(step) => step.entitySelector.index}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No steps on this route.
					</p>
				{/snippet}

				{#snippet Item({ item })}
					<BridgeRouteStepView
						selection={select(EntityType.BridgeRouteStep, item.entitySelector)}
						layout={EntityLayout.Summary}
						open={false}

					/>
				{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
