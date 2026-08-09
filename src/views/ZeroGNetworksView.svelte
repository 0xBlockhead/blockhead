<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.ZeroGNetwork> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.ZeroGNetwork}
	bind:open
	resource={
		selection({
			...{
				fields: {
					name: true,
					slug: true,
					environment: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: zeroGNetwork })}
		{@const zeroGNetworkSelector = zeroGNetwork[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.ZeroGNetwork}
			entitySelector={zeroGNetworkSelector}
			href={
				resolve(
					'/zerog/[slug=stringSegment]',
					{
						slug: zeroGNetworkSelector.slug,
					}
				)
			}
		>
			{#snippet Title()}
				{zeroGNetwork.name || 'zero g network'}
			{/snippet}

			{#snippet Value()}
				{zeroGNetworkSelector.slug}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{zeroGNetwork.environment}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
