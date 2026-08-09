<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.GitTag> = $props()

	const gitTag = $derived(selection({
		fields: {
			tagName: true,
			targetKind: true,
		},
	}))
	const titleFallback = $derived([(prefetched.tagName ?? ''), selection.entitySelector.objectId].filter(Boolean).join(' ') || 'Git tag')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import GitSignaturesView from '$/views/GitSignaturesView.svelte'
	import GitObjectView from '$/views/GitObjectView.svelte'
</script>


<EntityView
	entityType={EntityType.GitTag}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/git/tag/[objectId=zeroExHex]/[objectFormat=stringSegment]',
				{
					objectId: selection.entitySelector.objectId,
					objectFormat: selection.entitySelector.objectFormat,
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
		<ResourceBoundary resource={gitTag}>
			{#snippet children(entity)}
				{[(entity.tagName ?? ''), selection.entitySelector.objectId].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={gitTag}>
			{#snippet children(entity)}
				{(entity.targetKind ?? '') || [(entity.tagName ?? ''), selection.entitySelector.objectId].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>object ID</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.objectId} />
				</dd>
			</div>

			<div>
				<dt>object format</dt>
				<dd>
					{selection.entitySelector.objectFormat}
				</dd>
			</div>

			<div>
				<dt>object</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$object}
					>
						{#snippet children(gitObject)}
							<GitObjectView
								selection={select(EntityType.GitObject, gitObject[EntityMetaKey.Selector])}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>target object ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									targetObjectId: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.targetObjectId} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={gitTag}
			>
				{#snippet children(entity)}
					{@const targetKind = entity.targetKind}
					{#if targetKind != null}
						<div>
							<dt>target kind</dt>
							<dd>
								{targetKind}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={gitTag}
			>
				{#snippet children(entity)}
					{@const tagName = entity.tagName}
					{#if tagName != null}
						<div>
							<dt>tag name</dt>
							<dd>
								{tagName}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							taggerTimestampMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const taggerTimestampMs = entity.taggerTimestampMs}
					{#if taggerTimestampMs != null}
						<div>
							<dt>tagger timestamp ms</dt>
							<dd>
								<Timestamp timestamp={taggerTimestampMs} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<ResourceBoundary
			resource={
				selection({
					fields: {
						message: true,
					},
				})
			}
		>
			{#snippet children(entity)}
				{@const message = entity.message}
				{#if message != null && message !== ''}
					<p data-text="long-text">{message}</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details()}
		{@const signaturesResource = selection.$$signatures}
		<ResourceBoundary
			resource={signaturesResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<GitSignaturesView
						selection={signaturesResource}
						countResource={signaturesResource.count}
						title='signatures'
						id='signatures'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
