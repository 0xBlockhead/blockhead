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
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		entityFieldReference,

		open = $bindable(true),

		collapsible = true,

		title = 'User operations',

		id,

		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.EvmUserOperation>

			open?: boolean

			collapsible?: boolean

			title?: string

			id: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
		>
	> = $props()


	// State
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	import { useEntity } from '$/collections/$queries.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import UnorderedList from '$/components/UnorderedList.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import EvmUserOperationView from '$/views/EvmUserOperationView.svelte'
</script>


<EntitiesList
	entityType={EntityType.EvmUserOperation}
	{id}
	{title}
	bind:open
	{...EntitiesListProps}
>
	{#snippet body({ open: _bodyOpen })}
		{#if open}
			{@const parentEntityType = entityFieldReference.entityType}
			{@const parent = useEntity(
				parentEntityType,
				entityFieldReference.entityId,
				{
					...(parentEntityType === EntityType.Network && {
						blockHeight: {
							$: [
								Source.Voltaire_JsonRpc,
							],
						},
					}),
					[entityFieldReference.fieldName]: {
						$: [
							Source.Blockscout_Rest,
						],
						...(parentEntityType === EntityType.Network && {
							$limit: 16,
						}),
					},
				},
			)}
			{@const userOperations = derive(
				parent,
				(parent): Entity<typeof schema, EntityType.EvmUserOperation>[] => (
					parent[entityFieldReference.fieldName]
					?? []
				),
			)}
			<div data-column="gap-3">
				<ResourceBoundary
					placeholderText="Loading user operations…"
					resource={userOperations}
				>
					{#snippet children(userOperations)}
						<UnorderedList
							getKey={(row) => stringify(row[EntityMetaKey.Id])}
							items={userOperations}
							orientation={ListOrientation.Column}
							placeholderRanges={[]}
						>
							{#snippet Empty()}
								<p data-text="muted">No user operations.</p>
							{/snippet}

							{#snippet Item({ item })}
								<EvmUserOperationView
									entityId={item[EntityMetaKey.Id]}
									layout={EntityLayout.Summary}
									open={false}
								>
									{#snippet HeadingSnippet()}
										<TruncatedValue
											format={TruncatedValueFormat.Visual}
											value={item[EntityMetaKey.Id].hash}
										/>
									{/snippet}
								</EvmUserOperationView>
							{/snippet}
						</UnorderedList>
					{/snippet}
				</ResourceBoundary>
			</div>
		{/if}
	{/snippet}
</EntitiesList>
