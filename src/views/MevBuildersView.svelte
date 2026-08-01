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
	}: EntityListViewProps<EntityType.MevBuilder> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.MevBuilder}
	bind:open
	resource={
		selection({
			fields: {
				builderPubkey: true,
				$network: true,
			},
		})
	}
>
	{#snippet Item({ item: mevBuilder })}
		{@const mevBuilderSelector = mevBuilder[EntityMetaKey.Selector]}
		{@const network = mevBuilderSelector.$network}
		<EntityView
			entityType={EntityType.MevBuilder}
			entitySelector={mevBuilderSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/mev/builder/[builderPubkey=stringSegment]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						builderPubkey: mevBuilderSelector.builderPubkey,
					}
				)
			}
		>
			{#snippet Title()}
				{mevBuilderSelector.builderPubkey || 'MEV builder'}
			{/snippet}

			{#snippet Value()}
				{mevBuilderSelector.builderPubkey}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{mevBuilder.$network.name || (mevBuilderSelector.$network.caip2 == null ? '' : `${mevBuilderSelector.$network.caip2.namespace}:${mevBuilderSelector.$network.caip2.reference}`) || 'Network'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
