<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'Referendums',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.PolkadotReferendum> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.PolkadotReferendum}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				referendumId: true,
				track: true,
				$network: true,
			},
		})
	}
>
	{#snippet Item({ item: polkadotReferendum })}
		{@const polkadotReferendumSelector = polkadotReferendum[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.PolkadotReferendum}
			entitySelector={polkadotReferendumSelector}
		>
			{#snippet Title()}
				{polkadotReferendumSelector.referendumId || 'Polkadot referendum'}
			{/snippet}

			{#snippet Value()}
				{polkadotReferendum.track ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{polkadotReferendum.$network.name || (polkadotReferendumSelector.$network.caip2 == null ? '' : `${polkadotReferendumSelector.$network.caip2.namespace}:${polkadotReferendumSelector.$network.caip2.reference}`) || 'Network'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
