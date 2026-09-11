<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.BlockheadAction> = $props()

	const blockheadAction = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
		],
		fields: {
			content: true,
			contentRevisionHash: true,
			createdAt: true,
			updatedAt: true,
		},
	}))
	const titleFallback = $derived((prefetched.contentRevisionHash ?? '') || 'blockhead action')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadAction}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/~/action/[actionId=stringSegment]',
				{
					actionId: selection.entitySelector.id,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadAction}>
			{#snippet children(entity)}
				{entity.contentRevisionHash || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>ID</dt>
				<dd>
					{selection.entitySelector.id}
				</dd>
			</div>

			<div>
				<dt>content revision hash</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadAction}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.contentRevisionHash} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Created</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadAction}
					>
						{#snippet children(entity)}
							<Timestamp timestamp={entity.createdAt} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Updated</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadAction}
					>
						{#snippet children(entity)}
							<Timestamp timestamp={entity.updatedAt} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
