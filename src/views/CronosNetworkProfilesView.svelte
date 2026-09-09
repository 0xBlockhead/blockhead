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
	}: EntityListViewProps<EntityType.CronosNetworkProfile> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CronosNetworkProfile}
	bind:open
	resource={
		selection({
			fields: {
				$network: true,
				chainKind: true,
				consensusKind: true,
			},
		})
	}
>
	{#snippet Item({ item: cronosNetworkProfile })}
		{@const cronosNetworkProfileSelector = cronosNetworkProfile[EntityMetaKey.Selector]}
		{@const network = cronosNetworkProfileSelector.$network}
		<EntityView
			entityType={EntityType.CronosNetworkProfile}
			entitySelector={cronosNetworkProfileSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/cronos',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
					}
				)
			}
		>
			{#snippet Title()}
				{cronosNetworkProfile.$network.name || (cronosNetworkProfile.$network.caip2 == null ? '' : `${cronosNetworkProfile.$network.caip2.namespace}:${cronosNetworkProfile.$network.caip2.reference}`) || 'Network'}
			{/snippet}

			{#snippet Value()}
				{cronosNetworkProfile.chainKind}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{cronosNetworkProfile.consensusKind ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
