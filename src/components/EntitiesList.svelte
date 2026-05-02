<script
	lang="ts"
	generics="
		_EntityType extends EntityType,
		_Item = never,
		_Key extends string | number = string | number
	"
>
	// Types/constants
	import type { EntityType } from '$/schema/$EntityType.ts'
	import { entityDefinitionByType } from '$/schema/index.ts'
	import type { ComponentProps, Snippet } from 'svelte'
	import type { SvelteHTMLElements } from 'svelte/elements'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntitiesListLayout } from '$/components/EntitiesListLayout.ts'
	import { ListOrientation } from '$/components/ListOrientation.ts'

	import Collapsible from '$/components/Collapsible.svelte'
	import Heading from '$/components/Heading.svelte'
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import UnorderedList from '$/components/UnorderedList.svelte'
	import NumberValue from '$/views/NumberValue.svelte'

	import type { QueryLike } from '$/lib/db/queryResource.svelte.ts'

	type ListItemProps = {
		key: _Key
	} & (
		| {
				item: _Item
				isPlaceholder: false
			}
		| {
				item?: never
				isPlaceholder: true
			}
	)

	type CollapsibleForwardProps = Omit<
		ComponentProps<typeof Collapsible>,
		| 'Annotation'
		| 'children'
		| 'open'
		| 'Summary'
		| 'Toolbar'
	>

	type HeadingForwardProps = Omit<ComponentProps<typeof Heading>, 'children'>

	type UnorderedListForwardProps = Omit<
		ComponentProps<typeof UnorderedList>,
		| 'Empty'
		| 'getKey'
		| 'getSortValue'
		| 'Item'
		| 'items'
		| 'placeholderKeys'
	>


	// Context
	import { getIsInsidePage } from '$/context/isInsidePage.ts'
	import { setIsInsideEntityList } from '$/context/isInsideEntityList.ts'
	import { incrementHeadingLevel } from '$/context/headingLevel.ts'
	import {
		getOnNestedCollapsibleClose,
		setOnNestedCollapsibleClose,
	} from '$/context/onNestedCollapsibleClose.ts'


	// State
	import { SvelteSet } from 'svelte/reactivity'

	let {
		entityType,
		id,
		title,
		href,
		open = $bindable(true),
		items,
		getKey,
		getSortValue,
		placeholderText,
		query,
		placeholderKeys = new SvelteSet<_Key>(),
		Item,
		Empty,
		body,
		collapsible = true,
		layout = EntitiesListLayout.Default,
		showSummary = true,
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
			body?: Snippet
			collapsible?: boolean
			layout?: EntitiesListLayout
			showSummary?: boolean
			panelStyle?: string
			CollapsibleProps?: CollapsibleForwardProps
			Empty?: Snippet
			entityType: _EntityType
			getKey?: (item: _Item) => _Key
			getSortValue?: (item: _Item) => number | string
			HeadingProps?: HeadingForwardProps
			href: string
			id: string
			Item?: Snippet<[ListItemProps]>
			items?: Set<_Item>
			open?: boolean
			placeholderText?: string
			query?: QueryLike<unknown>
			placeholderKeys?: Set<_Key>
			title: string
			UnorderedListProps?: UnorderedListForwardProps
		},
		SvelteHTMLElements['article']
	> = $props()

	const onNestedCollapsibleClose = getOnNestedCollapsibleClose()
	
	
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
	const emptyItems = new SvelteSet<number>()
	const emptyPlaceholderKeys = new SvelteSet<number>()

	if (collapsible === false) {
		incrementHeadingLevel()
	}

	let listSummary = $state({
		loaded: 0,
		total: undefined as number | undefined,
	})

	const loadedCount = $derived(
		items !== undefined ?
			listSummary.loaded
		:
			undefined,
	)

	const totalCount = $derived(
		listSummary.total,
	)

	const showCounts = $derived(
		loadedCount !== undefined || totalCount !== undefined,
	)

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

	{#snippet SummaryHeader()}
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

	{#snippet SummaryAnnotation()}
		<span data-text="annotation">{entityDefinitionByType[entityType].labelPlural}</span>
	{/snippet}

	{#snippet ListRows()}
		<UnorderedList
			items={items!}
			{placeholderKeys}
			bind:summary={
				() => listSummary,
				(_listSummary) => { listSummary = _listSummary }
			}
			getKey={getKey!}
			getSortValue={getSortValue!}
			Item={Item!}
			{...UnorderedListProps}
			{...{
				...layout === EntitiesListLayout.Carousel && {
					orientation: ListOrientation.Row,
					'data-scroll-container': 'inline layout-carousel carousel-marker-tabs',
					'data-row': 'start align-start',
					style: panelStyle ?? '--carousel-basis: min(40ch, 88cqi); gap: 0.5em',
				}
			}}
		>
			{#snippet Empty()}
				{@render EmptyFallback()}
			{/snippet}
		</UnorderedList>
	{/snippet}

	{#snippet listColumnBody()}
		{#if body}
			{@render body()}
		{:else if items !== undefined && getKey !== undefined && getSortValue !== undefined && Item !== undefined}
			{#if query !== undefined}
				<QueryBoundary
					{query}
					placeholderText={placeholderText ?? `Loading ${entityDefinitionByType[entityType].labelPlural.toLowerCase()}…`}
				>
					{#snippet children(queryRows)}
						{#key queryRows}
							{@render ListRows()}
						{/key}
					{/snippet}
				</QueryBoundary>
			{:else}
				{@render ListRows()}
			{/if}
		{:else}
			{@render EmptyFallback()}
		{/if}
	{/snippet}

	{#if !showSummary}
		<div
			{...{ 'data-card': 'padding-5 radius-4' }}
		>
			{@render listColumnBody()}
		</div>
	{:else if collapsible}
		<Collapsible
			bind:open
			{...CollapsibleProps}
			onclose={(_closeId) => {
				if (!getIsInsidePage())
					onNestedCollapsibleClose?.(id)
				CollapsibleProps.onclose?.(_closeId)
			}}
			{...{ 'data-card': '' }}
		>
			{#snippet Summary()}
				{@render SummaryHeader()}
			{/snippet}

			{#snippet Annotation()}
				{@render SummaryAnnotation()}
			{/snippet}

			{@render listColumnBody()}
		</Collapsible>
	{:else}
		<div
			{...{ 'data-card': '' }}
			data-scroll-container="block snap-block"
			style={panelStyle}
		>
			<div data-sticky>
				<div
					data-row-item="flexible"
					data-row="align-center wrap"
				>
					{@render SummaryHeader()}

					<div data-row="wrap">
						{@render SummaryAnnotation()}
					</div>
				</div>
			</div>

			<div
				data-column
				data-sticky-container
			>
				{@render listColumnBody()}
			</div>
		</div>
	{/if}
</article>


<style>
	.entity-details {
		display: contents;
	}
</style>
