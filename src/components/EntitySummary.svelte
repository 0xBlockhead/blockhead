<script
	lang="ts"
	generics="_EntityType extends EntityType"
>
	// Types/constants
	import type { EntityId, EntityType as SchemaEntityType } from '$/schema/$schema.ts'
	import { entityDefinitionByType, schema } from '$/schema/index.ts'
	import type { EntityType } from '$/schema/$EntityType.ts'
	import { stringify } from 'devalue'
	import type { Snippet } from 'svelte'


	// State
	let {
		entityType,
		entityId,
		title: _title,
		href,
		idDragPlainText,
		showEntityTypeTitlePrefix = false,
		useHeading = true,
		summaryUsesHeading = false,
		Icon,
		Heading,
		Title,
		HeadingAfter,
		children: _children,
	}: {
		entityType: _EntityType
		entityId: EntityId<typeof schema, SchemaEntityType<typeof schema>>
		title?: string
		href?: string
		/** `text/plain` for summary drag; default `stringify(entityId)`. */
		idDragPlainText?: string
		/** Prefix secondary (or primary fallback) title with the entity type label (e.g. in lists). */
		showEntityTypeTitlePrefix?: boolean
		/** Card / page summaries use `<Heading>`; inline `<dl>` refs do not. */
		useHeading?: boolean
		/** Collapsible summary row uses `#snippet Heading` instead of `#snippet Title`. */
		summaryUsesHeading?: boolean
		Icon?: Snippet
		Heading?: Snippet
		Title?: Snippet
		HeadingAfter?: Snippet
		children?: Snippet<[context?: {
			title?: string
			href?: string
		}]>
	} = $props()

	const title = $derived(
		_title ?? entityDefinitionByType[entityType].label,
	)

	const entityTypeLabel = $derived(
		entityDefinitionByType[entityType].label,
	)

	const summaryPrefersHeading = $derived(
		useHeading && summaryUsesHeading,
	)


	// Functions
	const onTitleDragStart = (e: DragEvent) => {
		e.dataTransfer?.setData('text/plain', idDragPlainText ?? stringify(entityId))
		if (href !== undefined && href.length > 0) {
			e.dataTransfer?.setData('text/uri', href)
		}
	}


	// Components
	import HeadingComponent from './Heading.svelte'
</script>


{#snippet TitleDraggable()}
	{#if href}
		<a
			class="entity-summary-title-draggable"
			{href}
			draggable={true}
			ondragstart={onTitleDragStart}
		>
			<span data-row="inline wrap align-center gap-2">
				{#if Icon}
					{@render Icon()}
				{/if}
				<span>
					{#if summaryPrefersHeading && Heading}
						{@render Heading()}
					{:else if Title}
						{#if showEntityTypeTitlePrefix}
							<span data-text="annotation">{entityTypeLabel}</span>
						{/if}
						{@render Title()}
					{:else if Heading}
						{@render Heading()}
					{:else}
						{title}
					{/if}
				</span>
			</span>
		</a>
	{:else}
		<span
			class="entity-summary-title-draggable"
			role="group"
			draggable={true}
			ondragstart={onTitleDragStart}
		>
			<span data-row="inline wrap align-center gap-2">
				{#if Icon}
					{@render Icon()}
				{/if}
				<span>
					{#if summaryPrefersHeading && Heading}
						{@render Heading()}
					{:else if Title}
						{#if showEntityTypeTitlePrefix}
							<span data-text="annotation">{entityTypeLabel}</span>
						{/if}
						{@render Title()}
					{:else if Heading}
						{@render Heading()}
					{:else}
						{title}
					{/if}
				</span>
			</span>
		</span>
	{/if}
{/snippet}


<svelte:element
	this={useHeading ? 'header' : 'div'}
	class="entity-summary"
	data-row-item="flexible"
	data-row="wrap gap-2"
	style:view-transition-name={`EntitySummary-${stringify(entityId)}`}
>
	<div
		data-row-item="flexible"
		data-row="wrap"
	>
		<div data-row="start wrap">
			{#if useHeading}
				<HeadingComponent>
					{@render TitleDraggable()}
				</HeadingComponent>
			{:else}
				{@render TitleDraggable()}
			{/if}

			{#if useHeading && HeadingAfter}
				{@render HeadingAfter()}
			{/if}
		</div>

		{#if _children}
			{@render _children({
				title,
				href,
			})}
		{/if}
	</div>
</svelte:element>
