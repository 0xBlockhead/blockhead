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
		entityId: EntityId<EntityType.EvmCalldata>
		href: string
		open?: boolean
	} = $props()


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmCalldata}
	{entityId}
	title={'Calldata'}
	{href}
	{open}
>
	{#snippet Details()}
		{#if children}
			{@render children()}
		{:else}
			<EntityDetails
				entityType={EntityType.EvmCalldata}
				{entityId}
			>
				<p>–</p>
			</EntityDetails>
		{/if}
	{/snippet}
</EntityView>
