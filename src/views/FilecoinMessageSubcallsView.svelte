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
	}: EntityListViewProps<EntityType.FilecoinMessageSubcall> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.FilecoinMessageSubcall}
	bind:open
	resource={
		selection({
			...{
				fields: {
					method: true,
					$from: true,
					$to: true,
					valueAttoFil: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: filecoinMessageSubcall })}
		{@const filecoinMessageSubcallSelector = filecoinMessageSubcall[EntityMetaKey.Selector]}
		{@const message = filecoinMessageSubcallSelector.$message}
		<EntityView
			entityType={EntityType.FilecoinMessageSubcall}
			entitySelector={filecoinMessageSubcallSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/message/filecoin/[cid=stringSegment]/(filecoinMessage)/subcall/[index=nonNegativeInteger]',
					{
						network: (
							'caip2' in message.$network ?
								caip2StringFromValue(message.$network.caip2)
							:
								message.$network.slug
						),
						cid: message.cid,
						index: String(filecoinMessageSubcallSelector.index),
					}
				)
			}
		>
			{#snippet Title()}
				{filecoinMessageSubcall.method || 'filecoin message subcall'}
			{/snippet}

			{#snippet Value()}
				{[filecoinMessageSubcall.$from == null ? '' : filecoinMessageSubcall.$from.address || 'filecoin actor', filecoinMessageSubcall.$to == null ? '' : filecoinMessageSubcall.$to.address || 'filecoin actor'].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{filecoinMessageSubcall.valueAttoFil}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
