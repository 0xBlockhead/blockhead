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
		showEntityTypeIdPrefix = false,
		Icon,
		Heading,
		Id,
		HeadingAfter,
		children: _children,
	}: {
		entityType: _EntityType
		entityId: EntityId<typeof schema, SchemaEntityType<typeof schema>>
		title?: string
		href?: string
		/** `text/plain` for summary drag; default `stringify(entityId)`. */
		idDragPlainText?: string
		/** Prefix secondary (or primary fallback) id with the entity type label (e.g. in lists). */
		showEntityTypeIdPrefix?: boolean
		Icon?: Snippet
		Heading?: Snippet
		Id?: Snippet
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


	// Functions
	const onIdDragStart = (e: DragEvent) => {
		e.dataTransfer?.setData('text/plain', idDragPlainText ?? stringify(entityId))
		if (href !== undefined && href.length > 0) {
			e.dataTransfer?.setData('text/uri', href)
		}
	}


	// Components
	import HeadingComponent from './Heading.svelte'
</script>


<header
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
			<HeadingComponent>
				{#if href}
					<a
						class="entity-summary-id-draggable"
						{href}
						draggable={true}
						ondragstart={onIdDragStart}
					>
						<span data-row="inline wrap align-center gap-2">
							{#if Icon}
								{@render Icon()}
							{/if}
							<span>
								{#if Heading}
									{@render Heading()}
								{:else if Id}
									{#if showEntityTypeIdPrefix}
										<span data-text="annotation">{entityTypeLabel}</span>
									{/if}
									{@render Id()}
								{:else}
									{title}
								{/if}
							</span>
						</span>
					</a>
				{:else}
					<span
						class="entity-summary-id-draggable"
						role="group"
						draggable={true}
						ondragstart={onIdDragStart}
					>
						<span data-row="inline wrap align-center gap-2">
							{#if Icon}
								{@render Icon()}
							{/if}
							<span>
								{#if Heading}
									{@render Heading()}
								{:else if Id}
									{#if showEntityTypeIdPrefix}
										<span data-text="annotation">{entityTypeLabel}</span>
									{/if}
									{@render Id()}
								{:else}
									{title}
								{/if}
							</span>
						</span>
					</span>
				{/if}
			</HeadingComponent>

			{#if HeadingAfter}
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
</header>
