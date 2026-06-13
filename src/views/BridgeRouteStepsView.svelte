<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	// State
	let {
		entityFieldReference,
		title = 'Steps',
		open = $bindable(true),
		collapsible = true,
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<
				typeof schema,
				EntityType.BridgeRouteStep
			>
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

	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
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
			{@const parent = subscribe(entityFieldReference.entityType,
				entityFieldReference.entityId,({ sources: [
						Source.Constants_Internal,
						Source.Lifi_Rest,
					], fields: { [entityFieldReference.fieldName]: {
						sources: [
							Source.Constants_Internal,
							Source.Lifi_Rest,
						],
					},
				} }),
			)}
			{@const steps = derive(
				parent,
				(parent) => {
					const bridgeRouteSteps: readonly Entity<typeof schema, EntityType.BridgeRouteStep>[] = (
						parent.fields[entityFieldReference.fieldName]?.values ?? []
					)
					return (
						bridgeRouteSteps.map((value) => ({
							value,
						}))
					)
				},
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.BridgeRouteStep}
				{title}
				open={true}
				getKey={(envelope) => stringify(envelope.value[EntityMetaKey.Id])}
				getSortValue={(envelope) => envelope.value[EntityMetaKey.Id].index}
				resource={steps}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No steps on this route.
					</p>
				{/snippet}

				{#snippet Item({ item: envelope })}
					<BridgeRouteStepView
						entityId={envelope.value[EntityMetaKey.Id]}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
