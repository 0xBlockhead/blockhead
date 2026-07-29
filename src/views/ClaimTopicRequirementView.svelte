<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.ClaimTopicRequirement> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import RegulatedAssetProfileView from '$/views/RegulatedAssetProfileView.svelte'
</script>


<EntityView
	entityType={EntityType.ClaimTopicRequirement}
	entitySelector={selection.entitySelector}
	title={title ?? 'claim topic requirement'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		claim topic requirement
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>profile</dt>
				<dd>
					<RegulatedAssetProfileView
						selection={select(EntityType.RegulatedAssetProfile, selection.entitySelector.$profile)}
						layout={EntityLayout.Value}
						open={false}
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
