<!-- Generated from APP.ts. Do not edit by hand. -->

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
		typeAnnotationParagraphs = ['A blockchain, ledger, or protocol network with its own identity and supporting metadata.'],
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.Network> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.Network}
	bind:open
	{typeAnnotationParagraphs}
	resource={
		selection({
			fields: {
				$icon: true,
				name: true,
				caip2: true,
			},
		})
	}
>
	{#snippet Item({ item: network })}
		{@const networkSelector = network[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.Network}
			entitySelector={networkSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]',
					{
						network: (
							'caip2' in networkSelector ?
								String(caip2StringFromValue(networkSelector.caip2))
							:
								String(networkSelector.slug)
						),
					}
				)
			}
		>
			{#snippet Title()}
				{network.name || (networkSelector.caip2 == null ? '' : `${networkSelector.caip2.namespace}:${networkSelector.caip2.reference}`) || 'Network'}
			{/snippet}

			{#snippet Value()}
				{networkSelector.caip2 == null ? '' : `${networkSelector.caip2.namespace}:${networkSelector.caip2.reference}`}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
