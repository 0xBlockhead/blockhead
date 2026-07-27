<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'Validators',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.PolkadotValidator> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.PolkadotValidator}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				stashAccountId: true,
				$network: true,
			},
		})
	}
>
	{#snippet Item({ item: polkadotValidator })}
		{@const polkadotValidatorSelector = polkadotValidator[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.PolkadotValidator}
			entitySelector={polkadotValidatorSelector}
		>
			{#snippet Title()}
				{polkadotValidatorSelector.stashAccountId || 'Polkadot validator'}
			{/snippet}

			{#snippet Value()}
				{polkadotValidatorSelector.stashAccountId}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{polkadotValidator.$network.name || (polkadotValidatorSelector.$network.caip2 == null ? '' : `${polkadotValidatorSelector.$network.caip2.namespace}:${polkadotValidatorSelector.$network.caip2.reference}`) || 'Network'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
