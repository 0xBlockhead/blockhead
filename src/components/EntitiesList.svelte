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
	import { entityDefinitionByType } from '$/schema/$schema.ts'
	import type { ComponentProps, Snippet } from 'svelte'
	import type { SvelteHTMLElements } from 'svelte/elements'
	import type { WithRest } from '$/typescript/WithRest.ts'

	import Collapsible from '$/components/Collapsible.svelte'
	import Heading from '$/components/Heading.svelte'
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import UnorderedList from '$/components/UnorderedList.svelte'

	type QueryLike = {
		data: unknown
		isError: boolean
		isLoading: boolean
		error?: unknown
	}

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
	import { getOnNestedCollapsibleClose } from '$/context/onNestedCollapsibleClose.ts'


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
			query?: QueryLike
			placeholderKeys?: Set<_Key>
			title: string
			UnorderedListProps?: UnorderedListForwardProps
		},
		SvelteHTMLElements['article']
	> = $props()

	const onNestedCollapsibleClose = getOnNestedCollapsibleClose()

	const emptyItems = new SvelteSet<number>()
	const emptyPlaceholderKeys = new SvelteSet<number>()

	const defaultListPlaceholder = $derived(
		`Loading ${entityDefinitionByType[entityType].labelPlural.toLowerCase()}…`,
	)
</script>


<article
	{id}
	{...articleElementProps}
	style:view-transition-name={`EntitiesList-${id}`}
>
	<Collapsible
		bind:open
		{...CollapsibleProps}
		onclose={(_closeId) => {
			onNestedCollapsibleClose?.(id)
			CollapsibleProps.onclose?.(_closeId)
		}}
		{...{ 'data-card': '' }}
	>
		{#snippet Summary()}
			<header
				data-row-item="flexible"
				data-row="wrap gap-4"
				style:view-transition-name={`EntitiesList-Summary-${id}`}
			>
				<Heading {...HeadingProps}>
					<a {href}>{title}</a>
				</Heading>
			</header>
		{/snippet}

		{#snippet Annotation()}
			<span data-text="annotation">{entityDefinitionByType[entityType].labelPlural}</span>
		{/snippet}

		{#if body}
			{@render body()}
		{:else if query != null && items != null && getKey != null && getSortValue != null && Item != null}
			<QueryBoundary
				query={query}
				placeholderText={placeholderText ?? defaultListPlaceholder}
			>
				{#snippet children(queryRows)}
					{#key queryRows}
						<UnorderedList
							{items}
							{placeholderKeys}
							{getKey}
							{getSortValue}
							{Item}
							{...UnorderedListProps}
						>
							{#snippet Empty()}
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
						</UnorderedList>
					{/key}
				{/snippet}
			</QueryBoundary>
		{:else if items != null && getKey != null && getSortValue != null && Item != null}
			<UnorderedList
				{items}
				{placeholderKeys}
				{getKey}
				{getSortValue}
				{Item}
				{...UnorderedListProps}
			>
				{#snippet Empty()}
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
			</UnorderedList>
		{:else}
			<UnorderedList
				items={emptyItems}
				placeholderKeys={emptyPlaceholderKeys}
				getKey={(k) => k}
				getSortValue={(k) => k}
			>
				{#snippet Item()}
					<span aria-hidden="true"></span>
				{/snippet}

				{#snippet Empty()}
					<div
						class="entity-details"
						style:view-transition-name={`EntitiesList-Details-${id}`}
					>
						<p>–</p>
					</div>
				{/snippet}
			</UnorderedList>
		{/if}
	</Collapsible>
</article>


<style>
	article {
		:global {
			[data-columns] {
				> section {
					break-after: column;

					> details[data-scroll-container] {
						--scrollContainer-sizeBlock: calc(80cqb - 6rem);
					}
				}
			}
		}
	}

	.entity-details {
		display: contents;
	}
</style>
