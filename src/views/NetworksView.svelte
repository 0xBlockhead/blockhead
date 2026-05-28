<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify as stringifyId } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// State
	let {
		title = 'Networks',
		open = $bindable(true),
		entityFieldReference,
		networkIds,
		...EntitiesListProps
	}: WithRest<
		{
			title?: string
			open?: boolean
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.Network>
			networkIds?: readonly EntityId<typeof schema, EntityType.Network>[]
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'collapsible'
			| 'id'
			| 'href'
		>
	> = $props()


	// State
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const parent = useEntity(
		entityFieldReference.entityType,
		entityFieldReference.entityId,
		{
			$: [
				Source.Constants_Internal,
			],
			[entityFieldReference.fieldName]: {
				$limit: 4096,
			},
		},
	)

	const filteredNetworks = derive(
		parent,
		(parent) => {
			const keys = new SvelteSet<string>()
			const rows: Entity<typeof schema, EntityType.Network>[] = parent[entityFieldReference.fieldName] ?? []
			return (
				rows
					.filter((value) => (
						networkIds == null
						|| networkIds.some((networkId) => (
							stringifyId(networkId) === stringifyId(value[EntityMetaKey.Id])
						))
					))
					.flatMap((value) => {
						const key = stringifyId(value[EntityMetaKey.Id])
						if (keys.has(key)) return []
						keys.add(key)
						return [{ value }]
					})
			)
		},
	)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntitiesList
	entityType={EntityType.Network}
	{title}
	bind:open
	getKey={(line) => stringifyId(line.value[EntityMetaKey.Id])}
	getSortValue={(line) => stringifyId(line.value[EntityMetaKey.Id])}
	placeholderKeys={new SvelteSet<string | number>()}
	placeholderText="Loading networks…"
	resource={filteredNetworks}
	UnorderedListProps={{ orientation: ListOrientation.Column }}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Networks are concrete public or stack-level systems identified by stack-native references, using CAIP-2-style namespace/reference pairs where that is accurate.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No networks match this list yet.
		</p>
	{/snippet}

	{#snippet Item({ item: line })}
		<NetworkView
			entityId={line.value[EntityMetaKey.Id]}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
