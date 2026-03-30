<script lang="ts">
	// Types/constants
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/$EntityType.ts'


	// State
	import type { Snippet } from 'svelte'

	let {
		children,
		entityId,
		title = 'Transaction',
		href,
		open = $bindable(true),
	}: {
		children?: Snippet
		entityId: EntityId<EntityType.EvmTransaction>
		title?: string
		href: string
		open?: boolean
	} = $props()


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmTransaction}
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
				entityType={EntityType.EvmTransaction}
				{entityId}
			>
				<p>–</p>
			</EntityDetails>
		{/if}
	{/snippet}
</EntityView>
