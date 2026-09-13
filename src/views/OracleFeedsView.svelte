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
	}: EntityListViewProps<EntityType.OracleFeed> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.OracleFeed}
	bind:open
	resource={
		selection({
			fields: {
				label: true,
				feedKind: true,
				$market: true,
				address: true,
			},
		})
	}
>
	{#snippet Item({ item: oracleFeed })}
		{@const oracleFeedSelector = oracleFeed[EntityMetaKey.Selector]}
		{@const network = oracleFeedSelector.$network}
		<EntityView
			entityType={EntityType.OracleFeed}
			entitySelector={oracleFeedSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/oracle/feed/[address=evmAddress]',
					{
						network: (
							network.caip2 !== undefined ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						address: oracleFeedSelector.address,
					}
				)
			}
		>
			{#snippet Title()}
				{(oracleFeed.label ?? '') || oracleFeedSelector.address || 'oracle feed'}
			{/snippet}

			{#snippet Value()}
				{[(oracleFeed.feedKind ?? ''), oracleFeed.$market == null ? '' : 'Market'].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
