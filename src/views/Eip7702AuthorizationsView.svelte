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
		title = 'EIP-7702 authorizations',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.Eip7702Authorization> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.Eip7702Authorization}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				authorizationIndex: true,
				delegationAddress: true,
				authority: true,
			},
		})
	}
>
	{#snippet Item({ item: eip7702Authorization })}
		{@const eip7702AuthorizationSelector = eip7702Authorization[EntityMetaKey.Selector]}
		{@const transaction = eip7702AuthorizationSelector.$transaction}
		<EntityView
			entityType={EntityType.Eip7702Authorization}
			entitySelector={eip7702AuthorizationSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]/(selection)/authorization/[authorizationIndex=nonNegativeInteger]',
					{
						network: (
							transaction.$network.caip2 !== undefined ?
								caip2StringFromValue(transaction.$network.caip2)
							:
								transaction.$network.slug
						),
						transactionId: transaction.txHash,
						authorizationIndex: String(eip7702AuthorizationSelector.authorizationIndex),
					}
				)
			}
		>
			{#snippet Title()}
				{eip7702AuthorizationSelector.authorizationIndex}
			{/snippet}

			{#snippet Value()}
				{eip7702Authorization.delegationAddress}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{eip7702Authorization.authority ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
