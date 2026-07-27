<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


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
			fields: {
				proverPeerId: true,
				$network: true,
				version: true,
			},
		})
	}
>
	{#snippet Item({ item: quilibriumProver })}
		{@const quilibriumProverSelector = quilibriumProver[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.QuilibriumProver}
			entitySelector={quilibriumProverSelector}
		>
			{#snippet Title()}
				{quilibriumProverSelector.proverPeerId || 'quilibrium prover'}
			{/snippet}

			{#snippet Value()}
				{quilibriumProver.$network.name || (quilibriumProverSelector.$network.caip2 == null ? '' : `${quilibriumProverSelector.$network.caip2.namespace}:${quilibriumProverSelector.$network.caip2.reference}`) || 'Network'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{(quilibriumProver.version ?? '')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
