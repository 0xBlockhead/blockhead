<!-- Generated from APP.ts. -->

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
	}: EntityListViewProps<EntityType.MoneroStealthOutput> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.MoneroStealthOutput}
	bind:open
	resource={
		selection({
			fields: {
				outputIndex: true,
				publicKey: true,
				commitment: true,
			},
		})
	}
>
	{#snippet Item({ item: moneroStealthOutput })}
		{@const moneroStealthOutputSelector = moneroStealthOutput[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.MoneroStealthOutput}
			entitySelector={moneroStealthOutputSelector}
		>
			{#snippet Title()}
				{moneroStealthOutputSelector.outputIndex}
			{/snippet}

			{#snippet Value()}
				{moneroStealthOutput.publicKey ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{moneroStealthOutput.commitment ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
