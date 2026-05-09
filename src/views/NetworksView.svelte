<script module lang="ts">
	// Types/constants
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import {
		ethereumChainId,
		l2BeatProjectChainIds,
	} from '$/sources/L2Beat/Rest/constants.ts'
	import { stringify } from 'devalue'
</script>


<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import { type EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	import { eq, not, useLiveQuery } from '@tanstack/svelte-db'
	import { SvelteSet } from 'svelte/reactivity'

	import { entityFieldCollections } from '$/routes/+layout.svelte'


	// Props
	let {
		title = 'Networks',

		open = $bindable(true),

		entityFieldReference,

		...EntitiesListProps
	}: WithRest<
		{
			title?: string
			open?: boolean
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.Network>
		},
		Omit<
			ComponentProps<typeof EntitiesList>,
			| 'entityType'
			| 'getKey'
			| 'getSortValue'
			| 'items'
			| 'query'
		>
	> = $props()

	const entityFieldReferenceIdKey = $derived(
		stringify(entityFieldReference.entityId)
	)

	const isGlobalNetworksReference = $derived(
		entityFieldReference.entityType === EntityType._Global
		&& entityFieldReference.fieldName === '$$networks'
	)

	const isChildNetworksReference = $derived(
		entityFieldReference.entityType === EntityType.Network
		&& entityFieldReference.fieldName === '$$childNetworks'
	)


	const globalNetworksFieldQuery = useLiveQuery(
		(queryBuilder) => {
			let query = (
				queryBuilder
					.from({ n: entityFieldCollections[EntityType._Global]['$$networks'] })
					.where(({ n }) => (
						eq(
							n[EntityMetaKey.ParentIdKey],
							(
								isGlobalNetworksReference ?
									entityFieldReferenceIdKey
								:
									''
							),
						)
					))
					.orderBy(({ n }) => (
						not(eq(
							n[EntityMetaKey.Value][EntityMetaKey.Id].chainId,
							ethereumChainId,
						))
					))
			)

			for (const { chainId } of l2BeatProjectChainIds) {
				query = query.orderBy(({ n }) => (
					not(eq(
						n[EntityMetaKey.Value][EntityMetaKey.Id].chainId,
						chainId,
					))
				))
			}

			return (
				query
					.orderBy(({ n }) => (
						n[EntityMetaKey.Value][EntityMetaKey.Id].chainId
					))
					.select(({ n }) => (
						{ value: n[EntityMetaKey.Value] }
					))
					.distinct()
			)
		},
		[
			() => entityFieldReference.entityType,
			() => entityFieldReference.fieldName,
			() => entityFieldReferenceIdKey,
		],
	)

	const childNetworksFieldQuery = useLiveQuery(
		(queryBuilder) => {
			let query = (
				queryBuilder
					.from({ n: entityFieldCollections[EntityType.Network]['$$childNetworks'] })
					.where(({ n }) => (
						eq(
							n[EntityMetaKey.ParentIdKey],
							(
								isChildNetworksReference ?
									entityFieldReferenceIdKey
								:
									''
							),
						)
					))
					.orderBy(({ n }) => (
						not(eq(
							n[EntityMetaKey.Value][EntityMetaKey.Id].chainId,
							ethereumChainId,
						))
					))
			)

			for (const { chainId } of l2BeatProjectChainIds) {
				query = query.orderBy(({ n }) => (
					not(eq(
						n[EntityMetaKey.Value][EntityMetaKey.Id].chainId,
						chainId,
					))
				))
			}

			return (
				query
					.orderBy(({ n }) => (
						n[EntityMetaKey.Value][EntityMetaKey.Id].chainId
					))
					.select(({ n }) => (
						{ value: n[EntityMetaKey.Value] }
					))
					.distinct()
			)
		},
		[
			() => entityFieldReference.entityType,
			() => entityFieldReference.fieldName,
			() => entityFieldReferenceIdKey,
		],
	)

	const networkItems = $derived(
		isGlobalNetworksReference ?
			globalNetworksFieldQuery.data?.map(({ value }) => value) ?? []
		: isChildNetworksReference ?
			childNetworksFieldQuery.data?.map(({ value }) => value) ?? []
		:
			[],
	)

	const networksSourceQuery = $derived(
		isGlobalNetworksReference ?
			globalNetworksFieldQuery
		: isChildNetworksReference ?
			childNetworksFieldQuery
		:
			{
				isLoading: false,
				isError: false,
				isReady: true,
				error: undefined,
				status: 'success',
			}
	)

	const networksQuery = $derived(
		{
			data: networkItems,
			isLoading: networksSourceQuery.isLoading,
			isError: networksSourceQuery.isError,
			isReady: networksSourceQuery.isReady,
			error: networksSourceQuery.error,
			status: networksSourceQuery.status,
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
	{...EntitiesListProps}
	query={networksQuery}
	items={networkItems}
	getKey={(row) => stringify(row[EntityMetaKey.Id])}
	placeholderKeys={new SvelteSet<string | number>()}
	UnorderedListProps={{ orientation: ListOrientation.Column }}
>
	{#snippet Empty()}
		<p data-text="muted">
			No networks to show yet. Check your connection and try again.
		</p>
	{/snippet}

	{#snippet Item({ item: row, isPlaceholder })}
		{#if isPlaceholder}
			<span data-placeholder>
				…
			</span>
		{:else if row}
			{@const chainId = row[EntityMetaKey.Id].chainId}
			<NetworkView
				entityId={{ chainId }}
				href={resolve('/(explore)/(networks)/network/[networkId]', {
					networkId: String(chainId),
				})}
				layout={EntityLayout.Summary}
				open={false}
			/>
		{/if}
	{/snippet}
</EntitiesList>
