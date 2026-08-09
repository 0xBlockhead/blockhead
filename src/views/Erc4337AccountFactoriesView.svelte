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
		id = 'Erc4337AccountFactories-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType.Erc4337AccountFactory> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.Erc4337AccountFactory}
	{id}
	bind:open
	resource={
		selection({
			...{
				fields: {
					address: true,
					$network: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: erc4337AccountFactory })}
		{@const erc4337AccountFactorySelector = erc4337AccountFactory[EntityMetaKey.Selector]}
		{@const network = erc4337AccountFactorySelector.$network}
		<EntityView
			entityType={EntityType.Erc4337AccountFactory}
			entitySelector={erc4337AccountFactorySelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/account-factory/[address=evmAddress]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						address: erc4337AccountFactorySelector.address,
					}
				)
			}
		>
			{#snippet Title()}
				{erc4337AccountFactorySelector.address || 'ERC-4337 account factory'}
			{/snippet}

			{#snippet Value()}
				{erc4337AccountFactorySelector.address}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{erc4337AccountFactory.$network.name || (erc4337AccountFactory.$network.caip2 == null ? '' : `${erc4337AccountFactory.$network.caip2.namespace}:${erc4337AccountFactory.$network.caip2.reference}`) || 'Network'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
