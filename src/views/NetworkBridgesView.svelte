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

	const parent = useEntity(
		entityFieldReference.entityType,
		entityFieldReference.entityId,
		{
			$: [
				Source.Constants_Internal,
				...(
					open ?
						[
							Source.Chainlist_Rest,
							Source.EthereumLists_Rest,
						]
					:
						[]
				),
			],
			...(open && {
				[entityFieldReference.fieldName]: {
					$: [
						Source.Chainlist_Rest,
						Source.EthereumLists_Rest,
					],
				},
			}),
		},
	)

	const bridges = derive(
		parent,
		(parent) => {
			const rows: Entity<typeof schema, EntityType.NetworkBridge>[] = (
				parent[entityFieldReference.fieldName] ?? []
			)
				.toSorted((a, b) => (
					a[EntityMetaKey.Id].url.localeCompare(b[EntityMetaKey.Id].url)
				))
			return (
				rows.map((value) => ({
					value,
				}))
			)
		},
	)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import NetworkBridgeView from '$/views/NetworkBridgeView.svelte'
</script>


<EntitiesList
	entityType={EntityType.NetworkBridge}
	{title}
	bind:open
	getKey={(envelope) => envelope.value[EntityMetaKey.Id].url}
	getSortValue={(envelope) => envelope.value[EntityMetaKey.Id].url}
	placeholderKeys={new SvelteSet()}
	resource={bridges}
	UnorderedListProps={{ orientation: ListOrientation.Column }}
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
