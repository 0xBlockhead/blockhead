<script lang="ts">
	// Types/constants
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { ComponentProps } from 'svelte'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// State
	let {
		entityFieldReference,
		open = $bindable(true),
		collapsible = true,
		title = 'Revert data',
		id,
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.EvmError>
			open?: boolean
			title?: string
			id: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EvmErrorView from '$/views/EvmErrorView.svelte'
</script>


<EntitiesList
	entityType={EntityType.EvmError}

	{id}
	{title}
	bind:open
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Revert data uses four-byte selectors (like calldata) but labels custom errors and standard revert shapes instead of function entrypoints.
		</p>
		<p>
			Catalogs map those prefixes to signatures so tooling can decode the trailing words similarly to call arguments.
		</p>
		<p>
			This evmErrors is a subset of error selectors for the parent contract or address under inspection.
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
							Source.Openchain_Rest,
						],
					},
				},
			)}
			{@const errors = derive(
				parent,
				(parent) => {
					const evmErrors: Entity<typeof schema, EntityType.EvmError>[] = (
						parent[entityFieldReference.fieldName] ?? []
					)
					return (
						evmErrors.map((evmEntity) => ({
							evmEntity,
						}))
					)
				},
			)}
			<div data-column="gap-3">
				<EntitiesList
					collapsible={false}
					showSummary={false}
					entityType={EntityType.EvmError}
					id={`${id}-items`}
					{title}
					open={true}
					getKey={(envelope) => envelope.evmEntity[EntityMetaKey.Id].hex}
					getSortValue={(envelope) => envelope.evmEntity[EntityMetaKey.Id].hex}
					placeholderText="Loading revert data…"
					resource={errors}
					UnorderedListProps={{ orientation: ListOrientation.Column }}
				>
					{#snippet Empty()}
						<p data-text="muted">
							No revert selectors yet.
						</p>
					{/snippet}

					{#snippet Item({ item })}
						<EvmErrorView
							entityId={item.evmEntity[EntityMetaKey.Id]}
							layout={EntityLayout.Summary}
							open={false}
							collapsible={false}
							showTypeAnnotation={false}
						/>
					{/snippet}
				</EntitiesList>
			</div>
		{/if}
	{/snippet}
</EntitiesList>
