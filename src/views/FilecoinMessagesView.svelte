<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.FilecoinMessage> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.FilecoinMessage}
	bind:open
	resource={
		selection({
			sources: selection.sources ?? [
				Source.Filfox_Rest,
				Source.Lotus_JsonRpc,
			],
			fields: {
				cid: true,
				$from: true,
				$to: true,
				valueAttoFil: true,
			},
		})
	}
>
	{#snippet Item({ item: filecoinMessage })}
		{@const filecoinMessageSelector = filecoinMessage[EntityMetaKey.Selector]}
		{@const network = filecoinMessageSelector.$network}
		<EntityView
			entityType={EntityType.FilecoinMessage}
			entitySelector={filecoinMessageSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/message/filecoin/[cid=stringSegment]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						cid: filecoinMessageSelector.cid,
					}
				)
			}
		>
			{#snippet Title()}
				{filecoinMessageSelector.cid || 'filecoin message'}
			{/snippet}

			{#snippet Value()}
				{[filecoinMessage.$from == null ? '' : filecoinMessage.$from.address || 'filecoin actor', filecoinMessage.$to == null ? '' : filecoinMessage.$to.address || 'filecoin actor'].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{filecoinMessage.valueAttoFil ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
