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
	}: EntityListViewProps<EntityType.CelestiaBlobSubmission> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CelestiaBlobSubmission}
	bind:open
	resource={
		selection({
			fields: {
				txHash: true,
				$blob: {
					fields: {
						$namespace: {
							fields: {
								label: true,
								namespaceVersion: true,
							},
						},
					},
				},
			},
		})
	}
>
	{#snippet Item({ item: celestiaBlobSubmission })}
		{@const celestiaBlobSubmissionSelector = celestiaBlobSubmission[EntityMetaKey.Selector]}
		{@const blob = celestiaBlobSubmissionSelector.$blob}
		<EntityView
			entityType={EntityType.CelestiaBlobSubmission}
			entitySelector={celestiaBlobSubmissionSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/(celestia)/namespace/[namespaceId=stringSegment]/(celestiaNamespace)/blob/[height=nonNegativeBigInt]/[commitment=stringSegment]/(celestiaBlob)/submission/[txHash=stringSegment]',
					{
						network: (
							'caip2' in blob.$namespace.$network.$network ?
								caip2StringFromValue(blob.$namespace.$network.$network.caip2)
							:
								blob.$namespace.$network.$network.slug
						),
						namespaceId: blob.$namespace.namespaceId,
						height: String(blob.height),
						commitment: blob.commitment,
						txHash: celestiaBlobSubmissionSelector.txHash,
					}
				)
			}
		>
			{#snippet Title()}
				{celestiaBlobSubmissionSelector.txHash || 'celestia blob submission'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{celestiaBlobSubmissionSelector.$blob.commitment || 'celestia blob'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
