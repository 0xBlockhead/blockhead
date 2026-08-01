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
	}: EntityListViewProps<EntityType.MevRelay> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.MevRelay}
	bind:open
	resource={
		selection({
			fields: {
				host: true,
				$network: true,
			},
		})
	}
>
	{#snippet Item({ item: mevRelay })}
		{@const mevRelaySelector = mevRelay[EntityMetaKey.Selector]}
		{@const network = mevRelaySelector.$network}
		<EntityView
			entityType={EntityType.MevRelay}
			entitySelector={mevRelaySelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/mev/relay/[host=stringSegment]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						host: mevRelaySelector.host,
					}
				)
			}
		>
			{#snippet Title()}
				{mevRelaySelector.host || 'MEV relay'}
			{/snippet}

			{#snippet Value()}
				{mevRelaySelector.host}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{mevRelay.$network.name || (mevRelaySelector.$network.caip2 == null ? '' : `${mevRelaySelector.$network.caip2.namespace}:${mevRelaySelector.$network.caip2.reference}`) || 'Network'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
