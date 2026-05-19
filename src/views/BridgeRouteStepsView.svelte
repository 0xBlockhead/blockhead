<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'

	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Props
	let {
		entityFieldReference,
		href,
		title = 'Steps',
		open = $bindable(true),
		...entitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<
				typeof schema,
				EntityType.BridgeRouteStep
			>
			href: string
			title?: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntitiesList>,
			'entityType'
		>
	> = $props()


	// State
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'

	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	const parent = useEntity(
		entityFieldReference.entityType,
		entityFieldReference.entityId,
		(
			open ?
				{
					$: [
						Source.Constants_Internal,
						Source.Lifi_Rest,
					],
					[entityFieldReference.fieldName]: {
						$: [
							Source.Constants_Internal,
							Source.Lifi_Rest,
						],
					},
				}
			:
				{}
		),
	)

	const steps = derive(
		parent,
		(parent) => {
			const rows: Entity<typeof schema, EntityType.BridgeRouteStep>[] = (
				parent[entityFieldReference.fieldName] ?? []
			)
			return (
				rows
					.toSorted((a, b) => (
						a[EntityMetaKey.Id].index - b[EntityMetaKey.Id].index
					))
					.map((value) => ({
						value,
					}))
			)
		},
	)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import BridgeRouteStepView from '$/views/BridgeRouteStepView.svelte'
</script>


<EntitiesList
	entityType={EntityType.BridgeRouteStep}
	{title}
	bind:open
	getKey={(envelope) => stringify(envelope.value[EntityMetaKey.Id])}
	getSortValue={(envelope) => String(envelope.value[EntityMetaKey.Id].index)}
	placeholderKeys={new SvelteSet()}
	resource={steps}
	UnorderedListProps={{ orientation: ListOrientation.Column }}
	{...entitiesListProps}
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

	{#snippet Item({ item: envelope })}
		{#if envelope}
			<BridgeRouteStepView
				entityId={envelope.value[EntityMetaKey.Id]}
				{href}
				layout={EntityLayout.Summary}
				open={false}
			/>
		{/if}
	{/snippet}
</EntitiesList>
