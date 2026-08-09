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
	}: EntityListViewProps<EntityType.NearReceipt> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.NearReceipt}
	bind:open
	resource={
		selection({
			...{
				fields: {
					receiptId: true,
					$receiver: true,
					$predecessor: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: nearReceipt })}
		{@const nearReceiptSelector = nearReceipt[EntityMetaKey.Selector]}
		{@const network = nearReceiptSelector.$network}
		<EntityView
			entityType={EntityType.NearReceipt}
			entitySelector={nearReceiptSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/receipt/[receiptId=stringSegment]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						receiptId: nearReceiptSelector.receiptId,
					}
				)
			}
		>
			{#snippet Title()}
				{nearReceiptSelector.receiptId || 'near receipt'}
			{/snippet}

			{#snippet Value()}
				{nearReceipt.$receiver == null ? '' : nearReceipt.$receiver.accountId || 'near account'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{nearReceipt.$predecessor == null ? '' : nearReceipt.$predecessor.accountId || 'near account'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
