<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { entityDefinitionByType, schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'


	// Context
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
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
		title = 'Proposal kinds',

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
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.SpecificationProposalKind>
			title?: string
			open?: boolean
			collapsible?: boolean
			href?: string
		},
		Pick<
			ComponentProps<typeof EntitiesListComponent>,
			| 'id'
			| 'showSummary'
			| 'HeadingProps'
			| 'CollapsibleProps'
			| 'placeholderKeys'
			| 'panelStyle'
			| 'placeholderText'
			| 'Empty'
		>
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

	const standaloneKindPanelsProps: Record<string, string> = {
		'data-column': 'gap-4 layout-flex',
		...(panelStyle ?
			{ style: panelStyle }
		:
			{}),
	}


	// Functions
	const proposalKindKey = (specificationProposalKind: Entity<typeof schema, EntityType.SpecificationProposalKind>) => (
		stringify(specificationProposalKind[EntityMetaKey.Id])
	)

	const kindPanelDomId = (kind: Entity<typeof schema, EntityType.SpecificationProposalKind>) => (
		`proposal-kind:${kind[EntityMetaKey.Id].realm}:${kind[EntityMetaKey.Id].category}:proposals`
	)


	import { useEntity } from '$/collections/$collections.ts'
	import { entityCollectionsContext } from '$/collections/entityCollections.ts'

	const parent = useEntity(entityCollectionsContext,
		entityFieldReference.entityType,
		entityFieldReference.entityId,({ sources: [
				Source.Constants_Internal,
			], fields: { [entityFieldReference.fieldName]: {
				limit: 512,
				fields: {
					label: true,
					labelPlural: true,
				},
			},
		} }),
	)

	const proposalKinds = derive(
		parent,
		(parent) => {
			const specificationProposalKinds: readonly Entity<typeof schema, EntityType.SpecificationProposalKind>[] = parent.fields[entityFieldReference.fieldName]?.values ?? []
			return (
				specificationProposalKinds
					.toSorted((first, second) => (
						(first.labelPlural ?? first.label ?? stringify(first[EntityMetaKey.Id])).localeCompare(
							second.labelPlural ?? second.label ?? stringify(second[EntityMetaKey.Id]),
						)
					))
			)
		},
	)


	// (Derived)
	const count = $derived(
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
	import ProposalsView from '$/views/SpecificationProposalsView.svelte'
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
			?? `Loading ${entityDefinitionByType[EntityType.SpecificationProposalKind].labelPlural.toLowerCase()}…`
		}
		resource={proposalKinds}
	>
		{#snippet children(proposalKinds)}
			{#key proposalKinds}
				{#if proposalKinds.length === 0}
					{@render EmptyFallback()}
				{:else if !showSummary}
					<div {...standaloneKindPanelsProps}>
						{#each proposalKinds as specificationProposalKind (proposalKindKey(specificationProposalKind))}
							<section data-scroll-marker-label={specificationProposalKind.labelPlural ?? specificationProposalKind.label ?? String(specificationProposalKind[EntityMetaKey.Id].category)}>
								<ProposalsView
									href={resolve('/proposals')}
									collapsible={false}
									entityFieldReference={{
										entityType: EntityType.SpecificationProposalKind,
										entityId: {
											realm: specificationProposalKind[EntityMetaKey.Id].realm,
											category: specificationProposalKind[EntityMetaKey.Id].category,
										},
										fieldName: '$$proposals',
									}}
									id={kindPanelDomId(specificationProposalKind)}
									open
									title={specificationProposalKind.labelPlural ?? specificationProposalKind.label ?? String(specificationProposalKind[EntityMetaKey.Id].category)}
								/>
							</section>
						{/each}
					</div>
				{:else if collapsible}
					<CollapsibleTabs
						open={open}
						{...collapsibleDetailsRest}
						onclose={(closeId) => {
							if (!getIsInsidePage())
								onNestedCollapsibleClose?.(id)
							userCollapsibleOnClose?.(closeId)
						}}
						sectionIdPrefix="proposal-kind"
						sections={[{
							id: 'kinds',
							label: entityDefinitionByType[EntityType.SpecificationProposalKind].labelPlural,
						}]}
						data-card
						scrollContainerProps={collapsibleTabsPaneProps}
					>
						{#snippet Annotation({
							open: _annotationOpen,
						})}
							<span data-text="annotation">{entityDefinitionByType[EntityType.SpecificationProposalKind].labelPlural}</span>
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
												Specifications are grouped by steward realm and document family, then numbered drafts from public repositories—not live treasury vote dashboards.
											</p>
										{/snippet}
										<abbr
											class="entity-heading-tip"
											aria-label="How proposals are grouped"
										>ⓘ</abbr>
									</Tooltip>
								</div>
							</div>
						{/snippet}

						{#snippet SectionKinds({ id: _sectionId, label: _sectionLabel })}
							{#each proposalKinds as specificationProposalKind (proposalKindKey(specificationProposalKind))}
								<section id={kindPanelDomId(specificationProposalKind)}>
									<ProposalsView
										CollapsibleProps={{ canToggle: false }}
										href={resolve('/proposals')}
										entityFieldReference={{
											entityType: EntityType.SpecificationProposalKind,
											entityId: {
												realm: specificationProposalKind[EntityMetaKey.Id].realm,
												category: specificationProposalKind[EntityMetaKey.Id].category,
											},
											fieldName: '$$proposals',
										}}
										id={kindPanelDomId(specificationProposalKind)}
										open
										title={specificationProposalKind.labelPlural ?? specificationProposalKind.label ?? String(specificationProposalKind[EntityMetaKey.Id].category)}
									/>
								</section>
							{/each}
						{/snippet}
					</CollapsibleTabs>
				{:else}
					<div
						data-card
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
													Specifications are grouped by steward realm and document family, then numbered drafts from public repositories—not live treasury vote dashboards.
												</p>
											{/snippet}
											<abbr
												class="entity-heading-tip"
												aria-label="How proposals are grouped"
											>ⓘ</abbr>
										</Tooltip>
									</div>
								</div>

								<div
									data-carousel-markers
									data-row-item="flexible"
								>
									{#each proposalKinds as specificationProposalKind (proposalKindKey(specificationProposalKind))}
										<a
											data-scroll-marker-label={specificationProposalKind.labelPlural ?? specificationProposalKind.label ?? String(specificationProposalKind[EntityMetaKey.Id].category)}
											href={`#${kindPanelDomId(specificationProposalKind)}`}
										>{specificationProposalKind.labelPlural ?? specificationProposalKind.label ?? String(specificationProposalKind[EntityMetaKey.Id].category)}</a>
									{/each}
								</div>

								<div data-row="wrap">
									<span data-text="annotation">{entityDefinitionByType[EntityType.SpecificationProposalKind].labelPlural}</span>
								</div>
							</div>
						</div>

						<div
							data-column-item="flexible"
							data-column
							data-sticky-container
						>
							<div {...standaloneKindPanelsProps}>
								{#each proposalKinds as specificationProposalKind (proposalKindKey(specificationProposalKind))}
									<section data-scroll-marker-label={specificationProposalKind.labelPlural ?? specificationProposalKind.label ?? String(specificationProposalKind[EntityMetaKey.Id].category)}>
										<ProposalsView
											href={resolve('/proposals')}
											collapsible={false}
											entityFieldReference={{
												entityType: EntityType.SpecificationProposalKind,
												entityId: {
													realm: specificationProposalKind[EntityMetaKey.Id].realm,
													category: specificationProposalKind[EntityMetaKey.Id].category,
												},
												fieldName: '$$proposals',
											}}
											id={kindPanelDomId(specificationProposalKind)}
											open
											title={specificationProposalKind.labelPlural ?? specificationProposalKind.label ?? String(specificationProposalKind[EntityMetaKey.Id].category)}
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
