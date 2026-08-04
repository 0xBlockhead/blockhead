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
	}: EntityListViewProps<EntityType.LightningNetwork> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.LightningNetwork}
	bind:open
	resource={
		selection({
			fields: {
				name: true,
				$network: true,
			},
		})
	}
>
	{#snippet Item({ item: lightningNetwork })}
		{@const lightningNetworkSelector = lightningNetwork[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.LightningNetwork}
			entitySelector={lightningNetworkSelector}
			href={
				'slug' in lightningNetworkSelector.$network ?
						resolve(
					'/(explore)/(networks)/network/[network]',
					{
						network: lightningNetworkSelector.$network.slug,
					}
				)
					:
						undefined
			}
		>
			{#snippet Title()}
				{(lightningNetwork.name ?? '') || lightningNetwork.$network.name || (lightningNetwork.$network.caip2 == null ? '' : `${lightningNetwork.$network.caip2.namespace}:${lightningNetwork.$network.caip2.reference}`) || 'Network'}
			{/snippet}

			{#snippet Value()}
				Lightning
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
