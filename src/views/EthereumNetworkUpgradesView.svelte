<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	import { useEntity } from '$/collections/$queries.svelte.ts'
	// State
	let {
		entityFieldReference,
		title = 'Upgrades',
		open = $bindable(true),
		id,
		href = '',
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.EthereumNetworkUpgrade>
			title?: string
			open?: boolean
			id: string
			href?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'collapsible'
			| 'CollapsibleProps'
		>
	> = $props()

	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import NetworkUpgradeView from '$/views/EthereumNetworkUpgradeView.svelte'
</script>


<EntitiesList
	entityType={EntityType.EthereumNetworkUpgrade}
	{title}
	bind:open
	{id}
	href={href}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Each network upgrade references a <strong>network execution upgrade</strong>; when both layers shipped together it also references a <strong>network consensus upgrade</strong>.
		</p>
		<p>
			Cards link to the paired execution and consensus fork views when present.
		</p>
	{/snippet}

	{#snippet body()}
		{#if open}
			{@const parent = useEntity(
				entityFieldReference.entityType,
				entityFieldReference.entityId,
				{
					$: [
						Source.Constants_Internal,
					],
					[entityFieldReference.fieldName]: {
						$: [
							Source.Constants_Internal,
						],
						$limit: 512,
					},
				},
			)}
			{@const upgrades = derive(
				parent,
				(parent) => {
					const upgrades: Entity<typeof schema, EntityType.EthereumNetworkUpgrade>[] = (
						parent[entityFieldReference.fieldName] ?? []
					)
					return upgrades
						.map((value) => ({
							value,
						}))
				},
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.EthereumNetworkUpgrade}
				id={`${id}-items`}
				href={href}
				getKey={(envelope) => stringify(envelope.value[EntityMetaKey.Id])}
				resource={upgrades}
				{title}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
				open={true}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No upgrades yet.
					</p>
				{/snippet}

				{#snippet Item({ item: envelope })}
					<NetworkUpgradeView
						entityId={envelope.value[EntityMetaKey.Id]}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
