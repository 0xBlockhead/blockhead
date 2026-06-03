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
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	// State
	let {
		entityFieldReference,
		open = $bindable(true),
		title = 'User operations',
		id,
		href = '',
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.EvmUserOperation>
			open?: boolean
			title?: string
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
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import EvmUserOperationView from '$/views/EvmUserOperationView.svelte'
</script>


<EntitiesList
	entityType={EntityType.EvmUserOperation}
	{id}
	{title}
	bind:open
	href={href}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			ERC-4337 user operations are intent objects bundlers include in transactions to the entry point.
		</p>
	{/snippet}

	{#snippet body()}
		{#if open}
			{@const parentEntityType = entityFieldReference.entityType}
			{@const parent = useEntity(
				parentEntityType,
				entityFieldReference.entityId,
				{
					[entityFieldReference.fieldName]: {
						$: [
							Source.Blockscout_Rest,
						],
						$limit: 16,
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
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.EvmUserOperation}
				id={`${id}-items`}
				href={href}
				getKey={(userOperation) => stringify(userOperation[EntityMetaKey.Id])}
				placeholderText="Loading user operations…"
				resource={userOperations}
				{title}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
				open={true}
			>
				{#snippet Empty()}
					<p data-text="muted">No user operations.</p>
				{/snippet}

				{#snippet Item({ item: userOperation })}
					<EvmUserOperationView
						entityId={userOperation[EntityMetaKey.Id]}
						layout={EntityLayout.Summary}
						open={false}
					>
						{#snippet HeadingSnippet()}
							<TruncatedValue
								format={TruncatedValueFormat.Visual}
								value={userOperation[EntityMetaKey.Id].hash}
							/>
						{/snippet}
					</EvmUserOperationView>
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
