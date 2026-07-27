<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { EvmAddress } from '$/schema/ZeroExHex.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.Erc4337SmartAccount> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.Erc4337SmartAccount}
	bind:open
	resource={
		selection({
			fields: {
				address: true,
				$network: true,
			},
		})
	}
>
	{#snippet Item({ item: erc4337SmartAccount })}
		{@const erc4337SmartAccountSelector = erc4337SmartAccount[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.Erc4337SmartAccount}
			entitySelector={erc4337SmartAccountSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/smart-account/[address=evmAddress]',
					{
						network: (
							'caip2' in erc4337SmartAccountSelector.$network ?
								String(caip2StringFromValue(erc4337SmartAccountSelector.$network.caip2))
							:
								String(erc4337SmartAccountSelector.$network.slug)
						),
						address: String(erc4337SmartAccountSelector.address),
					}
				)
			}
		>
			{#snippet Title()}
				{String(erc4337SmartAccountSelector.address) || 'ERC-4337 smart account'}
			{/snippet}

			{#snippet Value()}
				{String(erc4337SmartAccountSelector.address)}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{erc4337SmartAccount.$network.name || (erc4337SmartAccountSelector.$network.caip2 == null ? '' : `${erc4337SmartAccountSelector.$network.caip2.namespace}:${erc4337SmartAccountSelector.$network.caip2.reference}`) || 'Network'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
