<script module lang="ts">
	export const entityDragDataType = 'application/x-blockhead-entity'
</script>


<script
	lang="ts"
	generics="
		_EntityType extends SchemaEntityType<typeof schema>
	"
>
	// Types/constants
	import type { EntitySelector as SchemaEntitySelector, EntityType as SchemaEntityType } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { stringify } from 'devalue'
	import type { Snippet } from 'svelte'


	// State
	let {
		entityType,
		entitySelector,
		href,
		idDragPlainText,
		Icon,
		children,
	}: {
		entityType: _EntityType
		entitySelector: SchemaEntitySelector<typeof schema, _EntityType>
		href?: string
		/** `text/plain` for drag. Omit when no display-safe value is available. */
		idDragPlainText?: string
		Icon?: Snippet
		children: Snippet
	} = $props()


	// Inner context
	const onDragStart = (e: DragEvent) => {
		e.dataTransfer?.setData(entityDragDataType, stringify({
			entityType,
			entitySelector,
		}))

		if (idDragPlainText !== undefined && idDragPlainText.length > 0)
			e.dataTransfer?.setData('text/plain', idDragPlainText)

		if (href !== undefined && href.length > 0) {
			e.dataTransfer?.setData('text/uri-list', href)
		}
	}
</script>


{#if href}
	<a
		class="entity-id-draggable"
		{href}
		draggable={true}
		ondragstart={onDragStart}
		style:view-transition-name={`EntitySelector-${stringify(entitySelector)}`}
	>
		<span data-row="inline wrap align-center gap-2">
			{#if Icon}
				{@render Icon()}
			{/if}
			<span>
				{@render children()}
			</span>
		</span>
	</a>
{:else}
	<span
		class="entity-id-draggable"
		role="none"
		draggable={true}
		ondragstart={onDragStart}
		style:view-transition-name={`EntitySelector-${stringify(entitySelector)}`}
	>
		<span data-row="inline wrap align-center gap-2">
			{#if Icon}
				{@render Icon()}
			{/if}
			<span>
				{@render children()}
			</span>
		</span>
	</span>
{/if}
