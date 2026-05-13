<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntitiesListLayout } from '$/components/EntitiesListLayout.ts'
	import { proposalRealmById } from '$/constants/Proposal.ts'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { resolve } from '$app/paths'


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
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.ProposalRealm>
		},
		Omit<
			ComponentProps<typeof EntitiesList>,
			| 'entityType'
			| 'items'
			| 'body'
		>
	> = $props()


	// State
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'

	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	import { useEntity } from '$/collections/$queries.svelte.ts'


	// Functions
	const proposalRealmKey = (row: { result: Entity<typeof schema, EntityType.ProposalRealm> }) => (
		stringify(row.result[EntityMetaKey.Id])
	)

	const fieldName = entityFieldReference.fieldName

	const realmsParent = useEntity(
		entityFieldReference.entityType,
		entityFieldReference.entityId,
		{
			$: [
				Source.Constants_Internal,
			],
			[fieldName]: {
				$limit: 512,
			},
		},
	)

	const proposalRealms = derive(
		realmsParent,
		(merged) => (
			(
				merged[fieldName as keyof typeof merged] as (
					Entity<typeof schema, EntityType.ProposalRealm>
				)[]
			)
				.toSorted((first, second) => (
					stringify(first[EntityMetaKey.Id]).localeCompare(stringify(second[EntityMetaKey.Id]))
				))
				.map((realm) => ({
					result: realm,
				}))
		),
	)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ProposalKindsView from '$/views/ProposalKindsView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.ProposalRealm}
	{title}
	bind:open
	getKey={proposalRealmKey}
	getSortValue={proposalRealmKey}
	layout={EntitiesListLayout.Carousel}
	panelStyle="--carousel-basis: min(44ch, 92cqi); gap: 0.5em"
	placeholderKeys={new SvelteSet<string | number>()}
	resource={proposalRealms}
>
	{#snippet Item(props)}
		{#if props.item}
			{@const realmId = props.item.result[EntityMetaKey.Id]}
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
