<script module lang="ts">
	export enum EntityLayout {
		Id = 'Id',
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

		/** Override `text/plain` when dragging the default `Id` summary heading; default is `stringify(entityId)`. */
		idDragPlainText,

		layout = EntityLayout.SummaryDetails,
		showTypeAnnotation = !(isInsideEntityList ?? false),

		open = $bindable(layout === EntityLayout.SummaryDetails),
		ontoggle,

		Id,
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

			open?: boolean
			ontoggle?: (e: Event) => void

			Id?: Snippet
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

	/** Type label beside / before id in `EntitySummary` — not on list rows (list already homogenous). */
	const showEntitySummaryTypeIdPrefix = $derived(
		!showTypeAnnotation && !(isInsideEntityList ?? false),
	)


	// Functions
	import { stringify } from 'devalue'


	// Components
	import Collapsible from '$/components/Collapsible.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import EntitySummary from './EntitySummary.svelte'
</script>


{#if layout === EntityLayout.Id}
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
			showEntityTypeIdPrefix={showEntitySummaryTypeIdPrefix}
			{Icon}
			{Heading}
			{Id}
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
			showEntityTypeIdPrefix={showEntitySummaryTypeIdPrefix}
			{Icon}
			{Heading}
			{Id}
			{HeadingAfter}
		>
			{#snippet children({
				title,
				href,
			})}
				{#if Content}
					{@render Content({
						title,
						href,
						open: true,
					})}
				{/if}
			{/snippet}
		</EntitySummary>

		{#if showTypeAnnotation}
			<div data-row="wrap">
				{#if TypeAnnotationTooltip}
					<Tooltip contentProps={{ side: 'top' }}>
						{#snippet Content()}
							{@render TypeAnnotationTooltip()}
						{/snippet}
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
		{#snippet Annotation()}
			{#if TypeAnnotationTooltip}
				<Tooltip contentProps={{ side: 'top' }}>
					{#snippet Content()}
						{@render TypeAnnotationTooltip()}
					{/snippet}
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
			{#snippet Summary({
				open,
			})}
				<EntitySummary
					{entityType}
					{entityId}
					{title}
					{href}
					{idDragPlainText}
					showEntityTypeIdPrefix={showEntitySummaryTypeIdPrefix}
					{Icon}
					{Heading}
					{Id}
					{HeadingAfter}
				>
					{#snippet children({
						title,
						href,
					})}
						{#if Content && !open}
							{@render Content({
								title,
								href,
								open,
							})}
						{/if}
					{/snippet}
				</EntitySummary>
			{/snippet}

			{#snippet children({ open })}
				{#if (
					_Details
					&& open
					&& (
						layout === EntityLayout.Summary
						|| layout === EntityLayout.SummaryDetails
					)
				)}
					<div data-column>
						{#if Content && open}
							{@render Content({
								title,
								href,
								open,
							})}
						{/if}

						{@render _Details({
							open,
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
