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
	}: EntityListViewProps<EntityType.QuilibriumAccount> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.QuilibriumAccount}
	bind:open
	resource={
		selection({
			...{
				fields: {
					accountAddress: true,
					$network: true,
					accountKind: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: quilibriumAccount })}
		{@const quilibriumAccountSelector = quilibriumAccount[EntityMetaKey.Selector]}
		{@const network = quilibriumAccountSelector.$network}
		<EntityView
			entityType={EntityType.QuilibriumAccount}
			entitySelector={quilibriumAccountSelector}
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
						accountId: quilibriumAccountSelector.accountAddress,
					}
				)
			}
		>
			{#snippet Title()}
				{quilibriumAccountSelector.accountAddress || 'quilibrium account'}
			{/snippet}

			{#snippet Value()}
				{quilibriumAccount.$network.name || (quilibriumAccount.$network.caip2 == null ? '' : `${quilibriumAccount.$network.caip2.namespace}:${quilibriumAccount.$network.caip2.reference}`) || 'Network'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{quilibriumAccount.accountKind ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
