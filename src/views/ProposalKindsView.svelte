<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'

	import type EntitiesListComponent from '$/components/EntitiesList.svelte'

	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import Heading from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'

	import NumberValue from '$/views/NumberValue.svelte'

	import {
		proposalCategoryById,
		proposalRealmById,
	} from '$/constants/Proposal.ts'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { entityDefinitionByType, schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { goto } from '$app/navigation'
	import { resolve } from '$app/paths'
	import { getIsInsidePage } from '$/context/isInsidePage.ts'
	import {
		getOnNestedCollapsibleClose,
		setOnNestedCollapsibleClose,
	} from '$/context/onNestedCollapsibleClose.ts'
	import { incrementHeadingLevel } from '$/context/headingLevel.ts'
	import { setIsInsideEntityList } from '$/context/isInsideEntityList.ts'


	type ProposalKindsEntitiesListForward = Omit<
		ComponentProps<typeof EntitiesListComponent>,
		| 'entityType'
		| 'items'
		| 'body'
		| 'layout'
		| 'getKey'
		| 'getSortValue'
		| 'resource'
		| 'Item'
	>


	// State
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'

	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import ProposalsView from '$/views/ProposalsView.svelte'


	// Props
	let {
		title = 'Proposal Kinds',

		open = $bindable(true),
		entityFieldReference,

		collapsible = true,
		showSummary = true,
		HeadingProps = {},
		CollapsibleProps = {},
		placeholderKeys = new SvelteSet<string | number>(),
		panelStyle,
		href,
		id,
		placeholderText,

		Empty,

		...articleElementProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.ProposalKind>
		},
		ProposalKindsEntitiesListForward
	> = $props()


	const onNestedCollapsibleClose = getOnNestedCollapsibleClose()

	setOnNestedCollapsibleClose((collapsibleId?: string) => (
		goto(
			collapsibleId ?
				`${href.replace(/#.*$/, '')}#${encodeURIComponent(collapsibleId)}`
			:
				href,
		)
	))
	setIsInsideEntityList(true)

	if (!collapsible)
		incrementHeadingLevel()

	const {
		onclose: userCollapsibleOnClose,
		...collapsibleDetailsRest
	} = CollapsibleProps


	const collapsibleTabsPaneProps = {
		'data-scroll-container': 'block',
	} as Record<string, string>

	const standaloneKindPanelsProps = {
		'data-column': 'gap-4 layout-flex',
		...(panelStyle ?
			{ style: panelStyle }
		:
			{}),
	} as Record<string, string>


	// Functions
	const proposalKindKey = (row: { result: Entity<typeof schema, EntityType.ProposalKind> }) => (
		stringify(row.result[EntityMetaKey.Id])
	)

	const rowsFromProposalKinds = (
		queryRows: { result: Entity<typeof schema, EntityType.ProposalKind> }[] | undefined,
	) => (
		queryRows === undefined ?
			[] as { result: Entity<typeof schema, EntityType.ProposalKind> }[]
		:
			[...queryRows]
	)

	const kindPanelDomId = (kindEntity: Entity<typeof schema, EntityType.ProposalKind>) => (
		`proposal-kind:${kindEntity[EntityMetaKey.Id].realm}:${kindEntity[EntityMetaKey.Id].category}:proposals`
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
		(merged) => {
			const rows: Entity<typeof schema, EntityType.ProposalKind>[] = merged[fieldName] ?? []
			return (
				rows
					.toSorted((first, second) => (
						stringify(first[EntityMetaKey.Id]).localeCompare(stringify(second[EntityMetaKey.Id]))
					))
					.map((kind) => ({
						result: kind,
					}))
			)
		},
	)

	const loadedCount = $derived(
		proposalKinds.ready ?
			proposalKinds.current!.length
		:
			0,
	)

	const totalCount = $derived(
		placeholderKeys.size > 0 ?
			placeholderKeys.size
		:
			undefined,
	)

	const showCounts = $derived(true)

	const showTotalCount = $derived(
		loadedCount !== undefined
		&& totalCount !== undefined
		&& totalCount !== loadedCount,
	)
</script>


<article
	{id}
	{...articleElementProps}
	style:view-transition-name={`EntitiesList-${id}`}
>
	{#snippet EmptyFallback()}
		{#if Empty}
			{@render Empty()}
		{:else}
			<div
				class="entity-details"
				style:view-transition-name={`EntitiesList-Details-${id}`}
			>
				<p>–</p>
			</div>
		{/if}
	{/snippet}

	<ResourceBoundary
		boundaryKey={id}
		placeholderText={
			placeholderText
			?? `Loading ${entityDefinitionByType[EntityType.ProposalKind].labelPlural.toLowerCase()}…`
		}
		resource={proposalKinds}
	>
		{#snippet children(queryRows)}
			{#key queryRows}
				{@const rows = rowsFromProposalKinds(queryRows)}

				{#if rows.length === 0}
					{@render EmptyFallback()}
				{:else if !showSummary}
					<div {...standaloneKindPanelsProps}>
						{#each rows as row (proposalKindKey(row))}
							{@const kindRow = row.result}
							<section data-scroll-marker-label={proposalCategoryById[kindRow[EntityMetaKey.Id].category].labelPlural}>
								<ProposalsView
									collapsible={false}
									entityFieldReference={{
										entityType: EntityType.ProposalKind,
										entityId: {
											realm: kindRow[EntityMetaKey.Id].realm,
											category: kindRow[EntityMetaKey.Id].category,
										},
										fieldName: '$$proposals',
									}}
									href={resolve(
										`/proposals/${proposalRealmById[kindRow[EntityMetaKey.Id].realm].slug}/${proposalCategoryById[kindRow[EntityMetaKey.Id].category].slug}`,
									)}
									id={kindPanelDomId(kindRow)}
									open
									title={proposalCategoryById[kindRow[EntityMetaKey.Id].category].labelPlural}
								/>
							</section>
						{/each}
					</div>
				{:else if collapsible}
					<CollapsibleTabs
						bind:open
						{...collapsibleDetailsRest}
						onclose={(closeId) => {
							if (!getIsInsidePage())
								onNestedCollapsibleClose?.(id)
							userCollapsibleOnClose?.(closeId)
						}}
						{...{ 'data-card': '' }}
						scrollContainerProps={collapsibleTabsPaneProps}
					>
						{#snippet Annotation({ open: _ })}
							<span data-text="annotation">{entityDefinitionByType[EntityType.ProposalKind].labelPlural}</span>
						{/snippet}

						{#snippet Summary({ open: _ })}
							<header
								data-row-item="flexible"
								data-row="wrap gap-4"
								style:view-transition-name={`EntitiesList-Summary-${id}`}
							>
								<Heading {...HeadingProps}>
									<a {href}>{title}</a>
									{#if showCounts}
										<small>({#if loadedCount !== undefined}<NumberValue value={loadedCount} />{/if}{#if showTotalCount} / {/if}{#if showTotalCount}<NumberValue value={totalCount!} />{/if}{#if loadedCount === undefined && totalCount !== undefined}<NumberValue value={totalCount} />{/if})</small>
									{/if}
								</Heading>
							</header>
						{/snippet}

						{#snippet Markers({ open: _ })}
							{#each rows as row (proposalKindKey(row))}
								{@const kindRow = row.result}
								<a
									data-scroll-marker-label={proposalCategoryById[kindRow[EntityMetaKey.Id].category].labelPlural}
									href={`#${kindPanelDomId(kindRow)}`}
								>{proposalCategoryById[kindRow[EntityMetaKey.Id].category].labelPlural}</a>
							{/each}
						{/snippet}

						{#snippet children({ open: _ })}
							{#each rows as row (proposalKindKey(row))}
								{@const kindRow = row.result}
								<section data-scroll-marker-label={proposalCategoryById[kindRow[EntityMetaKey.Id].category].labelPlural}>
									<ProposalsView
										collapsible={false}
										entityFieldReference={{
											entityType: EntityType.ProposalKind,
											entityId: {
												realm: kindRow[EntityMetaKey.Id].realm,
												category: kindRow[EntityMetaKey.Id].category,
											},
											fieldName: '$$proposals',
										}}
										href={resolve(
											`/proposals/${proposalRealmById[kindRow[EntityMetaKey.Id].realm].slug}/${proposalCategoryById[kindRow[EntityMetaKey.Id].category].slug}`,
										)}
										id={kindPanelDomId(kindRow)}
										open
										title={proposalCategoryById[kindRow[EntityMetaKey.Id].category].labelPlural}
									/>
								</section>
							{/each}
						{/snippet}
					</CollapsibleTabs>
				{:else}
					<div
						{...{ 'data-card': '' }}
						data-scroll-container="block snap-block"
					>
						<div data-sticky>
							<div data-row="align-center gap-4">
								<div data-row-item="wrap-start">
									<header
										data-row-item="flexible"
										data-row="wrap gap-4"
										style:view-transition-name={`EntitiesList-Summary-${id}`}
									>
										<Heading {...HeadingProps}>
											<a {href}>{title}</a>
											{#if showCounts}
												<small>({#if loadedCount !== undefined}<NumberValue value={loadedCount} />{/if}{#if showTotalCount} / {/if}{#if showTotalCount}<NumberValue value={totalCount!} />{/if}{#if loadedCount === undefined && totalCount !== undefined}<NumberValue value={totalCount} />{/if})</small>
											{/if}
										</Heading>
									</header>
								</div>

								<div
									data-carousel-markers
									data-row-item="flexible"
								>
									{#each rows as row (proposalKindKey(row))}
										{@const kindRow = row.result}
										<a
											data-scroll-marker-label={proposalCategoryById[kindRow[EntityMetaKey.Id].category].labelPlural}
											href={`#${kindPanelDomId(kindRow)}`}
										>{proposalCategoryById[kindRow[EntityMetaKey.Id].category].labelPlural}</a>
									{/each}
								</div>

								<div data-row="wrap">
									<span data-text="annotation">{entityDefinitionByType[EntityType.ProposalKind].labelPlural}</span>
								</div>
							</div>
						</div>

						<div
							data-column-item="flexible"
							data-column="layout-flex"
							data-sticky-container
						>
							<div {...standaloneKindPanelsProps}>
								{#each rows as row (proposalKindKey(row))}
									{@const kindRow = row.result}
									<section data-scroll-marker-label={proposalCategoryById[kindRow[EntityMetaKey.Id].category].labelPlural}>
										<ProposalsView
											collapsible={false}
											entityFieldReference={{
												entityType: EntityType.ProposalKind,
												entityId: {
													realm: kindRow[EntityMetaKey.Id].realm,
													category: kindRow[EntityMetaKey.Id].category,
												},
												fieldName: '$$proposals',
											}}
											href={resolve(
												`/proposals/${proposalRealmById[kindRow[EntityMetaKey.Id].realm].slug}/${proposalCategoryById[kindRow[EntityMetaKey.Id].category].slug}`,
											)}
											id={kindPanelDomId(kindRow)}
											open
											title={proposalCategoryById[kindRow[EntityMetaKey.Id].category].labelPlural}
										/>
									</section>
								{/each}
							</div>
						</div>
					</div>
				{/if}
			{/key}
		{/snippet}
	</ResourceBoundary>
</article>


<style>
	.entity-details {
		display: contents;
	}
</style>
