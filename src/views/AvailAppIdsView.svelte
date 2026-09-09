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
	}: EntityListViewProps<EntityType.AvailAppId> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AvailAppId}
	bind:open
	resource={
		selection({
			fields: {
				label: true,
				appId: true,
			},
		})
	}
>
	{#snippet Item({ item: availAppId })}
		{@const availAppIdSelector = availAppId[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AvailAppId}
			entitySelector={availAppIdSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/(avail)/app/[appId=nonNegativeInteger]',
					{
						network: (
							'caip2' in availAppIdSelector.$network.$network ?
								caip2StringFromValue(availAppIdSelector.$network.$network.caip2)
							:
								availAppIdSelector.$network.$network.slug
						),
						appId: String(availAppIdSelector.appId),
					}
				)
			}
		>
			{#snippet Title()}
				{(availAppId.label ?? '') || String(availAppIdSelector.appId) || 'avail app ID'}
			{/snippet}

			{#snippet Value()}
				{availAppIdSelector.appId}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
