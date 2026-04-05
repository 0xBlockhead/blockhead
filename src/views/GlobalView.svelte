<script lang="ts">
	// Types/constants
	import type { EntityId } from '$/schema/$schema.ts'
	import type { Snippet } from 'svelte'


	// State
	import { EntityType } from '$/schema/$EntityType.ts'


	// Props
	let {
		children,
		entityId,
		title,
		href,
		open = $bindable(true),
	}: {
		children?: Snippet
		entityId: EntityId<EntityType._Global>
		title: string
		href: string
		open?: boolean
	} = $props()


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntityView
	entityType={EntityType._Global}
	{entityId}
	{title}
	{href}
	{open}
>
	{#snippet Details()}
		{#if children}
			{@render children()}
		{:else}
			<EntityDetails
				entityType={EntityType._Global}
				{entityId}
			>
				<p>–</p>
			</EntityDetails>
		{/if}
	{/snippet}
</EntityView>
