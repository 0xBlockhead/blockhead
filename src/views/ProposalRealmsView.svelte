<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntitiesListLayout } from '$/components/EntitiesListLayout.ts'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import { ProposalRealm, proposalRealmById } from '$/constants/Proposal.ts'
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
			'entityType'
		>
	> = $props()


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
					.select(({ $$proposalRealms }) => ({
						proposalRealmRow: $$proposalRealms,
					}))
			)
		},
		[
			() => entityFieldReference.entityType,
			() => entityFieldReference.fieldName,
			() => stringify(entityFieldReference.entityId),
		],
	)

	type ProposalRealmRow = {
	proposalRealmRow: {
		[EntityMetaKey.Value]: {
			[EntityMetaKey.Id]: {
				realm: ProposalRealm
			}
		}
	}
}


	// Components
	import { default as EntitiesList } from '$/components/EntitiesList.svelte'
	import ProposalKindsView from '$/views/ProposalKindsView.svelte'
</script>


<EntitiesList
	entityType={EntityType.ProposalRealm}
	{title}
	bind:open
	query={proposalRealmsQuery}
	items={new SvelteSet(proposalRealmsQuery.data ?? [])}
	getKey={(row) => stringify(
		(row as ProposalRealmRow).proposalRealmRow[EntityMetaKey.Value][EntityMetaKey.Id],
	)}
	getSortValue={(row) => stringify(
		(row as ProposalRealmRow).proposalRealmRow[EntityMetaKey.Value][EntityMetaKey.Id],
	)}
	layout={EntitiesListLayout.Carousel}
	panelStyle="--carousel-basis: min(44ch, 92cqi); gap: 0.5em"
	placeholderKeys={new SvelteSet<string | number>()}
	UnorderedListProps={{ orientation: ListOrientation.Column }}
	{...EntitiesListProps}
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
			{@const realmId = (row as ProposalRealmRow).proposalRealmRow[EntityMetaKey.Value][EntityMetaKey.Id]}
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
