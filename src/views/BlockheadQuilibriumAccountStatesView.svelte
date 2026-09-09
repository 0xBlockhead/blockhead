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
		title = 'Blockhead Quilibrium account states',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadQuilibriumAccountState> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadQuilibriumAccountState}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				accountAddress: true,
				$network: true,
				accountKind: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadQuilibriumAccountState })}
		{@const blockheadQuilibriumAccountStateSelector = blockheadQuilibriumAccountState[EntityMetaKey.Selector]}
		{@const network = blockheadQuilibriumAccountStateSelector.$network}
		<EntityView
			entityType={EntityType.BlockheadQuilibriumAccountState}
			entitySelector={blockheadQuilibriumAccountStateSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/~/quilibrium/connection/[connectionId=stringSegment]/account-state/[accountAddress=stringSegment]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						connectionId: blockheadQuilibriumAccountStateSelector.connectionId,
						accountAddress: blockheadQuilibriumAccountStateSelector.accountAddress,
					}
				)
			}
		>
			{#snippet Title()}
				{blockheadQuilibriumAccountStateSelector.accountAddress || 'blockhead quilibrium account state'}
			{/snippet}

			{#snippet Value()}
				{blockheadQuilibriumAccountState.$network.name || (blockheadQuilibriumAccountState.$network.caip2 == null ? '' : `${blockheadQuilibriumAccountState.$network.caip2.namespace}:${blockheadQuilibriumAccountState.$network.caip2.reference}`) || 'Network'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadQuilibriumAccountState.accountKind ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
