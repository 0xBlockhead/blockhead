<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.NearValidator> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.NearValidator}
	bind:open
	resource={
		selection({
			sources: selection.sources ?? [
				Source.NearRpc_JsonRpc,
			],
			fields: {
				accountId: true,
				stakeYoctoNear: true,
				isSlashed: true,
			},
		})
	}
>
	{#snippet Item({ item: nearValidator })}
		{@const nearValidatorSelector = nearValidator[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.NearValidator}
			entitySelector={nearValidatorSelector}
		>
			{#snippet Title()}
				{nearValidatorSelector.accountId || 'near validator'}
			{/snippet}

			{#snippet Value()}
				{String(nearValidator.stakeYoctoNear ?? '')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{String(nearValidator.isSlashed ?? '')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
