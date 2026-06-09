<script module lang="ts">
	export enum EntityLayout {
		/** Value-only identity (`#snippet Value`); use when a parent `<dt>` already names the kind. */
		Value = 'Value',
		/** Kind prefix + identity (`#snippet Title`); default card / prose inline. */
		Title = 'Title',
		/** Collapsible card: summary row; details when open. */
		SummaryDetails = 'SummaryDetails',
		/** Alias for nested list rows that pass `open={false}` on the summary card. */
		Summary = 'Summary',
		/**
		 * Same identity row as the summary row, without `article` or nested `Collapsible`
		 * (e.g. nested under `ParentPageCollapsible`).
		 */
		SummaryInline = 'SummaryInline',
	}
</script>


<script
	lang="ts"
	generics="
		_EntityType extends EntityType
	"
>
	// Types/constants
	import type { EntityType } from '$/schema/EntityType.ts'
	import type { EntityId } from '$/schema/$schema.ts'
	import { entityDefinitionByType, schema } from '$/schema/index.ts'


	// Context
	import { getIsInsideEntityList, setIsInsideEntityList } from '$/context/isInsideEntityList.ts'
	import { getIsInsidePage } from '$/context/isInsidePage.ts'
	import { getOnNestedCollapsibleClose } from '$/context/onNestedCollapsibleClose.ts'

	const isInsideEntityList = getIsInsideEntityList()
	setIsInsideEntityList(false)
	const isInsidePage = getIsInsidePage()
	const onNestedCollapsibleClose = getOnNestedCollapsibleClose()


	import type { ComponentProps, Snippet } from 'svelte'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import type { SvelteHTMLElements } from 'svelte/elements'

	type EntityViewLayoutProps = {
		layout?: EntityLayout
		showTypeAnnotation?: boolean
	}

	// State
	let {
		entityType,
		entityId,

		title,
		href,

		/** Override `text/plain` when dragging the default title row; default is `stringify(entityId)`. */
		idDragPlainText,

		layout = EntityLayout.SummaryDetails,
		collapsible = true,
		showTypeAnnotation = !(isInsideEntityList ?? false),

		open = $bindable(
			layout === EntityLayout.SummaryDetails
			&& !(isInsideEntityList ?? false),
		),
		ontoggle,

		Icon,
		Value,
		Title,
		HeadingAfter,
		TypeAnnotationTooltip,
		Content,
		CollapsibleProps,
		Details,

		...articleProps
	}: WithRest<
		{
			entityType: _EntityType
			entityId: EntityId<typeof schema, _EntityType>

			title?: string
			href?: string
			idDragPlainText?: string

			open?: boolean
			ontoggle?: (e: Event) => void
			collapsible?: boolean

			Icon?: Snippet
			/** Value-only identity; used when `layout` is `EntityLayout.Value`. */
			Value?: Snippet
			Title?: Snippet
			HeadingAfter?: Snippet
			/** Tooltip body (e.g. `<p>` paragraphs) shown when hovering the entity type label; omitted when `showTypeAnnotation` is false. */
			TypeAnnotationTooltip?: Snippet
			Content?: Snippet<[context: {
				title?: string
				href?: string
				open?: boolean
			}]>
			CollapsibleProps?: ComponentProps<typeof Collapsible>
			Details?: Snippet<[context: {
				open?: boolean
			}]>
		} & EntityViewLayoutProps,
		SvelteHTMLElements['article']
	> = $props()

	const entityTitle = $derived(
		title ?? entityDefinitionByType[entityType].label,
	)


	// Functions
	import { stringify } from 'devalue'


	// Components
	import Collapsible from '$/components/Collapsible.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import EntityIdComponent from './EntityId.svelte'
	import EntityDetails from './EntityDetails.svelte'
</script>


