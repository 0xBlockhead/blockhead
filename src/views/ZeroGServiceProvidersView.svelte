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
	}: EntityListViewProps<EntityType.ZeroGServiceProvider> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.ZeroGServiceProvider}
	bind:open
	resource={
		selection({
			...{
				fields: {
					providerId: true,
					serviceKind: true,
					$network: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: zeroGServiceProvider })}
		{@const zeroGServiceProviderSelector = zeroGServiceProvider[EntityMetaKey.Selector]}
		{@const network = zeroGServiceProviderSelector.$network}
		<EntityView
			entityType={EntityType.ZeroGServiceProvider}
			entitySelector={zeroGServiceProviderSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/service-provider/[providerId=stringSegment]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						providerId: zeroGServiceProviderSelector.providerId,
					}
				)
			}
		>
			{#snippet Title()}
				{zeroGServiceProviderSelector.providerId || 'zero g service provider'}
			{/snippet}

			{#snippet Value()}
				{zeroGServiceProvider.serviceKind ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{zeroGServiceProvider.$network.name || `${zeroGServiceProvider.$network.caip2.namespace}:${zeroGServiceProvider.$network.caip2.reference}` || 'Network'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
