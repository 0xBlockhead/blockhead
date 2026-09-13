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
	}: EntityListViewProps<EntityType.FilecoinMessageReceipt> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.FilecoinMessageReceipt}
	bind:open
	resource={
		selection({
			fields: {
				tipsetKey: true,
				exitCode: true,
				gasUsed: true,
			},
		})
	}
>
	{#snippet Item({ item: filecoinMessageReceipt })}
		{@const filecoinMessageReceiptSelector = filecoinMessageReceipt[EntityMetaKey.Selector]}
		{@const message = filecoinMessageReceiptSelector.$message}
		<EntityView
			entityType={EntityType.FilecoinMessageReceipt}
			entitySelector={filecoinMessageReceiptSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/message/filecoin/[cid=stringSegment]/(filecoinMessage)/receipt/[tipsetKey=stringSegment]/[source=stringSegment]',
					{
						network: (
							message.$network.caip2 !== undefined ?
								caip2StringFromValue(message.$network.caip2)
							:
								message.$network.slug
						),
						cid: message.cid,
						tipsetKey: filecoinMessageReceiptSelector.tipsetKey,
						source: filecoinMessageReceiptSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{filecoinMessageReceiptSelector.tipsetKey || 'filecoin message receipt'}
			{/snippet}

			{#snippet Value()}
				{filecoinMessageReceipt.exitCode ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{filecoinMessageReceipt.gasUsed ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
