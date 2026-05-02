<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import { type EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
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
			entityFieldReference: EntityFieldReference<typeof schema, typeof EntityType.Network>
		},
		Omit<
			ComponentProps<typeof EntitiesList>,
			'entityType'
		>
	> = $props()


	const networksQuery = useLiveQuery(
		(queryBuilder) => {
			const pk = stringify(entityFieldReference.entityId)
			const { entityType, fieldName } = entityFieldReference
			if (entityType === EntityType._Global && fieldName === '$$networks') {
				return (
					queryBuilder
						.from({ n: entityFieldCollections[EntityType._Global]['$$networks']! })
						.where(({ n }) => (
							eq(
								n[EntityMetaKey.ParentIdKey],
								pk,
							)
						))
						.where(({ n }) => (
							eq(
								n[EntityMetaKey.Source],
								Source.Chainlist_Rest,
							)
						))
						.select(({ n }) => (
							{ ...n[EntityMetaKey.Value] }
						))
				)
			}
			if (entityType === EntityType.Network && fieldName === '$$childNetworks') {
				return (
					queryBuilder
						.from({ n: entityFieldCollections[EntityType.Network]['$$childNetworks']! })
						.where(({ n }) => (
							eq(
								n[EntityMetaKey.ParentIdKey],
								pk,
							)
						))
						.where(({ n }) => (
							eq(
								n[EntityMetaKey.Source],
								Source.Chainlist_Rest,
							)
						))
						.select(({ n }) => (
							{ ...n[EntityMetaKey.Value] }
						))
				)
			}
			return (
				queryBuilder
					.from({ n: entityFieldCollections[EntityType._Global]['$$networks']! })
					.where(() => (false as unknown as boolean))
			)
		},
		[
			() => entityFieldReference.entityType,
			() => entityFieldReference.fieldName,
			() => stringify(entityFieldReference.entityId),
		],
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
	getKey={(row) => stringify(row[EntityMetaKey.Id])}
	getSortValue={(row) => (
		row[EntityMetaKey.Id].chainId
	)}
	placeholderKeys={new SvelteSet()}
	UnorderedListProps={{ orientation: ListOrientation.Column }}
	{...EntitiesListProps}
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
