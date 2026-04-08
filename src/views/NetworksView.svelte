<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Sources.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// Functions
	const networkListItem = (network: unknown) => {
		if (typeof network !== 'object' || network === null) return undefined
		if (!(EntityMetaKey.Id in network)) return undefined
		const id = Reflect.get(network, EntityMetaKey.Id)
		const chainId = (
			typeof id === 'object'
			&& id !== null
			&& 'chainId' in id
		) ?
			Reflect.get(id, 'chainId')
		:
			undefined
		const name = (
			'name' in network
			&& typeof Reflect.get(network, 'name') === 'string'
			&& String(Reflect.get(network, 'name')).length > 0
		) ?
			String(Reflect.get(network, 'name'))
		:
			undefined
		return typeof chainId === 'number' ? { chainId, name } : undefined
	}


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { SvelteSet } from 'svelte/reactivity'

	import { entityFieldCollections } from '$/collections/$collections.ts'


	// Props
	let {
		title = 'Networks',

		open = $bindable(true),

		...EntitiesListProps
	}: WithRest<
		{
			title?: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntitiesList>,
			'entityType'
		>
	> = $props()


	const networksQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ $$networks: entityFieldCollections[EntityType._Global]['$$networks'] })
				.where(({ $$networks }) => (
					eq(
						$$networks[EntityMetaKey.ParentIdKey],
						stringify({}),
					)
				))
				.where(({ $$networks }) => (
					eq(
						$$networks[EntityMetaKey.Source],
						Source.ChainList,
					)
				))
				.select(({ $$networks }) => (
					{
						network: $$networks[EntityMetaKey.Value],
					}
				))
		),
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
	query={networksQuery}
	items={new SvelteSet(networksQuery.data ?? [])}
	getKey={(row) => stringify(row.network[EntityMetaKey.Id]) ?? ''}
	getSortValue={(row) => (
		networkListItem(row.network)?.chainId ?? 0
	)}
	placeholderKeys={new SvelteSet()}
	unorderedListProps={{ orientation: ListOrientation.Column }}
	{...EntitiesListProps}
>
	{#snippet Empty()}
			<p data-text="muted">
				No networks in collections (load global $$networks from ChainList).
			</p>
	{/snippet}

	{#snippet Item({ item: row, isPlaceholder })}
		{#if isPlaceholder}
			<span data-placeholder>
				…
			</span>
		{:else if row}
			{@const item = networkListItem(row.network)}
			{#if item != null}
				<NetworkView
					entityId={{ chainId: item.chainId }}
					href={resolve('/(explore)/(networks)/network/[networkId]', {
						networkId: String(item.chainId),
					})}
					layout={EntityLayout.Summary}
					open={false}
				/>
			{:else}
				<span data-text="muted">
					Network
				</span>
			{/if}
		{/if}
	{/snippet}
</EntitiesList>
