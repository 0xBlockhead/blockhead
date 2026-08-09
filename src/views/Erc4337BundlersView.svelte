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
	}: EntityListViewProps<EntityType.Erc4337Bundler> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.Erc4337Bundler}
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
	{#snippet Item({ item: erc4337Bundler })}
		{@const erc4337BundlerSelector = erc4337Bundler[EntityMetaKey.Selector]}
		{@const network = erc4337BundlerSelector.$network}
		<EntityView
			entityType={EntityType.Erc4337Bundler}
			entitySelector={erc4337BundlerSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/bundler/[address=evmAddress]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						address: erc4337BundlerSelector.address,
					}
				)
			}
		>
			{#snippet Title()}
				{erc4337BundlerSelector.address || 'ERC-4337 bundler'}
			{/snippet}

			{#snippet Value()}
				{erc4337BundlerSelector.address}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{erc4337Bundler.$network.name || (erc4337Bundler.$network.caip2 == null ? '' : `${erc4337Bundler.$network.caip2.namespace}:${erc4337Bundler.$network.caip2.reference}`) || 'Network'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
