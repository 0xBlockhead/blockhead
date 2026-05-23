<script lang="ts">
	// Types/constants
	import type { Snippet } from 'svelte'
	// Reserved pass-through wrapper for route-level composition (`NetworkView` is the canonical implementation).
	import { EntityLayout } from '$/components/EntityView.svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Props
	let {
		children,
		entityId,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		HeadingTitle,
	}: {
		children?: Snippet
		entityId: EntityId<typeof schema, EntityType.Network>
		href: string
		layout?: EntityLayout
		open?: boolean
		HeadingTitle?: Snippet
	} = $props()


	// Components
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<div style="display: contents;">
	<NetworkView
		{children}
		{entityId}
		{href}
		bind:open
		{layout}
		{HeadingTitle}
	/>
</div>
