<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'
	import { EntitiesListLayout } from '$/components/EntitiesListLayout.ts'


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
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'collapsible'
			| 'CollapsibleProps'
			| 'Empty'
			| 'getKey'
			| 'getSortValue'
			| 'HeadingProps'
			| 'href'
			| 'id'
			| 'Item'
			| 'ItemPlaceholder'
			| 'layout'
			| 'limit'
			| 'panelStyle'
			| 'placeholderKeys'
			| 'placeholderText'
			| 'resource'
			| 'showSummary'
			| 'TypeAnnotationTooltip'
			| 'UnorderedListProps'
		>
	> = $props()


	// State
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	import { useEntity } from '$/collections/$queries.svelte.ts'

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
			[entityFieldReference.fieldName]: {
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
			const rows: Entity<typeof schema, EntityType.Proposal>[] = parent[entityFieldReference.fieldName] ?? []
			return (
				rows
					.map((proposal) => ({
						result: proposal,
					}))
			)
		},
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
	getKey={(row) => stringify(row.result[EntityMetaKey.Id])}
	getSortValue={(row) => row.result[EntityMetaKey.Id].number}
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

	{#snippet Item({ item })}
		{@const proposalEntityId = item.result[EntityMetaKey.Id]}
		<ProposalView
			entityId={proposalEntityId}
			layout={EntityLayout.SummaryInline}
			open={false}
		/>
	{/snippet}
</EntitiesList>
