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
		/** `text/plain` for `Id` drag; default `stringify(entityId)`. */
		idDragPlainText?: string
		Icon?: Snippet
		Heading?: Snippet
		Id?: Snippet
		HeadingAfter?: Snippet
		children?: Snippet<[{
			title: string
			href?: string
		}]>
	} = $props()

	const title = $derived(
		_title ?? entityDefinitionByType[entityType].label
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
	data-row="wrap gap-4"
	style:view-transition-name={`EntitySummary-${stringify(entityId)}`}
>
	{#if Icon}
		{@render Icon()}
	{/if}

	<div
		data-row-item="flexible"
		data-row="wrap"
	>
		<div data-row="start wrap">
			{#if Heading}
				{@render Heading()}
			{:else if Id}
				<HeadingComponent>
					{#if href}
						<a
							class="entity-summary-id-draggable"
							{href}
							draggable={true}
							ondragstart={onIdDragStart}
						>
							{@render Id()}
						</a>
					{:else}
						<span
							class="entity-summary-id-draggable"
							role="group"
							draggable={true}
							ondragstart={onIdDragStart}
						>
							{@render Id()}
						</span>
					{/if}
				</HeadingComponent>
			{:else}
				<HeadingComponent>
					{#if href}
						<a href={href}>
							{title}
						</a>
					{:else}
						{title}
					{/if}
				</HeadingComponent>
			{/if}

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
