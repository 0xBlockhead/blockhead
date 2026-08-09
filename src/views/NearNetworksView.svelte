<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.NearNetwork> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.NearNetwork}
	bind:open
	resource={
		selection({
			...{
				sources: selection.sources ?? [
					Source.Constants_Internal,
				],
				fields: {
					name: true,
					slug: true,
					environment: true,
					namespace: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: nearNetwork })}
		{@const nearNetworkSelector = nearNetwork[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.NearNetwork}
			entitySelector={nearNetworkSelector}
			href={
				resolve(
					'/near/[slug=networkSlug]',
					{
						slug: nearNetworkSelector.slug,
					}
				)
			}
		>
			{#snippet Title()}
				{[(nearNetwork.name ?? ''), nearNetworkSelector.slug].filter(Boolean).join(' ') || 'near network'}
			{/snippet}

			{#snippet Value()}
				{nearNetwork.environment}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{nearNetwork.namespace ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
