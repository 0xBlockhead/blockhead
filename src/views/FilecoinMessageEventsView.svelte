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
	}: EntityListViewProps<EntityType.FilecoinMessageEvent> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.FilecoinMessageEvent}
	bind:open
	resource={
		selection({
			fields: {
				name: true,
				address: true,
				index: true,
				$message: true,
			},
		})
	}
>
	{#snippet Item({ item: filecoinMessageEvent })}
		{@const filecoinMessageEventSelector = filecoinMessageEvent[EntityMetaKey.Selector]}
		{@const message = filecoinMessageEventSelector.$message}
		<EntityView
			entityType={EntityType.FilecoinMessageEvent}
			entitySelector={filecoinMessageEventSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/message/filecoin/[cid=stringSegment]/(filecoinMessage)/event/[index=nonNegativeInteger]',
					{
						network: (
							'caip2' in message.$network ?
								caip2StringFromValue(message.$network.caip2)
							:
								message.$network.slug
						),
						cid: message.cid,
						index: String(filecoinMessageEventSelector.index),
					}
				)
			}
		>
			{#snippet Title()}
				{[(filecoinMessageEvent.name ?? ''), filecoinMessageEvent.address].filter(Boolean).join(' ') || 'filecoin message event'}
			{/snippet}

			{#snippet Value()}
				{filecoinMessageEventSelector.index}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{filecoinMessageEventSelector.$message.cid || 'filecoin message'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
