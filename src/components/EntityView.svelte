<script module lang="ts">
	export enum EntityLayout {
		Title = 'Title',
		/** Collapsible card: summary row; details when open. */
		Summary = 'Summary',
		/**
		 * Same `EntitySummary` markup as the summary row, without `article` or nested `Collapsible`
		 * (e.g. nested under `ParentPageCollapsible`).
		 */
		SummaryInline = 'SummaryInline',
		Details = 'Details',
		SummaryDetails = 'SummaryDetails',
	}
</script>


<script
	lang="ts"
	generics="
		_EntityType extends EntityType
	"
>
	// Types/constants
	import type { EntityType } from '$/schema/$EntityType.ts'
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


	// State
	import type { ComponentProps, Snippet } from 'svelte'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import type { SvelteHTMLElements } from 'svelte/elements'

	let {
		entityType,
		entityId,

		title,
		href,

		/** Override `text/plain` when dragging the default title row; default is `stringify(entityId)`. */
		idDragPlainText,

		layout = EntityLayout.SummaryDetails,
		showTypeAnnotation = !(isInsideEntityList ?? false),
		/** Collapsible summary row uses `#snippet Heading` instead of `#snippet Title`. */
		summaryUsesHeading = false,

		open = $bindable(layout === EntityLayout.SummaryDetails),
		ontoggle,

		Title,
		Icon,
		Heading,
		HeadingAfter,
		TypeAnnotationTooltip,
		Content,
		CollapsibleProps,
		Details: _Details,

		...articleProps
	}: WithRest<
		{
			entityType: _EntityType
			entityId: EntityId<typeof schema, _EntityType>

			title?: string
			href?: string
			idDragPlainText?: string

			layout?: EntityLayout
			showTypeAnnotation?: boolean
			summaryUsesHeading?: boolean

			open?: boolean
			ontoggle?: (e: Event) => void

			Title?: Snippet
			Icon?: Snippet
			Heading?: Snippet
			HeadingAfter?: Snippet
			/** Tooltip body (e.g. `<p>` paragraphs) shown when hovering the entity type label; omitted when `showTypeAnnotation` is false. */
			TypeAnnotationTooltip?: Snippet
			Content?: Snippet<[context?: {
				title?: string
				href?: string
				open?: boolean
			}]>
			CollapsibleProps?: ComponentProps<typeof Collapsible>
			Details?: Snippet<[context?: {
				open?: boolean
			}]>
		},
		SvelteHTMLElements['article']
	> = $props()

	/** Type label only via collapsible annotation — never prefixed on title rows. */
	const showEntitySummaryTypeTitlePrefix = false


	// Functions
	import { stringify } from 'devalue'


	// Components
	import Collapsible from '$/components/Collapsible.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import EntitySummary from './EntitySummary.svelte'
</script>


{#if layout === EntityLayout.Title}
	<div
		data-row-item="flexible"
		data-row="align-center wrap"
	>
		<EntitySummary
			entityType={entityType}
			entityId={entityId}
			{title}
			{href}
			{idDragPlainText}
			showEntityTypeTitlePrefix={showEntitySummaryTypeTitlePrefix}
			useHeading={false}
			{Icon}
			{Heading}
			{Title}
			{HeadingAfter}
		/>
	</div>

{:else if layout === EntityLayout.SummaryInline}
	<div
		data-row-item="flexible"
		data-row="align-center wrap"
	>
		<EntitySummary
			entityType={entityType}
			entityId={entityId}
			{title}
			{href}
			{idDragPlainText}
			showEntityTypeTitlePrefix={showEntitySummaryTypeTitlePrefix}
			summaryUsesHeading={summaryUsesHeading}
			{Icon}
			{Heading}
			{Title}
			{HeadingAfter}
		>
			{#snippet children(_context)}
				{#if Content}
					{@render Content({
						title: _context?.title,
						href: _context?.href,
						open: true,
					})}
				{/if}
			{/snippet}
		</EntitySummary>

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

{:else if layout === EntityLayout.Details}
	<div data-column>
		{#if Content}
			{@render Content({
				title,
				href,
				open: true,
			})}
		{/if}

		{#if _Details}
			{@render _Details({
				open: true,
			})}
		{/if}
	</div>

{:else}
	<article
		{...articleProps}
		id={stringify(entityId)}
		style:view-transition-name={`EntityView-${stringify(entityId)}`}
	>
		{#snippet Annotation(_context)}
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
			{ontoggle}
			onclose={() => {
				if (!isInsidePage)
					onNestedCollapsibleClose?.(stringify(entityId))
			}}
			{...{
				'data-card': '',
				...CollapsibleProps,
			}}
			Annotation={showTypeAnnotation ? Annotation : undefined}
		>
			{#snippet Summary(_context)}
				{@const summaryOpen = _context?.open ?? false}
				<EntitySummary
					{entityType}
					{entityId}
					{title}
					{href}
					{idDragPlainText}
					showEntityTypeTitlePrefix={showEntitySummaryTypeTitlePrefix}
					summaryUsesHeading={summaryUsesHeading}
					{Icon}
					{Heading}
					{Title}
					{HeadingAfter}
				>
					{#snippet children(_childContext)}
						{#if Content && !summaryOpen}
							{@render Content({
								title: _childContext?.title,
								href: _childContext?.href,
								open: summaryOpen,
							})}
						{/if}
					{/snippet}
				</EntitySummary>
			{/snippet}

			{#snippet children(_context)}
				{@const detailsOpen = _context?.open ?? false}
				{#if (
					_Details
					&& detailsOpen
					&& (
						layout === EntityLayout.Summary
						|| layout === EntityLayout.SummaryDetails
					)
				)}
					<div data-column>
						{#if Content && detailsOpen}
							{@render Content({
								title,
								href,
								open: detailsOpen,
							})}
						{/if}

						{@render _Details({
							open: detailsOpen,
						})}
					</div>
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
