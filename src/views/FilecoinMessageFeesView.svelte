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
	}: EntityListViewProps<EntityType.FilecoinMessageFee> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.FilecoinMessageFee}
	bind:open
	resource={
		selection({
			fields: {
				source: true,
				minerTip: true,
				$message: true,
			},
		})
	}
>
	{#snippet Item({ item: filecoinMessageFee })}
		{@const filecoinMessageFeeSelector = filecoinMessageFee[EntityMetaKey.Selector]}
		{@const message = filecoinMessageFeeSelector.$message}
		<EntityView
			entityType={EntityType.FilecoinMessageFee}
			entitySelector={filecoinMessageFeeSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/message/filecoin/[cid=stringSegment]/(filecoinMessage)/fee/[source=stringSegment]',
					{
						network: (
							message.$network.caip2 !== undefined ?
								caip2StringFromValue(message.$network.caip2)
							:
								message.$network.slug
						),
						cid: message.cid,
						source: filecoinMessageFeeSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{filecoinMessageFeeSelector.source || 'filecoin message fee'}
			{/snippet}

			{#snippet Value()}
				{filecoinMessageFee.minerTip}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{filecoinMessageFeeSelector.$message.cid || 'filecoin message'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
