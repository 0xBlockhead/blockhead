<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.TezosBigMapDiff>, 'prefetched'> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import TezosOperationView from '$/views/TezosOperationView.svelte'
	import TezosBigMapView from '$/views/TezosBigMapView.svelte'
</script>


<EntityView
	entityType={EntityType.TezosBigMapDiff}
	entitySelector={selection.entitySelector}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>operation</dt>
				<dd>
					<TezosOperationView
						selection={select(EntityType.TezosOperation, selection.entitySelector.$operation)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>big map ID</dt>
				<dd>
					{selection.entitySelector.bigMapId}
				</dd>
			</div>

			<div>
				<dt>key hash</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.keyHash} />
				</dd>
			</div>

			<div>
				<dt>action</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									action: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.action}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$bigMap}
			>
				{#snippet children(tezosBigMap)}
					{#if tezosBigMap != null}
						<div>
							<dt>big map</dt>
							<dd>
								<TezosBigMapView
									selection={select(EntityType.TezosBigMap, tezosBigMap[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
