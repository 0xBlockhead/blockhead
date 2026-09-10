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
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/(avail)/submission/[source=stringSegment]/[submissionKey=stringSegment]',
					{
						network: (
							'caip2' in availDataSubmissionSelector.$network.$network ?
								caip2StringFromValue(availDataSubmissionSelector.$network.$network.caip2)
							:
								availDataSubmissionSelector.$network.$network.slug
						),
						source: availDataSubmissionSelector.source,
						submissionKey: availDataSubmissionSelector.submissionKey,
					}
				)
			}
		>
			{#snippet Title()}
				{availDataSubmissionSelector.submissionKey || 'avail data submission'}
			{/snippet}

			{#snippet Value()}
				{availDataSubmission.blockNumber ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{availDataSubmissionSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
