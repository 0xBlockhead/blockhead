<script lang="ts">
	// Types/constants
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/$EntityType.ts'


	// State
	import type { Snippet } from 'svelte'

	let {
		children,
		sourceId,
		href,
		open = $bindable(true),
	}: {
		children?: Snippet
		sourceId: string
		href: string
		open?: boolean
	} = $props()

	const entityId = $derived.by((): EntityId<EntityType.BlockheadSource> => (
		{ id: sourceId }
	))


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadSource}
	{entityId}
	title={'Source'}
	{href}
	{open}
>
	{#snippet Details()}
		{#if children}
			{@render children()}
		{:else}
			<EntityDetails
				entityType={EntityType.BlockheadSource}
				{entityId}
			>
				<p>–</p>
			</EntityDetails>
		{/if}
	{/snippet}
</EntityView>
