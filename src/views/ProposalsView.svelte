<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntitiesListLayout } from '$/components/EntitiesListLayout.ts'
	import {
		proposalCategoryById,
		proposalRealmById,
	} from '$/constants/Proposal.ts'
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
		title = 'Proposals',

		open = $bindable(true),
		entityFieldReference,

		...EntitiesListProps
	}: WithRest<
		{
			title?: string
			open?: boolean
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.Proposal>
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
	const proposalKey = (row: { result: Entity<typeof schema, EntityType.Proposal> }) => (
		stringify(row.result[EntityMetaKey.Id])
	)

	const proposalSortValue = (row: { result: Entity<typeof schema, EntityType.Proposal> }) => (
		row.result[EntityMetaKey.Id].number
	)

	const fieldName = $derived(entityFieldReference.fieldName)

	const proposalsParent = useEntity(
		entityFieldReference.entityType,
		entityFieldReference.entityId,
		{
			$: [
				Source.Constants_Internal,
				Source.EthereumEips_Github,
				Source.Ensips_Github,
				Source.Caips_Github,
			],
			[fieldName]: {
				$: [
					Source.EthereumEips_Github,
					Source.Ensips_Github,
					Source.Caips_Github,
				],
				$limit: 2048,
			},
		},
	)

	const proposals = derive(
		proposalsParent,
		(merged) => (
			(
				merged[fieldName as keyof typeof merged] as (
					Entity<typeof schema, EntityType.Proposal>
				)[]
			)
				.toSorted((first, second) => (
					first[EntityMetaKey.Id].number
					- second[EntityMetaKey.Id].number
				))
				.map((proposalRow) => ({
					result: proposalRow,
				}))
		),
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
	getKey={proposalKey}
	getSortValue={proposalSortValue}
	layout={EntitiesListLayout.Carousel}
	panelStyle="--carousel-basis: min(40ch, 88cqi); gap: 0.5em"
	placeholderKeys={new SvelteSet<string | number>()}
	resource={proposals}
>
	{#snippet Item(props)}
		{#if props.item}
			{@const proposalEntityId = props.item.result[EntityMetaKey.Id]}
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
	{/snippet}
</EntitiesList>
