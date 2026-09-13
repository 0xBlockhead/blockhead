<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// State
	let {
		selection,
		title = 'Leverage',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.Leverage> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.Leverage}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				id: true,
				liquidity: true,
				origin: true,
			},
		})
	}
>
	{#snippet Item({ item: leverage })}
		{@const leverageSelector = leverage[EntityMetaKey.Selector]}
		{@const network = leverageSelector.$network}
		<EntityView
			entityType={EntityType.Leverage}
			entitySelector={leverageSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/leverage/[id=stringSegment]',
					{
						network: (
							network.caip2 !== undefined ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						id: leverageSelector.id,
					}
				)
			}
		>
			{#snippet Title()}
				{leverageSelector.id || 'leverage'}
			{/snippet}

			{#snippet Value()}
				{leverage.liquidity}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{leverage.origin ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
