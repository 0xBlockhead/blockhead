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
	}: EntityListViewProps<EntityType.AvailDataSubmission> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AvailDataSubmission}
	bind:open
	resource={
		selection({
			fields: {
				submissionKey: true,
				blockNumber: true,
				source: true,
			},
		})
	}
>
	{#snippet Item({ item: availDataSubmission })}
		{@const availDataSubmissionSelector = availDataSubmission[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AvailDataSubmission}
			entitySelector={availDataSubmissionSelector}
		>
			{#snippet Title()}
				{availDataSubmissionSelector.submissionKey || 'avail data submission'}
			{/snippet}

			{#snippet Value()}
				{String(availDataSubmission.blockNumber ?? '')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{availDataSubmissionSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
