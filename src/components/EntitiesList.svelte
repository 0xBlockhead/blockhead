<script
	lang="ts"
	generics="
		_EntityType extends RegisteredEntityType,
		_Item = (
			& EntitySelector<typeof schema, _EntityType>
			& Entity<typeof schema, _EntityType>
			& {
				value: Entity<typeof schema, _EntityType>
			}
		),
		_Key extends string | number = string | number
	"
>
	// Types/constants
	import type { Entity, EntitySelector } from '$/schema/$schema.ts'
	import type { RegisteredEntityType, schema } from '$/schema/index.ts'
	import { entityDefinitionByType } from '$/schema/index.ts'
	import type { ComponentProps, Snippet } from 'svelte'
	import type { SvelteHTMLElements } from 'svelte/elements'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntitiesListLayout } from '$/components/EntitiesListLayout.ts'
	import { ListOrientation } from '$/components/ListOrientation.ts'

	import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'
	import type { Match } from '$/lib/string.ts'

	type ListItemProps = {
		key: _Key
		item: _Item
		searchQuery?: string
		matches?: SvelteSet<Match>
	}

	type PlaceholderListItemProps = {
		key: _Key
	}

	type CollapsibleForwardProps = Omit<
		ComponentProps<typeof Collapsible>,
		| 'Annotation'
		| 'children'
		| 'open'
		| 'Summary'
		| 'Toolbar'
	>

	type HeadingForwardProps = Omit<ComponentProps<typeof Heading>, 'children'>

	type UnorderedListForwardProps = {
		limit?: number
		orientation?: ListOrientation
	}
	type ItemsInput = Iterable<_Item>
	type ResourceItemsInput = {
		readonly values: ItemsInput
		readonly totalCount?: number
	}


	// Context
	import { getIsInsideEntityList, setIsInsideEntityList } from '$/context/isInsideEntityList.ts'
	import { getIsInsidePage, getIsPageRoot, setIsPageRoot } from '$/context/isInsidePage.ts'
	import { incrementHeadingLevel } from '$/context/headingLevel.ts'
	import {
		getOnNestedCollapsibleClose,
		setOnNestedCollapsibleClose,
	} from '$/context/onNestedCollapsibleClose.ts'


	import { SvelteSet } from 'svelte/reactivity'

	// State
	let {
		entityType,
		id = `EntitiesList:${entityType}`,
		title = entityDefinitionByType[entityType].labels.plural,
		href = `#${id}`,
		open = $bindable(
			!(getIsInsideEntityList() ?? false),
		),
		items,
		getKey,
		getSortValue,
		placeholderText,
		resource,
		totalCount,
		placeholderKeys = new SvelteSet<_Key>(),
		Item,
		ItemPlaceholder,
		Empty,
		body,
		TypeAnnotationTooltip,
		collapsible: _collapsible = true,
		layout = EntitiesListLayout.Default,
		showTypeAnnotation = true,
		showSummary = true,
		showTitle = true,
		panelStyle,

		// Collapsible.svelte
		CollapsibleProps = {},
		// Heading.svelte
		HeadingProps = {},
		// UnorderedList.svelte
		UnorderedListProps = {},

		// <article> — SvelteHTMLElements['article']
		...articleElementProps
	}: WithRest<
		{
			body?: Snippet<[context: {
				open?: boolean,
			}]>
			collapsible?: boolean
			layout?: EntitiesListLayout
			showTypeAnnotation?: boolean
			showSummary?: boolean
			showTitle?: boolean
			panelStyle?: string
			CollapsibleProps?: CollapsibleForwardProps
			Empty?: Snippet
			/** Tooltip body for the list entity-type label (label plural); hover target is the annotation, not a separate icon. */
			TypeAnnotationTooltip?: Snippet
			entityType: _EntityType
			getKey?: (item: _Item) => _Key
			getSortValue?: (item: _Item) => number | string
			HeadingProps?: HeadingForwardProps
			href?: string
			id?: string
			Item?: Snippet<[context: ListItemProps]>
			ItemPlaceholder?: Snippet<[context: PlaceholderListItemProps]>
			/** Ignored when `resource` is set; list rows come from the boundary resolution. */
			items?: ItemsInput
			open?: boolean
			placeholderText?: string
			resource?: SvelteKitResource<ResourceItemsInput | undefined>
			totalCount?: number
			placeholderKeys?: Set<_Key>
			title?: string
			UnorderedListProps?: UnorderedListForwardProps
		},
		SvelteHTMLElements['article']
	> = $props()

	const onNestedCollapsibleClose = getOnNestedCollapsibleClose()
	const isInsidePage = getIsInsidePage()
	const wasPageRoot = getIsPageRoot()


	// Inner context
	import { goto } from '$app/navigation'

	setOnNestedCollapsibleClose((collapsibleId?: string) => {
		goto(
			collapsibleId ?
				`${href.replace(/#.*$/, '')}#${encodeURIComponent(collapsibleId)}`
			:
				href
		)
	})
	setIsInsideEntityList(true)
	setIsPageRoot(false)
	const emptyItems = new SvelteSet<number>()
	const emptyPlaceholderKeys = new SvelteSet<number>()

	const incrementHeadingLevelIfSummaryShown = () => {
		if (showSummary)
			incrementHeadingLevel()
	}
	incrementHeadingLevelIfSummaryShown()


	let listSummary = $state({
		loaded: 0,
		total: undefined,
	})


	const count = $derived(
		items !== undefined || resource !== undefined ?
			listSummary.loaded
		:
			undefined,
	)

	const displayedTotalCount = $derived(
		totalCount ?? listSummary.total,
	)


	const listItems = $derived(
		items !== undefined ?
			[...items]
		:
			[],
	)

	// Components
	import Collapsible from '$/components/Collapsible.svelte'
	import Heading from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import UnorderedList from '$/components/UnorderedList.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
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
			{@const emptyLabel = entityDefinitionByType[entityType].labels.plural}
			<div
				class="entity-details"
				style:view-transition-name={`EntitiesList-Details-${id}`}
			>
				<p data-text="muted">No {emptyLabel[0]?.toUpperCase() ?? ''}{emptyLabel.slice(1)} yet.</p>
			</div>
		{/if}
	{/snippet}

	{#snippet SummaryHeader()}
		<header
			data-row-item="flexible"
			data-row="wrap gap-4"
			style:view-transition-name={`EntitiesList-Summary-${id}`}
		>
			{#if showTitle}
				<Heading {...HeadingProps}>
					<a {href}>{title}</a>
					{#if (count !== undefined || displayedTotalCount !== undefined)}
						<small>({#if count !== undefined}<NumberValue value={count} />{/if}{#if (count !== undefined && displayedTotalCount !== undefined && displayedTotalCount !== count)}/<NumberValue value={displayedTotalCount!} />{/if}{#if count === undefined && displayedTotalCount !== undefined}<NumberValue value={displayedTotalCount} />{/if})</small>
					{/if}
				</Heading>
			{/if}
		</header>
	{/snippet}

	{#snippet SummaryAnnotation()}
		{#if showTypeAnnotation && TypeAnnotationTooltip}
			<Tooltip contentProps={{ side: 'top' }}>
				{#snippet Content()}
					{@render TypeAnnotationTooltip()}
				{/snippet}

				<span data-text="annotation">{entityDefinitionByType[entityType].labels.plural}</span>
			</Tooltip>
		{:else if showTypeAnnotation}
			<span data-text="annotation">{entityDefinitionByType[entityType].labels.plural}</span>
		{/if}
	{/snippet}

	{#snippet ListRowsFrom(rows: _Item[])}
		<UnorderedList
			items={rows}
			{placeholderKeys}
			bind:summary={listSummary}
			getKey={getKey!}
			{getSortValue}
			Item={Item!}
			{ItemPlaceholder}
			{...UnorderedListProps}
			{...{
				...(layout === EntitiesListLayout.Carousel && {
					orientation: ListOrientation.Row,
					'data-scroll-container': 'inline layout-carousel',
					'data-row': 'start align-start',
					style: panelStyle ?? '--carousel-basis: min(40ch, 88cqi); gap: 0.5em',
				}),
			}}
		>
			{#snippet Empty()}
				{@render EmptyFallback()}
			{/snippet}
		</UnorderedList>
	{/snippet}

	{#snippet listColumnBody()}
		{#if body}
			{@render body({
				open,
			})}
		{:else if getKey !== undefined && Item !== undefined}
				{#if resource !== undefined}
					<ResourceBoundary
						resource={resource}
						placeholderText={
						placeholderText
						?? `Loading ${entityDefinitionByType[entityType].labels.plural.toLowerCase()}…`
					}
				>
					{#snippet children(resource)}
						{#key resource}
							{@render ListRowsFrom(resource === undefined ? [] : [...resource.values])}
						{/key}
					{/snippet}
				</ResourceBoundary>
			{:else if items !== undefined}
				{#key listItems}
					{@render ListRowsFrom(listItems)}
				{/key}
			{:else}
				{@render EmptyFallback()}
			{/if}
		{:else}
			{@render EmptyFallback()}
		{/if}
	{/snippet}

	{#if !showSummary}
		{@render listColumnBody()}
	{:else if !_collapsible}
		{@render SummaryHeader()}
		{@render SummaryAnnotation()}
		{@render listColumnBody()}
	{:else}
		<Collapsible
			bind:open
			{...CollapsibleProps}
			onclose={(_closeId) => {
				if (wasPageRoot)
					onNestedCollapsibleClose?.()
				else if (!isInsidePage)
					onNestedCollapsibleClose?.(id)
				CollapsibleProps.onclose?.(_closeId)
			}}
			data-card
		>
			{#snippet Summary()}
				{@render SummaryHeader()}
			{/snippet}

			{#snippet Annotation()}
				{@render SummaryAnnotation()}
			{/snippet}

			{@render listColumnBody()}
		</Collapsible>
	{/if}
</article>


<style>
	.entity-details {
		display: contents;
	}
</style>
