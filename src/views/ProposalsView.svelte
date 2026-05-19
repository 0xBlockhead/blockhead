<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'

	import EntitiesList from '$/components/EntitiesList.svelte'
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

	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'


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


	// Functions
	const proposalKey = (row: { result: Entity<typeof schema, EntityType.Proposal> }) => (
		stringify(row.result[EntityMetaKey.Id])
	)

	const proposalSortValue = (row: { result: Entity<typeof schema, EntityType.Proposal> }) => (
		row.result[EntityMetaKey.Id].number
	)


	// State
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const fieldName = $derived(entityFieldReference.fieldName)

	const parent = useEntity(
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
		parent,
		(parent) => {
			const rows: Entity<typeof schema, EntityType.Proposal>[] = parent[fieldName] ?? []
			return (
				rows
					.toSorted((first, second) => (
						first[EntityMetaKey.Id].number
						- second[EntityMetaKey.Id].number
					))
					.map((proposalRow) => ({
						result: proposalRow,
					}))
			)
		},
	)


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import ProposalView from '$/views/ProposalView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.Proposal}
	{title}
	bind:open
	getKey={proposalKey}
	getSortValue={proposalSortValue}
	layout={EntitiesListLayout.Default}
	placeholderKeys={new SvelteSet<string | number>()}
	resource={proposals}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			These proposal cards come from public standards repositories for Ethereum upgrades, name-service improvements, and shared chain identifiers.
		</p>
		<p>
			They document design specs—not live on-chain vote tallies for a particular DAO.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No proposals in this slice yet.
		</p>
	{/snippet}

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
