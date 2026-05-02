<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntitiesListLayout } from '$/components/EntitiesListLayout.ts'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import {
		ProposalCategory,
		ProposalRealm,
		proposalCategoryById,
		proposalRealmById,
	} from '$/constants/Proposal.ts'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
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
			'entityType'
		>
	> = $props()


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
					.select(({ $$proposalKinds }) => ({
						proposalKindRow: $$proposalKinds,
					}))
			)
		},
		[
			() => entityFieldReference.entityType,
			() => entityFieldReference.fieldName,
			() => stringify(entityFieldReference.entityId),
		],
	)

	type ProposalKindRow = {
	proposalKindRow: {
		[EntityMetaKey.Value]: {
			[EntityMetaKey.Id]: {
				realm: ProposalRealm
				category: ProposalCategory
			}
		}
	}
}


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ProposalsView from '$/views/ProposalsView.svelte'
</script>


<EntitiesList
	entityType={EntityType.ProposalKind}
	{title}
	bind:open
	query={proposalKindsQuery}
	items={new SvelteSet(proposalKindsQuery.data ?? [])}
	getKey={(row) => stringify(
		(row as ProposalKindRow).proposalKindRow[EntityMetaKey.Value][EntityMetaKey.Id],
	)}
	getSortValue={(row) => stringify(
		(row as ProposalKindRow).proposalKindRow[EntityMetaKey.Value][EntityMetaKey.Id],
	)}
	layout={EntitiesListLayout.Carousel}
	panelStyle="--carousel-basis: min(40ch, 88cqi); gap: 0.5em"
	placeholderKeys={new SvelteSet<string | number>()}
	UnorderedListProps={{ orientation: ListOrientation.Column }}
	{...EntitiesListProps}
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
			{@const kindId = (row as ProposalKindRow).proposalKindRow[EntityMetaKey.Value][EntityMetaKey.Id]}
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

