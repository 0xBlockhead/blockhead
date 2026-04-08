<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import {
		type EntityId,
		schema,
	} from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Sources.ts'


	// Context
	import { resolve } from '$app/paths'


	// Functions
	const networkForkListItem = (fork: unknown) => {
		if (typeof fork !== 'object' || fork === null) return undefined
		if (!(EntityMetaKey.Id in fork)) return undefined
		const id = Reflect.get(fork, EntityMetaKey.Id)
		if (typeof id !== 'object' || id === null) return undefined
		if (!('$network' in id) || !('forkId' in id)) return undefined
		const nw = Reflect.get(id, '$network')
		if (typeof nw !== 'object' || nw === null || !('chainId' in nw)) return undefined
		const chainId = Reflect.get(nw, 'chainId')
		const forkId = Reflect.get(id, 'forkId')
		const name = (
			'name' in fork
			&& typeof Reflect.get(fork, 'name') === 'string'
			&& String(Reflect.get(fork, 'name')).length > 0
		) ?
			String(Reflect.get(fork, 'name'))
		:
			undefined
		const slug = (
			'slug' in fork
			&& typeof Reflect.get(fork, 'slug') === 'string'
			&& String(Reflect.get(fork, 'slug')).length > 0
		) ?
			String(Reflect.get(fork, 'slug'))
		:
			undefined
		return (
			typeof chainId === 'number'
			&& typeof forkId === 'string'
			&& forkId.length ?
				{ chainId, forkId, name, slug }
			:
				undefined
		)
	}


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'

	import { entityFieldCollections } from '$/collections/$collections.ts'


	// Props
	let {
		entityId,

		title = 'Forks',

		open = $bindable(true),

		...entitiesListProps
	}: WithRest<
		{
			entityId?: EntityId<typeof schema, EntityType.Network>
			title?: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntitiesList>,
			'entityType'
		>
	> = $props()


	const forksScopeKey = $derived(
		entityId == null ?
			'global'
		:
			stringify(entityId),
	)

	const inactiveNetworkForkParentKey = stringify({ $inactiveNetworkForkParent: true })

	const globalForksQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ $$networkForks: entityFieldCollections[EntityType._Global]['$$networkForks'] })
				.where(({ $$networkForks }) => (
					eq(
						$$networkForks[EntityMetaKey.ParentIdKey],
						stringify({}),
					)
				))
				.where(({ $$networkForks }) => (
					eq(
						$$networkForks[EntityMetaKey.Source],
						Source._Constants,
					)
				))
				.select(({ $$networkForks }) => ({ fork: $$networkForks[EntityMetaKey.Value] }))
		),
		[() => forksScopeKey],
	)

	const networkForksQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ $$forks: entityFieldCollections[EntityType.Network]['$$forks'] })
				.where(({ $$forks }) => (
					eq(
						$$forks[EntityMetaKey.ParentIdKey],
						entityId == null ? inactiveNetworkForkParentKey : stringify(entityId),
					)
				))
				.where(({ $$forks }) => (
					eq(
						$$forks[EntityMetaKey.Source],
						Source._Constants,
					)
				))
				.select(({ $$forks }) => ({ fork: $$forks[EntityMetaKey.Value] }))
		),
		[() => forksScopeKey],
	)

	const forksQuery = $derived(
		entityId == null ? globalForksQuery : networkForksQuery,
	)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import NetworkForkView from '$/views/NetworkForkView.svelte'
</script>


<EntitiesList
	entityType={EntityType.NetworkFork}
	{title}
	bind:open
	query={forksQuery}
	items={new SvelteSet(forksQuery.data ?? [])}
	getKey={(row) => stringify(row.fork[EntityMetaKey.Id]) ?? ''}
	getSortValue={(row) => stringify(row.fork[EntityMetaKey.Id]) ?? ''}
	placeholderKeys={new SvelteSet()}
	unorderedListProps={{ orientation: ListOrientation.Column }}
	{...entitiesListProps}
>
	{#snippet Empty()}
		<p data-text="muted">
			No forks in collections for this scope.
		</p>
	{/snippet}

	{#snippet Item({ item: row, isPlaceholder })}
		{#if isPlaceholder}
			<span data-placeholder>
				…
			</span>
		{:else if row}
			{@const item = networkForkListItem(row.fork)}
			{#if item != null}
				<NetworkForkView
					entityId={{
						$network: { chainId: item.chainId },
						forkId: item.forkId,
					}}
					href={resolve(
						'/(explore)/(networks)/network/[networkId]/(network)/(forks)/fork/[forkSlug]',
						{
							networkId: String(item.chainId),
							forkSlug: item.forkId,
						},
					)}
					layout={EntityLayout.Summary}
					open={false}
				/>
			{:else}
				<span data-text="muted">
					{String(row.fork)}
				</span>
			{/if}
		{/if}
	{/snippet}
</EntitiesList>
