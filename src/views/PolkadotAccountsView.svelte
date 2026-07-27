<!-- Generated from APP.ts. Do not edit by hand. -->

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
		title = 'Accounts',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.PolkadotAccount> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.PolkadotAccount}
	{title}
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
	{#snippet Item({ item: polkadotAccount })}
		{@const polkadotAccountSelector = polkadotAccount[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.PolkadotAccount}
			entitySelector={polkadotAccountSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]',
					{
						network: (
							'caip2' in polkadotAccountSelector.$network ?
								String(caip2StringFromValue(polkadotAccountSelector.$network.caip2))
							:
								String(polkadotAccountSelector.$network.slug)
						),
						accountId: String(polkadotAccountSelector.accountId),
					}
				)
			}
		>
			{#snippet Title()}
				{polkadotAccountSelector.accountId || 'Polkadot account'}
			{/snippet}

			{#snippet Value()}
				{polkadotAccountSelector.accountId}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{polkadotAccount.$network.name || (polkadotAccountSelector.$network.caip2 == null ? '' : `${polkadotAccountSelector.$network.caip2.namespace}:${polkadotAccountSelector.$network.caip2.reference}`) || 'Network'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
