<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { entityDefinitionByType, schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'

	type SpecificationRealmsEntitiesListForward = Pick<
			ComponentProps<typeof EntitiesList>,
			| 'id'
		>


	// Context
	import { goto } from '$app/navigation'
	import { getIsInsidePage } from '$/context/isInsidePage.ts'

	import {
		getOnNestedCollapsibleClose,
		setOnNestedCollapsibleClose,
	} from '$/context/onNestedCollapsibleClose.ts'

	import { incrementHeadingLevel } from '$/context/headingLevel.ts'
	import { setIsInsideEntityList } from '$/context/isInsideEntityList.ts'
	import { resolve } from '$app/paths'


	// State
	let {
		title = 'Specification realms',

		open = $bindable(true),
		entityFieldReference,
		href = resolve('/proposals'),

		collapsible = true,
		showSummary = true,
		HeadingProps = {},
		CollapsibleProps = {},
		placeholderKeys = new SvelteSet<string | number>(),
		panelStyle,
		id,
		placeholderText,

		Empty,

		...articleElementProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.SpecificationRealm>
			href?: string
		},
		SpecificationRealmsEntitiesListForward
	> = $props()


	// Inner context
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

	const collapsibleTabsPaneProps: Record<string, string> = {
		'data-scroll-container': 'block',
	}

	const standaloneRealmPanelsProps: Record<string, string> = {
		'data-column': 'gap-4 layout-flex',
		...(panelStyle ?
			{ style: panelStyle }
		:
			{}),
	}


	// Functions
	const specificationRealmKey = (row: { result: Entity<typeof schema, EntityType.SpecificationRealm> }) => (
		stringify(row.result[EntityMetaKey.Id])
	)

	const rowsFromSpecificationRealms = (
		specificationRealms: { result: Entity<typeof schema, EntityType.SpecificationRealm> }[] | undefined,
	): { result: Entity<typeof schema, EntityType.SpecificationRealm> }[] => (
		specificationRealms === undefined ?
			[]
		:
			[...specificationRealms]
	)

	const realmPanelDomId = (realm: Entity<typeof schema, EntityType.SpecificationRealm>) => (
		`proposal-realm:${realm[EntityMetaKey.Id].realm}:proposal-kinds`
	)


	// State
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const parent = useEntity(
		entityFieldReference.entityType,
		entityFieldReference.entityId,
		{
			$: [
				Source.Constants_Internal,
			],
			[entityFieldReference.fieldName]: {
				$limit: 512,
				label: {},
			},
		},
	)

	const specificationRealms = derive(
		parent,
		(parent) => {
			const rows: Entity<typeof schema, EntityType.SpecificationRealm>[] = parent[entityFieldReference.fieldName] ?? []
			return (
				rows
					.toSorted((first, second) => (
						(first.label ?? stringify(first[EntityMetaKey.Id])).localeCompare(
							second.label ?? stringify(second[EntityMetaKey.Id]),
						)
					))
					.map((realm) => ({
						result: realm,
					}))
			)
		},
	)


	const count = $derived(
		specificationRealms.ready ?
			specificationRealms.current!.length
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
		count !== undefined
		&& totalCount !== undefined
		&& totalCount !== count,
	)


	// Components
	import type EntitiesListComponent from '$/components/EntitiesList.svelte'
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
	import ProposalKindsView from '$/views/SpecificationProposalKindsView.svelte'
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
			?? `Loading ${entityDefinitionByType[EntityType.SpecificationRealm].labelPlural.toLowerCase()}…`
		}
		resource={specificationRealms}
	>
		{#snippet children(specificationRealms)}
			{#key specificationRealms}
				{@const rows = rowsFromSpecificationRealms(specificationRealms)}

				{#if rows.length === 0}
					{@render EmptyFallback()}
				{:else if !showSummary}
					<div {...standaloneRealmPanelsProps}>
						{#each rows as row (specificationRealmKey(row))}
							{@const realm = row.result}
							<section data-scroll-marker-label={realm.label ?? String(realm[EntityMetaKey.Id].realm)}>
								<ProposalKindsView
									collapsible={false}
									entityFieldReference={{
										entityType: EntityType.SpecificationRealm,
										entityId: { realm: realm[EntityMetaKey.Id].realm },
										fieldName: '$$proposalKinds',
									}}
									id={realmPanelDomId(realm)}
									open
									title={realm.label ?? String(realm[EntityMetaKey.Id].realm)}
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
						sectionIdPrefix="proposal-realm"
						sections={[{
							id: 'realms',
							label: entityDefinitionByType[EntityType.SpecificationRealm].labelPlural,
						}]}
						{...{ 'data-card': '' }}
						scrollContainerProps={collapsibleTabsPaneProps}
					>
						{#snippet Annotation({
							open: _annotationOpen,
						})}
							<span data-text="annotation">{entityDefinitionByType[EntityType.SpecificationRealm].labelPlural}</span>
						{/snippet}

						{#snippet Summary({
							open: _summaryOpen,
						})}
							<div data-column="gap-1">
								<header
									data-row-item="flexible"
									data-row="wrap gap-4"
									style:view-transition-name={`EntitiesList-Summary-${id}`}
								>
									<HeadingComponent {...HeadingProps}>
										<a {href}>{title}</a>
										{#if showCounts}
											<small>({#if count !== undefined}<NumberValue value={count} />{/if}{#if showTotalCount} / {/if}{#if showTotalCount}<NumberValue value={totalCount!} />{/if}{#if count === undefined && totalCount !== undefined}<NumberValue value={totalCount} />{/if})</small>
										{/if}
									</HeadingComponent>
								</header>

								<div data-row="wrap align-center gap-2">
									<Tooltip contentProps={{ side: 'top' }}>
										{#snippet Content()}
											<p>
												Realms are top-level stewards for specification catalogs; underneath each realm you open document families, then numbered drafts—not treasury vote dashboards.
											</p>
										{/snippet}
										<abbr
											class="entity-heading-tip"
											aria-label="How realms are grouped"
										>ⓘ</abbr>
									</Tooltip>
								</div>
							</div>
						{/snippet}

						{#snippet SectionRealms({ id: _sectionId, label: _sectionLabel })}
							{#each rows as row (specificationRealmKey(row))}
								{@const realm = row.result}
								<section id={realmPanelDomId(realm)}>
									<ProposalKindsView
										collapsible={false}
										entityFieldReference={{
											entityType: EntityType.SpecificationRealm,
											entityId: { realm: realm[EntityMetaKey.Id].realm },
											fieldName: '$$proposalKinds',
										}}
										id={realmPanelDomId(realm)}
										open
										title={realm.label ?? String(realm[EntityMetaKey.Id].realm)}
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
								<div data-column="gap-1" data-row-item="wrap-start">
									<header
										data-row-item="flexible"
										data-row="wrap gap-4"
										style:view-transition-name={`EntitiesList-Summary-${id}`}
									>
										<HeadingComponent {...HeadingProps}>
											<a {href}>{title}</a>
											{#if showCounts}
												<small>({#if count !== undefined}<NumberValue value={count} />{/if}{#if showTotalCount} / {/if}{#if showTotalCount}<NumberValue value={totalCount!} />{/if}{#if count === undefined && totalCount !== undefined}<NumberValue value={totalCount} />{/if})</small>
											{/if}
										</HeadingComponent>
									</header>

									<div data-row="wrap align-center gap-2">
										<Tooltip contentProps={{ side: 'top' }}>
											{#snippet Content()}
												<p>
													Realms are top-level stewards for specification catalogs; underneath each realm you open document families, then numbered drafts—not treasury vote dashboards.
												</p>
											{/snippet}
											<abbr
												class="entity-heading-tip"
												aria-label="How realms are grouped"
											>ⓘ</abbr>
										</Tooltip>
									</div>
								</div>

								<div
									data-carousel-markers
									data-row-item="flexible"
								>
									{#each rows as row (specificationRealmKey(row))}
										{@const realm = row.result}
										<a
											data-scroll-marker-label={realm.label ?? String(realm[EntityMetaKey.Id].realm)}
											href={`#${realmPanelDomId(realm)}`}
										>{realm.label ?? String(realm[EntityMetaKey.Id].realm)}</a>
									{/each}
								</div>

								<div data-row="wrap">
									<span data-text="annotation">{entityDefinitionByType[EntityType.SpecificationRealm].labelPlural}</span>
								</div>
							</div>
						</div>

						<div
							data-column-item="flexible"
							data-column
							data-sticky-container
						>
							<div {...standaloneRealmPanelsProps}>
								{#each rows as row (specificationRealmKey(row))}
									{@const realm = row.result}
									<section data-scroll-marker-label={realm.label ?? String(realm[EntityMetaKey.Id].realm)}>
										<ProposalKindsView
											collapsible={false}
											entityFieldReference={{
												entityType: EntityType.SpecificationRealm,
												entityId: { realm: realm[EntityMetaKey.Id].realm },
												fieldName: '$$proposalKinds',
											}}
											id={realmPanelDomId(realm)}
											open
											title={realm.label ?? String(realm[EntityMetaKey.Id].realm)}
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
