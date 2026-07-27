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
	}: EntityListViewProps<EntityType.NearContract> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.NearContract}
	bind:open
	resource={
		selection({
			fields: {
				accountId: true,
				codeHash: true,
				codeSizeBytes: true,
			},
		})
	}
>
	{#snippet Item({ item: nearContract })}
		{@const nearContractSelector = nearContract[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.NearContract}
			entitySelector={nearContractSelector}
		>
			{#snippet Title()}
				{nearContractSelector.accountId || 'near contract'}
			{/snippet}

			{#snippet Value()}
				{(nearContract.codeHash ?? '')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{String(nearContract.codeSizeBytes ?? '')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
