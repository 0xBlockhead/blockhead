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
	}: Omit<EntitySelectionViewProps<EntityType.ComplianceModule>, 'prefetched'> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import RegulatedAssetProfileView from '$/views/RegulatedAssetProfileView.svelte'
</script>


<EntityView
	entityType={EntityType.ComplianceModule}
	entitySelector={selection.entitySelector}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/asset/[kind=stringSegment]/[assetKey=stringSegment]/(assetInstance)/regulated-profile/(regulatedAssetProfile)/compliance-module/[moduleKey=stringSegment]',
				{
					network: (
						'caip2' in selection.entitySelector.$profile.$assetInstance.$network ?
							caip2StringFromValue(selection.entitySelector.$profile.$assetInstance.$network.caip2)
						:
							selection.entitySelector.$profile.$assetInstance.$network.slug
					),
					kind: selection.entitySelector.$profile.$assetInstance.kind,
					assetKey: selection.entitySelector.$profile.$assetInstance.assetKey,
					moduleKey: selection.entitySelector.moduleKey,
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
				<dt>module key</dt>
				<dd>
					{selection.entitySelector.moduleKey}
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							ruleKind: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const ruleKind = entity.ruleKind}
					{#if ruleKind != null}
						<div>
							<dt>rule kind</dt>
							<dd>
								{ruleKind}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
