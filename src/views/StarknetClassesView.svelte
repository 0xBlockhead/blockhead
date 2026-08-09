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
		id = 'StarknetClasses-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType.StarknetClass> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.StarknetClass}
	{id}
	bind:open
	resource={
		selection({
			...{
				fields: {
					classHash: true,
					contractClassVersion: true,
					declaredAtBlockNumber: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: starknetClass })}
		{@const starknetClassSelector = starknetClass[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.StarknetClass}
			entitySelector={starknetClassSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/class/[classHash=stringSegment]',
					{
						network: (
							'caip2' in starknetClassSelector.$network.$network ?
								caip2StringFromValue(starknetClassSelector.$network.$network.caip2)
							:
								starknetClassSelector.$network.$network.slug
						),
						classHash: starknetClassSelector.classHash,
					}
				)
			}
		>
			{#snippet Title()}
				{starknetClassSelector.classHash || 'starknet class'}
			{/snippet}

			{#snippet Value()}
				{starknetClass.contractClassVersion ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{starknetClass.declaredAtBlockNumber ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
