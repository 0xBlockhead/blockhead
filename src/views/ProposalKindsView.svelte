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
		title = 'Proposal Kinds',

		open = $bindable(true),
		entityFieldReference,

		...EntitiesListProps
	}: WithRest<
		{
			title?: string
			open?: boolean
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.ProposalKind>
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
	const proposalKindKey = (row: { result: Entity<typeof schema, EntityType.ProposalKind> }) => (
		stringify(row.result[EntityMetaKey.Id])
	)

	const fieldName = entityFieldReference.fieldName

	const kindsParent = useEntity(
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

	const proposalKinds = derive(
		kindsParent,
		(merged) => (
			(
				merged[fieldName as keyof typeof merged] as (
					Entity<typeof schema, EntityType.ProposalKind>
				)[]
			)
				.toSorted((first, second) => (
					stringify(first[EntityMetaKey.Id]).localeCompare(stringify(second[EntityMetaKey.Id]))
				))
				.map((kind) => ({
					result: kind,
				}))
		),
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
	getKey={proposalKindKey}
	getSortValue={proposalKindKey}
	layout={EntitiesListLayout.Carousel}
	panelStyle="--carousel-basis: min(40ch, 88cqi); gap: 0.5em"
	placeholderKeys={new SvelteSet<string | number>()}
	resource={proposalKinds}
>
	{#snippet Item(props)}
		{#if props.isPlaceholder === false}
			{@const kindId = props.item.result[EntityMetaKey.Id]}
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
