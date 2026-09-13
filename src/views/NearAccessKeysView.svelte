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
	}: EntityListViewProps<EntityType.NearAccessKey> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.NearAccessKey}
	bind:open
	resource={
		selection({
			fields: {
				publicKey: true,
				permission: true,
				nonce: true,
			},
		})
	}
>
	{#snippet Item({ item: nearAccessKey })}
		{@const nearAccessKeySelector = nearAccessKey[EntityMetaKey.Selector]}
		{@const account = nearAccessKeySelector.$account}
		<EntityView
			entityType={EntityType.NearAccessKey}
			entitySelector={nearAccessKeySelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/access-key/[publicKey=stringSegment]',
					{
						network: (
							account.$network.caip2 !== undefined ?
								caip2StringFromValue(account.$network.caip2)
							:
								account.$network.slug
						),
						accountId: account.accountId,
						publicKey: nearAccessKeySelector.publicKey,
					}
				)
			}
		>
			{#snippet Title()}
				{nearAccessKeySelector.publicKey || 'near access key'}
			{/snippet}

			{#snippet Value()}
				{nearAccessKey.permission ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{nearAccessKey.nonce ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
