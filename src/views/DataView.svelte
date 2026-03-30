<script lang="ts">
	// Types/constants
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/$EntityType.ts'


	// State
	import type { Snippet } from 'svelte'

	let {
		children,
		entityId,
		href,
		open = $bindable(true),
	}: {
		children?: Snippet
		entityId: EntityId<EntityType.BlockheadEntityCollection>
		href: string
		open?: boolean
	} = $props()


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadEntityCollection}
	{entityId}
	title={'Data'}
	{href}
	{open}
>
	{#snippet Details()}
		{#if children}
			{@render children()}
		{:else}
			<EntityDetails
				entityType={EntityType.BlockheadEntityCollection}
				{entityId}
			>
				<p>–</p>
			</EntityDetails>
		{/if}
	{/snippet}
</EntityView>
