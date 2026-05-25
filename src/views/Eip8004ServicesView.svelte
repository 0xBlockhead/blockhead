<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// State
	let {
		entityFieldReference,
		id,
		open = $bindable(true),
		collapsible = true,
		title = 'Agent Services',
		limit = 100,
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.Eip8004Service>
			id: string
			open?: boolean
			title?: string
			limit?: number
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import Eip8004ServiceView from '$/views/Eip8004ServiceView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	bind:open
	{collapsible}
	data-entity-field-name={entityFieldReference.fieldName}
	data-entity-field-parent={stringify(entityFieldReference.entityId)}
	data-entity-field-type={entityFieldReference.entityType}
	entityType={EntityType.Eip8004Service}
	{id}
	{title}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			On-chain agent identity registrations indexed by <a href="https://8004scan.io/developers">8004scan</a>.
		</p>
		<p>
			Each row is a registry token id on a network plus its registration metadata URI.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No agent services in this slice yet.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			{@const parent = useEntity(
				entityFieldReference.entityType,
				entityFieldReference.entityId,
				{
					[entityFieldReference.fieldName]: {
						$: [
							Source.Eip8004Scan_Rest,
						],
						limit,
					},
				},
			)}
			{@const services = derive(
				parent,
				(parent) => {
					const rows: Entity<typeof schema, EntityType.Eip8004Service>[] = (
						parent[entityFieldReference.fieldName] ?? []
					)
					return (
						rows.map((value) => ({
							value,
						}))
					)
				},
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				data-entity-field-name={entityFieldReference.fieldName}
				data-entity-field-parent={stringify(entityFieldReference.entityId)}
				data-entity-field-type={entityFieldReference.entityType}
				entityType={EntityType.Eip8004Service}
				getKey={(envelope) => stringify(envelope.value[EntityMetaKey.Id])}
				open={true}
				resource={services}
				{title}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No agent services in this slice yet.
					</p>
				{/snippet}

				{#snippet Item({ item })}
					<Eip8004ServiceView
						entityId={item.value[EntityMetaKey.Id]}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
