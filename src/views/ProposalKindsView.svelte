<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntitiesListLayout } from '$/components/EntitiesListLayout.ts'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import {
		proposalCategoryById,
		proposalRealmById,
	} from '$/constants/Proposal.ts'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'

	import { entityFieldCollections } from '$/routes/+layout.svelte'


	// Props
	let {
		title = 'Proposal Kinds',

		open = $bindable(true),
		entityFieldReference,

		...EntitiesListProps
	}: WithRest<
		{
			title?: string
			open?: boolean
			entityFieldReference: EntityFieldReference<typeof schema, typeof EntityType.ProposalKind>
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


	// Functions
	const proposalKindKey = (row: Entity<typeof schema, EntityType.ProposalKind>) => (
		stringify(row[EntityMetaKey.Id])
	)


	const proposalKindsQuery = useLiveQuery(
		(queryBuilder) => {
			const parentIdKey = stringify(entityFieldReference.entityId)
			return (
				queryBuilder
					.from({
						$$proposalKinds: entityFieldCollections[entityFieldReference.entityType][entityFieldReference.fieldName]!,
					})
					.where(({ $$proposalKinds }) => (
						eq(
							$$proposalKinds[EntityMetaKey.ParentIdKey],
							parentIdKey,
						)
					))
					.select(({ $$proposalKinds }) => (
						{ value: $$proposalKinds[EntityMetaKey.Value] }
					))
					.distinct()
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
	import ProposalsView from '$/views/ProposalsView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.ProposalKind}
	{title}
	bind:open
	items={proposalKindsQuery.data?.map(({ value }) => value) ?? []}
	getKey={proposalKindKey}
	getSortValue={proposalKindKey}
	layout={EntitiesListLayout.Carousel}
	panelStyle="--carousel-basis: min(40ch, 88cqi); gap: 0.5em"
	placeholderKeys={new SvelteSet<string | number>()}
	query={{
		data: proposalKindsQuery.data?.map(({ value }) => value) ?? [],
		isLoading: proposalKindsQuery.isLoading,
		isError: proposalKindsQuery.isError,
		isReady: proposalKindsQuery.isReady,
		error: proposalKindsQuery.error,
		status: proposalKindsQuery.status,
	}}
	UnorderedListProps={{ orientation: ListOrientation.Column }}
>
	{#snippet Empty()}
		<p data-text="muted">
			No proposal kinds to show yet.
		</p>
	{/snippet}

	{#snippet Item({ item: row, isPlaceholder })}
		{#if isPlaceholder}
			<span data-placeholder>
				…
			</span>
		{:else if row}
			{@const kindId = row[EntityMetaKey.Id]}
			<ProposalsView
				collapsible={false}
				layout={EntitiesListLayout.Default}
				entityFieldReference={{
					entityType: EntityType.ProposalKind,
					entityId: {
						realm: kindId.realm,
						category: kindId.category,
					},
					fieldName: '$$proposals',
				}}
				href={resolve(
					`/proposals/${proposalRealmById[kindId.realm].slug}/${proposalCategoryById[kindId.category].slug}`,
				)}
				id={`proposal-kind:${kindId.realm}:${kindId.category}:proposals`}
				open
				title={proposalCategoryById[kindId.category].labelPlural}
			/>
		{/if}
	{/snippet}
</EntitiesList>

