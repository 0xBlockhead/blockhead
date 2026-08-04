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
	}: EntityListViewProps<EntityType.HederaAccount> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HederaAccount}
	bind:open
	resource={
		selection({
			fields: {
				accountId: true,
				$network: true,
			},
		})
	}
>
	{#snippet Item({ item: hederaAccount })}
		{@const hederaAccountSelector = hederaAccount[EntityMetaKey.Selector]}
		{@const network = hederaAccountSelector.$network}
		<EntityView
			entityType={EntityType.HederaAccount}
			entitySelector={hederaAccountSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						accountId: hederaAccountSelector.accountId,
					}
				)
			}
		>
			{#snippet Title()}
				{hederaAccountSelector.accountId || 'hedera account'}
			{/snippet}

			{#snippet Value()}
				{hederaAccount.$network.name || (hederaAccount.$network.caip2 == null ? '' : `${hederaAccount.$network.caip2.namespace}:${hederaAccount.$network.caip2.reference}`) || 'Network'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
