<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
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
