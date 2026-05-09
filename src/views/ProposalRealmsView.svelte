<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntitiesListLayout } from '$/components/EntitiesListLayout.ts'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import { proposalRealmById } from '$/constants/Proposal.ts'
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
		title = 'Proposal Realms',

		open = $bindable(true),
		entityFieldReference,

		...EntitiesListProps
	}: WithRest<
		{
			title?: string
			open?: boolean
			entityFieldReference: EntityFieldReference<typeof schema, typeof EntityType.ProposalRealm>
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
	const proposalRealmKey = (row: Entity<typeof schema, EntityType.ProposalRealm>) => (
		stringify(row[EntityMetaKey.Id])
	)


	const proposalRealmsQuery = useLiveQuery(
		(queryBuilder) => {
			const parentIdKey = stringify(entityFieldReference.entityId)
			return (
				queryBuilder
					.from({
						$$proposalRealms: entityFieldCollections[entityFieldReference.entityType][entityFieldReference.fieldName]!,
					})
					.where(({ $$proposalRealms }) => (
						eq(
							$$proposalRealms[EntityMetaKey.ParentIdKey],
							parentIdKey,
						)
					))
					.select(({ $$proposalRealms }) => (
						{ value: $$proposalRealms[EntityMetaKey.Value] }
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
	import { default as EntitiesList } from '$/components/EntitiesList.svelte'
	import ProposalKindsView from '$/views/ProposalKindsView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.ProposalRealm}
	{title}
	bind:open
	items={proposalRealmsQuery.data?.map(({ value }) => value) ?? []}
	getKey={proposalRealmKey}
	getSortValue={proposalRealmKey}
	layout={EntitiesListLayout.Carousel}
	panelStyle="--carousel-basis: min(44ch, 92cqi); gap: 0.5em"
	placeholderKeys={new SvelteSet<string | number>()}
	query={{
		data: proposalRealmsQuery.data?.map(({ value }) => value) ?? [],
		isLoading: proposalRealmsQuery.isLoading,
		isError: proposalRealmsQuery.isError,
		isReady: proposalRealmsQuery.isReady,
		error: proposalRealmsQuery.error,
		status: proposalRealmsQuery.status,
	}}
	UnorderedListProps={{ orientation: ListOrientation.Column }}
>
	{#snippet Empty()}
		<p data-text="muted">
			No proposal realms to show yet.
		</p>
	{/snippet}

	{#snippet Item({ item: row, isPlaceholder })}
		{#if isPlaceholder}
			<span data-placeholder>
				…
			</span>
		{:else if row}
			{@const realmId = row[EntityMetaKey.Id]}
			<ProposalKindsView
				collapsible={false}
				layout={EntitiesListLayout.Carousel}
				entityFieldReference={{
					entityType: EntityType.ProposalRealm,
					entityId: { realm: realmId.realm },
					fieldName: '$$proposalKinds',
				}}
				href={resolve(
					`/proposals/${proposalRealmById[realmId.realm].slug}`,
				)}
				id={`proposal-realm:${realmId.realm}:proposal-kinds`}
				open
				title={proposalRealmById[realmId.realm].label}
			/>
		{/if}
	{/snippet}
</EntitiesList>