{#snippet CardSummaryHeader(context?: {
	summaryOpen?: boolean
	showCollapsedContent?: boolean
	contentOpen?: boolean
})}
	{@const summaryOpen = context?.summaryOpen ?? false}
	{@const showCollapsedContent = context?.showCollapsedContent ?? false}
	{@const contentOpen = context?.contentOpen ?? summaryOpen}
	<header
		class="entity-view-summary"
		data-row-item="flexible"
		data-row="wrap gap-2"
	>
		<div
			data-row-item="flexible"
			data-row="wrap"
		>
			<div data-row="start wrap">
				<HeadingComponent>
					<EntityIdComponent
						{entityId}
						{href}
						{idDragPlainText}
						{Icon}
					>
						{#snippet children()}
							{#if Title}
								{@render Title()}
							{:else if Value}
								{@render Value()}
							{:else}
								{entityTitle}
							{/if}
						{/snippet}
					</EntityIdComponent>
				</HeadingComponent>

				{#if HeadingAfter}
					{@render HeadingAfter()}
				{/if}
			</div>

			{#if showCollapsedContent && Content && !summaryOpen}
				{@render Content({
					title,
					href,
					open: contentOpen,
				})}
			{/if}
		</div>
	</header>
{/snippet}


{#if layout === EntityLayout.Title || layout === EntityLayout.Value}
	<span
		data-row-item="flexible"
		data-row="inline align-center wrap"
	>
		<EntityIdComponent
			{entityId}
			{href}
			{idDragPlainText}
			{Icon}
		>
			{#snippet children()}
				{#if layout === EntityLayout.Value}
					{#if Value}
						{@render Value()}
					{:else if Title}
						{@render Title()}
					{:else}
						{entityTitle}
					{/if}
				{:else if layout === EntityLayout.Title}
					{#if Title}
						{@render Title()}
					{:else if entityTitle}
						{entityTitle}
					{:else if Value}
						{@render Value()}
					{/if}
				{/if}
			{/snippet}
		</EntityIdComponent>
	</span>

{:else if layout === EntityLayout.SummaryInline}
	<div
		data-row-item="flexible"
		data-row="align-center wrap"
	>
		{@render CardSummaryHeader({
			showCollapsedContent: true,
			contentOpen: true,
		})}

		{#if showTypeAnnotation}
			<div data-row="wrap">
				{#if TypeAnnotationTooltip}
					<Tooltip
						contentProps={{ side: 'top' }}
						Content={TypeAnnotationTooltip}
					>
						{#snippet children()}
							<span data-text="annotation">{entityDefinitionByType[entityType].label}</span>
						{/snippet}
					</Tooltip>
				{:else}
					<span data-text="annotation">{entityDefinitionByType[entityType].label}</span>
				{/if}
			</div>
		{/if}
	</div>

{:else}
	<article
		data-column-item="flexible"
		data-column
		{...articleProps}
		id={stringify(entityId)}
		style:view-transition-name={`EntityView-${stringify(entityId)}`}
	>
		{#snippet Annotation()}
			{#if TypeAnnotationTooltip}
				<Tooltip
					contentProps={{ side: 'top' }}
					Content={TypeAnnotationTooltip}
				>
					{#snippet children()}
						<span data-text="annotation">{entityDefinitionByType[entityType].label}</span>
					{/snippet}
				</Tooltip>
			{:else}
				<span data-text="annotation">{entityDefinitionByType[entityType].label}</span>
			{/if}
		{/snippet}

		<Collapsible
			bind:open
			canToggle={collapsible}
			{ontoggle}
			onclose={() => {
				if (!isInsidePage)
					onNestedCollapsibleClose?.(stringify(entityId))
			}}
			data-column-item="flexible"
			data-card
			{...CollapsibleProps}
			Annotation={showTypeAnnotation ? Annotation : undefined}
		>
			{#snippet Summary({ open })}
				{@render CardSummaryHeader({
					summaryOpen: open ?? false,
					showCollapsedContent: true,
				})}
			{/snippet}

			{#snippet children({ open })}
				{#if Details && open}
					<EntityDetails
						{entityType}
						{entityId}
					>
						{#if Content && open}
							{@render Content({
								title,
								href,
								open,
							})}
						{/if}

						{@render Details({
							open,
						})}
					</EntityDetails>
				{/if}
			{/snippet}
		</Collapsible>
	</article>
{/if}


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

			[data-scroll-container~='layout-carousel'] {
				> section {
					> details[data-scroll-container] {
						--scrollContainer-sizeBlock: calc(80cqb - 6rem);
					}
				}
			}
		}
	}
</style>
