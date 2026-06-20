<script lang="ts">
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { entityDefinitionByType, schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'


	// Context
	import { select } from '$/routes/+layout.svelte'
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
		selection,
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
			selection: EntityProxyEntitiesResource<
				typeof schema,
				EntityType.SpecificationRealm
			>
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

	const incrementHeadingLevelIfStandalone = () => {
		if (!collapsible)
			incrementHeadingLevel()
	}
	incrementHeadingLevelIfStandalone()

	const userCollapsibleOnClose = $derived(CollapsibleProps.onclose)

	const collapsibleDetailsProps = $derived({
		id: CollapsibleProps.id,
		class: CollapsibleProps.class,
	})

	const collapsibleTabsPaneProps: Record<string, string> = {
		'data-scroll-container': 'block',
	}

	const standaloneRealmPanelsProps: Record<string, string> = $derived({
		'data-column': 'gap-4 layout-flex',
		...(panelStyle ?
			{ style: panelStyle }
		:
			{}),
	})


	const specificationRealms = $derived(selection({
		limit: 512,
		fields: {
			label: true,
		},
	}))

	// Functions
	const specificationRealmKey = (specificationRealm: { entitySelector: EntitySelector<typeof schema, EntityType.SpecificationRealm> }) => (
		stringify(specificationRealm.entitySelector)
	)

	const realmPanelDomId = (realm: { entitySelector: EntitySelector<typeof schema, EntityType.SpecificationRealm> }) => (
		`proposal-realm:${realm.entitySelector.realm}:proposal-kinds`
	)



	// (Derived)
	const totalCount = $derived(
		placeholderKeys.size > 0 ?
			placeholderKeys.size
		:
			undefined,
	)

	const showCounts = $derived(true)

	const showTotalCount = $derived(
		totalCount !== undefined,
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
		placeholderText={
			placeholderText
			?? `Loading ${entityDefinitionByType[EntityType.SpecificationRealm].labelPlural.toLowerCase()}…`
		}
		resource={specificationRealms}
	>
		{#snippet children(specificationRealms)}
			{#key specificationRealms}
				{#if specificationRealms.entities.length === 0}
					{@render EmptyFallback()}
				{:else if !showSummary}
					<div {...standaloneRealmPanelsProps}>
						{#each specificationRealms.entities.toSorted((first, second) => (
								String(first.entitySelector.realm).localeCompare(String(second.entitySelector.realm))
							)) as specificationRealm (specificationRealmKey(specificationRealm))}
							<section data-scroll-marker-label={String(specificationRealm.entitySelector.realm)}>
									<ProposalKindsView
										collapsible={false}
										selection={select(
											EntityType.SpecificationRealm,
											{ realm: specificationRealm.entitySelector.realm }
										).$$proposalKinds({
											sources: [
												Source.Constants_Internal,
											],
										})}
										id={realmPanelDomId(specificationRealm)}
										open
										title={String(specificationRealm.entitySelector.realm)}
								/>
							</section>
						{/each}
					</div>
				{:else if collapsible}
					<CollapsibleTabs
						open={open}
						{...collapsibleDetailsProps}
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
						data-card
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
											<small>({#if showTotalCount}<NumberValue value={totalCount!} />{/if})</small>
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
							{#each specificationRealms.entities.toSorted((first, second) => (
								String(first.entitySelector.realm).localeCompare(String(second.entitySelector.realm))
							)) as specificationRealm (specificationRealmKey(specificationRealm))}
								<section id={realmPanelDomId(specificationRealm)}>
											<ProposalKindsView
												CollapsibleProps={{ canToggle: false }}
												selection={select(
													EntityType.SpecificationRealm,
													{ realm: specificationRealm.entitySelector.realm }
												).$$proposalKinds({
													sources: [
														Source.Constants_Internal,
													],
												})}
												id={realmPanelDomId(specificationRealm)}
												open
												title={String(specificationRealm.entitySelector.realm)}
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
												<small>({#if showTotalCount}<NumberValue value={totalCount!} />{/if})</small>
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
									{#each specificationRealms.entities.toSorted((first, second) => (
								String(first.entitySelector.realm).localeCompare(String(second.entitySelector.realm))
							)) as specificationRealm (specificationRealmKey(specificationRealm))}
										<a
											data-scroll-marker-label={String(specificationRealm.entitySelector.realm)}
											href={`#${realmPanelDomId(specificationRealm)}`}
										>{String(specificationRealm.entitySelector.realm)}</a>
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
								{#each specificationRealms.entities.toSorted((first, second) => (
								String(first.entitySelector.realm).localeCompare(String(second.entitySelector.realm))
							)) as specificationRealm (specificationRealmKey(specificationRealm))}
									<section data-scroll-marker-label={String(specificationRealm.entitySelector.realm)}>
												<ProposalKindsView
													collapsible={false}
													selection={select(
														EntityType.SpecificationRealm,
														{ realm: specificationRealm.entitySelector.realm }
													).$$proposalKinds({
														sources: [
															Source.Constants_Internal,
														],
													})}
													id={realmPanelDomId(specificationRealm)}
													open
													title={String(specificationRealm.entitySelector.realm)}
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
