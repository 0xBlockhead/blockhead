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
	}: EntityListViewProps<EntityType.MoneroBlock> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.MoneroBlock}
	bind:open
	resource={
		selection({
			sources: selection.sources ?? [
				Source.MoneroDaemonRpc_JsonRpc,
				Source.ThreeXpl_Rest,
			],
			fields: {
				height: true,
				hash: true,
				timestampMs: true,
			},
		})
	}
>
	{#snippet Item({ item: moneroBlock })}
		{@const moneroBlockSelector = moneroBlock[EntityMetaKey.Selector]}
		{@const network = moneroBlockSelector.$network}
		<EntityView
			entityType={EntityType.MoneroBlock}
			entitySelector={moneroBlockSelector}
			href={
				'hash' in moneroBlockSelector ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]/(selection)/[hash=stringSegment]',
						{
							network: (
								'caip2' in network ?
									caip2StringFromValue(network.caip2)
								:
									network.slug
							),
							blockNumber: String(moneroBlockSelector.height),
							hash: moneroBlockSelector.hash,
						}
					)
				:
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]',
						{
							network: (
								'caip2' in network ?
									caip2StringFromValue(network.caip2)
								:
									network.slug
							),
							blockNumber: String(moneroBlockSelector.height),
						}
					)
			}
		>
			{#snippet Title()}
				{moneroBlockSelector.height}
			{/snippet}

			{#snippet Value()}
				{moneroBlock.hash}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{moneroBlock.timestampMs ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
