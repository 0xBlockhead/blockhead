<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.ClaimTopicRequirement>, 'prefetched'> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import RegulatedAssetProfileView from '$/views/RegulatedAssetProfileView.svelte'
</script>


<EntityView
	entityType={EntityType.ClaimTopicRequirement}
	entitySelector={selection.entitySelector}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/asset/[kind=stringSegment]/[assetKey=stringSegment]/(assetInstance)/regulated-profile/(regulatedAssetProfile)/claim-topic/[topicKey=stringSegment]',
				{
					network: (
						selection.entitySelector.$profile.$assetInstance.$network.caip2 !== undefined ?
							caip2StringFromValue(selection.entitySelector.$profile.$assetInstance.$network.caip2)
						:
							selection.entitySelector.$profile.$assetInstance.$network.slug
					),
					kind: selection.entitySelector.$profile.$assetInstance.kind,
					assetKey: selection.entitySelector.$profile.$assetInstance.assetKey,
					topicKey: selection.entitySelector.topicKey,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>profile</dt>
				<dd>
					<RegulatedAssetProfileView
						selection={select(EntityType.RegulatedAssetProfile, selection.entitySelector.$profile)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>topic key</dt>
				<dd>
					{selection.entitySelector.topicKey}
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							claimTopic: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const claimTopic = entity.claimTopic}
					{#if claimTopic != null}
						<div>
							<dt>claim topic</dt>
							<dd>
								{claimTopic}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							countryScope: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const countryScope = entity.countryScope}
					{#if countryScope != null}
						<div>
							<dt>country scope</dt>
							<dd>
								{countryScope}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
