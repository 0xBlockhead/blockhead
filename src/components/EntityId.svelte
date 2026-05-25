<script lang="ts">
	// Types/constants
	import type { EntityId as SchemaEntityId, EntityType as SchemaEntityType } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { stringify } from 'devalue'
	import type { Snippet } from 'svelte'


	// Props
	let {
		entityId,
		href,
		idDragPlainText,
		Icon,
		children,
	}: {
		entityId: SchemaEntityId<typeof schema, SchemaEntityType<typeof schema>>
		href?: string
		/** `text/plain` for drag; default `stringify(entityId)`. */
		idDragPlainText?: string
		Icon?: Snippet
		children: Snippet
	} = $props()


	// Inner context
	const onDragStart = (e: DragEvent) => {
		e.dataTransfer?.setData('text/plain', idDragPlainText ?? stringify(entityId))
		if (href !== undefined && href.length > 0) {
			e.dataTransfer?.setData('text/uri', href)
		}
	}
</script>


{#if href}
	<a
		class="entity-id-draggable"
		{href}
		draggable={true}
		ondragstart={onDragStart}
		style:view-transition-name={`EntityId-${stringify(entityId)}`}
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
		role="group"
		draggable={true}
		ondragstart={onDragStart}
		style:view-transition-name={`EntityId-${stringify(entityId)}`}
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
