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
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.Network> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.Network}
	bind:open
	resource={
		selection({
			fields: {
				$icon: true,
				name: true,
				caip2: true,
				environment: true,
			},
		})
	}
>
	{#snippet Item({ item: network })}
		{@const networkSelector = network[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.Network}
			entitySelector={networkSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]',
					{
						network: (
							'caip2' in networkSelector ?
								caip2StringFromValue(networkSelector.caip2)
							:
								networkSelector.slug
						),
					}
				)
			}
		>
			{#snippet Title()}
				{network.name || (network.caip2 == null ? '' : `${network.caip2.namespace}:${network.caip2.reference}`) || 'Network'}
			{/snippet}

			{#snippet Value()}
				{network.caip2 == null ? '' : `${network.caip2.namespace}:${network.caip2.reference}`}
			{/snippet}

			{#snippet HeadingAfter()}
				{#if network.environment != null}
					<span data-text="annotation">{network.environment}</span>
				{/if}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
