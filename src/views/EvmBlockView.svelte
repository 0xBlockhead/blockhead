<script lang="ts">
	// Types/constants
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/$EntityType.ts'


	// State
	import type { Snippet } from 'svelte'
	import type { EntityViewProps } from '$/typescript/EntityViewProps.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'

	let {
		children,
		entityId,
		href,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<EntityType.EvmBlock>
			href: string
			open?: boolean
		},
		Omit<
			EntityViewProps,
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'open'
			| 'title'
			| 'Details'
		>
	> = $props()


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmBlock}
	{entityId}
	title={'Block'}
	{href}
	{open}
	{...entityViewRest}
>
	{#snippet Details()}
		{#if children}
			{@render children()}
		{:else}
			<EntityDetails
				entityType={EntityType.EvmBlock}
				{entityId}
			>
				<p>–</p>
			</EntityDetails>
		{/if}
	{/snippet}
</EntityView>
