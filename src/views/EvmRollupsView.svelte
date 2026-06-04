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


	// Context
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	// State
	let {
		entityFieldReference,
		title = 'Rollups',
		open = $bindable(true),
		id,
		href = '',
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.EvmRollup>
			title?: string
			open?: boolean
			id: string
			href?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'CollapsibleProps'
		>
	> = $props()

	import { useEntity } from '$/collections/$queries.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EvmRollupView from '$/views/EvmRollupView.svelte'
</script>


<EntitiesList
	entityType={EntityType.EvmRollup}
	{title}
	bind:open
	{id}
	href={href}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			L2Beat rollup projects linked to this execution network when chain metadata matches.
		</p>
	{/snippet}

	{#snippet body()}
		{#if open}
			{@const network = useEntity(
				EntityType.EvmNetwork,
				entityFieldReference.entityId,
				{
					[entityFieldReference.fieldName]: {
						$: [
							Source.L2Beat_Rest,
						],
						$limit: 16,
					},
				},
			)}
			{@const rollups = derive(
				network,
				(network): Entity<typeof schema, EntityType.EvmRollup>[] => (
					network[entityFieldReference.fieldName]
					?? []
				),
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.EvmRollup}
				id={`${id}-items`}
				href={href}
				getKey={(rollup) => rollup[EntityMetaKey.Id].projectId}
				placeholderText="Loading rollups…"
				resource={rollups}
				{title}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
				open={true}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No rollups mapped here yet.
					</p>
				{/snippet}

				{#snippet Item({ item: rollup })}
					<EvmRollupView
						entityId={rollup[EntityMetaKey.Id]}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
