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
		title = 'Referendums',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.PolkadotReferendum> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.PolkadotReferendum}
	{title}
	bind:open
	resource={
		selection({
			...{
				fields: {
					referendumId: true,
					track: true,
					$network: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: polkadotReferendum })}
		{@const polkadotReferendumSelector = polkadotReferendum[EntityMetaKey.Selector]}
		{@const network = polkadotReferendumSelector.$network}
		<EntityView
			entityType={EntityType.PolkadotReferendum}
			entitySelector={polkadotReferendumSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/referendum/[referendumId=stringSegment]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						referendumId: polkadotReferendumSelector.referendumId,
					}
				)
			}
		>
			{#snippet Title()}
				{polkadotReferendumSelector.referendumId || 'Polkadot referendum'}
			{/snippet}

			{#snippet Value()}
				{polkadotReferendum.track ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{polkadotReferendum.$network.name || `${polkadotReferendum.$network.caip2.namespace}:${polkadotReferendum.$network.caip2.reference}` || 'Network'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
