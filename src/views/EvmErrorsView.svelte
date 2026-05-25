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
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// State
	let {
		entityFieldReference,
		open = $bindable(true),
		collapsible = true,
		title = 'Error selectors',
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
			Global registry of four-byte error selectors for custom and standard revert shapes—same width as calldata selectors but used when decoding failures.
		</p>
		<p>
			They pair with ABI tail words rather than log topics.
		</p>
		<p>
			Rows filter the shared directory by the current field predicate.
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
							Source.Local_Internal,
						],
					},
				},
			)}
			{@const errors = derive(
				parent,
				(parent): Entity<typeof schema, EntityType.EvmError>[] => (
					parent[entityFieldReference.fieldName]
					?? []
				),
			)}
			<div data-column="gap-3">
				<EntitiesList
					collapsible={false}
					showSummary={false}
					entityType={EntityType.EvmError}
					id={`${id}-items`}
					{title}
					open={true}
					getKey={(row) => row[EntityMetaKey.Id].hex}
					getSortValue={(row) => row[EntityMetaKey.Id].hex}
					placeholderText="Loading revert/error selectors…"
					resource={errors}
					UnorderedListProps={{ orientation: ListOrientation.Column }}
				>
					{#snippet Empty()}
						<p data-text="muted">
							No error selectors yet.
						</p>
					{/snippet}

					{#snippet Item({ item })}
						<EvmErrorView
							entityId={item[EntityMetaKey.Id]}
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
