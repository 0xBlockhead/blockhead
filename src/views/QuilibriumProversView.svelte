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
	}: EntityListViewProps<EntityType.QuilibriumProver> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.QuilibriumProver}
	bind:open
	resource={
		selection({
			...{
				fields: {
					proverPeerId: true,
					$network: true,
					version: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: quilibriumProver })}
		{@const quilibriumProverSelector = quilibriumProver[EntityMetaKey.Selector]}
		{@const network = quilibriumProverSelector.$network}
		<EntityView
			entityType={EntityType.QuilibriumProver}
			entitySelector={quilibriumProverSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/prover/[proverPeerId=stringSegment]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						proverPeerId: quilibriumProverSelector.proverPeerId,
					}
				)
			}
		>
			{#snippet Title()}
				{quilibriumProverSelector.proverPeerId || 'quilibrium prover'}
			{/snippet}

			{#snippet Value()}
				{quilibriumProver.$network.name || `${quilibriumProver.$network.caip2.namespace}:${quilibriumProver.$network.caip2.reference}` || 'Network'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{quilibriumProver.version ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
