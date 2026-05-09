<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntitiesListLayout } from '$/components/EntitiesListLayout.ts'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import {
		proposalCategoryById,
		proposalRealmById,
		proposalWireParts,
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
		title = 'Proposals',

		open = $bindable(true),
		entityFieldReference,

		...EntitiesListProps
	}: WithRest<
		{
			title?: string
			open?: boolean
			entityFieldReference: EntityFieldReference<typeof schema, typeof EntityType.Proposal>
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
	const proposalFieldCollection = (reference: EntityFieldReference<typeof schema, EntityType.Proposal>) => (
		reference.entityType === EntityType._Global ?
			entityFieldCollections[EntityType._Global][reference.fieldName]
		: reference.entityType === EntityType.ProposalKind ?
			entityFieldCollections[EntityType.ProposalKind].$$proposals
		: reference.entityType === EntityType.ProposalRealm ?
			entityFieldCollections[EntityType.ProposalRealm].$$proposals
		:
			entityFieldCollections[EntityType.NetworkFork].$$proposals
	)

	const proposalKey = (row: Entity<typeof schema, EntityType.Proposal>) => (
		stringify(row[EntityMetaKey.Id])
	)

	const proposalSortValue = (row: Entity<typeof schema, EntityType.Proposal>) => (
		proposalWireParts(
			row[EntityMetaKey.Id],
		)?.number ?? Number.POSITIVE_INFINITY
	)


	const proposalsQuery = useLiveQuery(
		(queryBuilder) => {
			const parentIdKey = stringify(entityFieldReference.entityId)
			return (
				queryBuilder
					.from({
						$$proposals: proposalFieldCollection(entityFieldReference)!,
					})
					.where(({ $$proposals }) => (
						eq(
							$$proposals[EntityMetaKey.ParentIdKey],
							parentIdKey,
						)
					))
					.select(({ $$proposals }) => (
						{ value: $$proposals[EntityMetaKey.Value] }
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
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ProposalView from '$/views/ProposalView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.Proposal}
	{title}
	bind:open
	items={proposalsQuery.data?.map(({ value }) => value) ?? []}
	getKey={proposalKey}
	getSortValue={proposalSortValue}
	layout={EntitiesListLayout.Carousel}
	panelStyle="--carousel-basis: min(40ch, 88cqi); gap: 0.5em"
	placeholderKeys={new SvelteSet<string | number>()}
	query={{
		data: proposalsQuery.data?.map(({ value }) => value) ?? [],
		isLoading: proposalsQuery.isLoading,
		isError: proposalsQuery.isError,
		isReady: proposalsQuery.isReady,
		error: proposalsQuery.error,
		status: proposalsQuery.status,
	}}
	UnorderedListProps={{ orientation: ListOrientation.Column }}
>
	{#snippet Empty()}
		<p data-text="muted">
			No proposals to show yet.
		</p>
	{/snippet}

	{#snippet Item({ item: row, isPlaceholder })}
		{#if isPlaceholder}
			<span data-placeholder>
				…
			</span>
		{:else if row}
			{@const proposalId = proposalWireParts(
				row[EntityMetaKey.Id],
			)}
			{#if proposalId != null}
				{@const proposalEntityId = proposalId}
				<ProposalView
					entityId={proposalEntityId}
					href={resolve(
						'/(explore)/(proposals)/proposals/[proposalRealmSlug=proposalRealmSlug]/(proposalRealm)/[proposalKindSlug=proposalKindSlug]/(proposalKind)/[proposalRef=proposalRef]',
						{
							proposalRealmSlug: proposalRealmById[proposalEntityId.realm].slug,
							proposalKindSlug: proposalCategoryById[proposalEntityId.category].slug,
							proposalRef: `${proposalCategoryById[proposalEntityId.category].slug}-${proposalEntityId.number}`,
						},
					)}
					layout={EntityLayout.Summary}
					open={false}
				/>
			{/if}
		{/if}
	{/snippet}
</EntitiesList>
