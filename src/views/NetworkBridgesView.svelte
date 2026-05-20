<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { ListOrientation } from '$/components/ListOrientation.ts'
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
		title = 'Bridges',
		open = $bindable(true),
		collapsible = true,
		...entitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.NetworkBridge>
			title?: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntitiesList>,
			'entityType'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	import { SvelteSet } from 'svelte/reactivity'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import NetworkBridgeView from '$/views/NetworkBridgeView.svelte'
</script>


<EntitiesList
	entityType={EntityType.NetworkBridge}
	{title}
	bind:open
	{collapsible}
	{...entitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Registered routes between this chain and others: official or community bridge endpoints from network catalogs.
		</p>
		<p>
			Use them to pick an exit before moving funds; always verify destination support separately.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No bridges yet.
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
						Source.Chainlist_Rest,
						Source.EthereumLists_Rest,
					],
					[entityFieldReference.fieldName]: {
						$: [
							Source.Chainlist_Rest,
							Source.EthereumLists_Rest,
						],
					},
				},
			)}
			{@const bridges = derive(
				parent,
				(parent) => {
					const rows: Entity<typeof schema, EntityType.NetworkBridge>[] = (
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
				entityType={EntityType.NetworkBridge}
				{title}
				open={true}
				getKey={(envelope) => envelope.value[EntityMetaKey.Id].url}
				getSortValue={(envelope) => envelope.value[EntityMetaKey.Id].url}
				placeholderKeys={new SvelteSet()}
				resource={bridges}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No bridges yet.
					</p>
				{/snippet}

				{#snippet Item({ item: envelope })}
					{#if envelope}
						<NetworkBridgeView
							entityId={envelope.value[EntityMetaKey.Id]}
							href={envelope.value[EntityMetaKey.Id].url}
							layout={EntityLayout.Summary}
							open={false}
						/>
					{/if}
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
