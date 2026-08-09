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
	}: EntityListViewProps<EntityType.LightningNode> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.LightningNode}
	bind:open
	resource={
		selection({
			...{
				fields: {
					publicKey: true,
					$network: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: lightningNode })}
		{@const lightningNodeSelector = lightningNode[EntityMetaKey.Selector]}
		{@const network = lightningNodeSelector.$network}
		<EntityView
			entityType={EntityType.LightningNode}
			entitySelector={lightningNodeSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/nodes/[pubkey=stringSegment]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						pubkey: lightningNodeSelector.publicKey,
					}
				)
			}
		>
			{#snippet Title()}
				{lightningNodeSelector.publicKey || 'Lightning node'}
			{/snippet}

			{#snippet Value()}
				{lightningNode.$network.name || (lightningNode.$network.caip2 == null ? '' : `${lightningNode.$network.caip2.namespace}:${lightningNode.$network.caip2.reference}`) || 'Network'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
