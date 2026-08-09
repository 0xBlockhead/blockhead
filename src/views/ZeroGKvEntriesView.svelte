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
		id = 'ZeroGKvEntries-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType.ZeroGKvEntry> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.ZeroGKvEntry}
	{id}
	bind:open
	resource={
		selection({
			...{
				fields: {
					key: true,
					namespace: true,
					$network: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: zeroGKvEntry })}
		{@const zeroGKvEntrySelector = zeroGKvEntry[EntityMetaKey.Selector]}
		{@const network = zeroGKvEntrySelector.$network}
		<EntityView
			entityType={EntityType.ZeroGKvEntry}
			entitySelector={zeroGKvEntrySelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/kv/[namespace=stringSegment]/[key=stringSegment]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						namespace: zeroGKvEntrySelector.namespace,
						key: zeroGKvEntrySelector.key,
					}
				)
			}
		>
			{#snippet Title()}
				{zeroGKvEntrySelector.key || 'zero g kv entry'}
			{/snippet}

			{#snippet Value()}
				{zeroGKvEntrySelector.namespace}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{zeroGKvEntry.$network.name || (zeroGKvEntry.$network.caip2 == null ? '' : `${zeroGKvEntry.$network.caip2.namespace}:${zeroGKvEntry.$network.caip2.reference}`) || 'Network'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
