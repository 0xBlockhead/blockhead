<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'


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
	}: EntitySelectionViewProps<EntityType.GitTag> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const gitTag = $derived(selection({
		fields: {
			tagName: true,
			targetKind: true,
		},
	}))
	const titleFallback = $derived([(pendingEntity.tagName ?? ''), String(pendingEntity.objectId ?? '')].filter(Boolean).join(' ') || 'Git tag')


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
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={gitTag}>
			{#snippet children(entity)}
				{[(entity.tagName ?? ''), String(pendingEntity.objectId)].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={gitTag}>
			{#snippet children(entity)}
				{(entity.targetKind ?? '') || [(entity.tagName ?? ''), String(pendingEntity.objectId)].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>object ID</dt>
				<dd>
					<TruncatedValue value={String(pendingEntity.objectId)} />
				</dd>
			</div>

			<div>
				<dt>object format</dt>
				<dd>
					{pendingEntity.objectFormat}
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
								prefetched={gitObject}
								layout={EntityLayout.Value}
								open={false}
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
							<TruncatedValue value={String(entity.targetObjectId)} />
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
								<Timestamp timestamp={Number(taggerTimestampMs)} />
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

	{#snippet Details({ open: detailsOpen })}
		{@const gitTagGitSignaturesViewSignaturesResource = selection.$$signatures}
		<ResourceBoundary
			resource={gitTagGitSignaturesViewSignaturesResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<GitSignaturesView
						selection={gitTagGitSignaturesViewSignaturesResource}
						countResource={gitTagGitSignaturesViewSignaturesResource.count}
						title='signatures'
						id='signatures'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
