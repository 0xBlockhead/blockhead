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
	}: EntityListViewProps<EntityType.IbcConnection> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.IbcConnection}
	bind:open
	resource={
		selection({
			...{
				fields: {
					connectionId: true,
					state: true,
					clientId: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: ibcConnection })}
		{@const ibcConnectionSelector = ibcConnection[EntityMetaKey.Selector]}
		{@const network = ibcConnectionSelector.$network}
		<EntityView
			entityType={EntityType.IbcConnection}
			entitySelector={ibcConnectionSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/ibc-connections/[connectionId=stringSegment]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						connectionId: ibcConnectionSelector.connectionId,
					}
				)
			}
		>
			{#snippet Title()}
				{ibcConnectionSelector.connectionId || 'IBC connection'}
			{/snippet}

			{#snippet Value()}
				{[(ibcConnection.state ?? ''), ibcConnectionSelector.connectionId].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{ibcConnection.clientId ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
