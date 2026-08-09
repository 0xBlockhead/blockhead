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
		title = 'Transfer requests',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadTransferRequest> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadTransferRequest}
	{title}
	bind:open
	resource={
		selection({
			...{
				fields: {
					id: true,
					status: true,
					createdAt: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: blockheadTransferRequest })}
		{@const blockheadTransferRequestSelector = blockheadTransferRequest[EntityMetaKey.Selector]}
		{@const network = blockheadTransferRequestSelector.$network}
		<EntityView
			entityType={EntityType.BlockheadTransferRequest}
			entitySelector={blockheadTransferRequestSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/~/transfer-request/[id=stringSegment]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						id: blockheadTransferRequestSelector.id,
					}
				)
			}
		>
			{#snippet Title()}
				{blockheadTransferRequestSelector.id || 'blockhead transfer request'}
			{/snippet}

			{#snippet Value()}
				{blockheadTransferRequest.status}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadTransferRequest.createdAt}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
