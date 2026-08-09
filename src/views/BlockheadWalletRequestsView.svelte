<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadWalletRequest> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadWalletRequest}
	bind:open
	resource={
		selection({
			...{
				fields: {
					requestKind: true,
					requestMethod: true,
					requestedAt: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: blockheadWalletRequest })}
		{@const blockheadWalletRequestSelector = blockheadWalletRequest[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadWalletRequest}
			entitySelector={blockheadWalletRequestSelector}
			href={
				resolve(
					'/~/wallets/requests/[id=stringSegment]',
					{
						id: blockheadWalletRequestSelector.id,
					}
				)
			}
		>
			{#snippet Title()}
				{blockheadWalletRequest.requestKind || 'blockhead wallet request'}
			{/snippet}

			{#snippet Value()}
				{blockheadWalletRequest.requestMethod}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadWalletRequest.requestedAt}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
