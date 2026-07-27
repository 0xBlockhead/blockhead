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
	}: EntityListViewProps<EntityType.Erc4337Paymaster> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.Erc4337Paymaster}
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
	{#snippet Item({ item: erc4337Paymaster })}
		{@const erc4337PaymasterSelector = erc4337Paymaster[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.Erc4337Paymaster}
			entitySelector={erc4337PaymasterSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/paymaster/[address=evmAddress]',
					{
						network: (
							'caip2' in erc4337PaymasterSelector.$network ?
								String(caip2StringFromValue(erc4337PaymasterSelector.$network.caip2))
							:
								String(erc4337PaymasterSelector.$network.slug)
						),
						address: String(erc4337PaymasterSelector.address),
					}
				)
			}
		>
			{#snippet Title()}
				{String(erc4337PaymasterSelector.address) || 'ERC-4337 paymaster'}
			{/snippet}

			{#snippet Value()}
				{String(erc4337PaymasterSelector.address)}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{erc4337Paymaster.$network.name || (erc4337PaymasterSelector.$network.caip2 == null ? '' : `${erc4337PaymasterSelector.$network.caip2.namespace}:${erc4337PaymasterSelector.$network.caip2.reference}`) || 'Network'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
