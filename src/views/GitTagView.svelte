<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'


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
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.GitTag>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.GitTag>>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const gitTag = $derived(selection({
		fields: {
			tagName: true,
			targetKind: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.tagName) ?? ''), String((pendingEntity.objectId) ?? '')].filter(Boolean).join(' ') || 'Git tag')
	const viewDomId = $derived('git-tag-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import GitSignaturesView from '$/views/GitSignaturesView.svelte'
	import GitObjectView from '$/views/GitObjectView.svelte'
</script>


<EntityView
	entityType={EntityType.GitTag}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={gitTag}>
			{#snippet Pending()}
				{[String((pendingEntity.tagName) ?? ''), String((pendingEntity.objectId) ?? '')].filter(Boolean).join(' ') || title || 'Git tag'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.tagName) ?? ''), String((resolvedEntity.objectId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={gitTag}>
			{#snippet Pending()}
				{[String((pendingEntity.targetKind) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.tagName) ?? ''), String((pendingEntity.objectId) ?? '')].filter(Boolean).join(' ') || title || 'Git tag'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.targetKind) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.tagName) ?? ''), String((resolvedEntity.objectId) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>object ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									objectId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const objectId = pendingEntity.objectId}
							{#if objectId !== undefined && objectId !== null}
								<TruncatedValue value={String((objectId) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const objectId = resolvedEntity.objectId}
							{#if objectId !== undefined && objectId !== null}
								<TruncatedValue value={String((objectId) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>object format</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									objectFormat: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const objectFormat = pendingEntity.objectFormat}
							{#if objectFormat !== undefined && objectFormat !== null}
								{String((objectFormat) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const objectFormat = resolvedEntity.objectFormat}
							{#if objectFormat !== undefined && objectFormat !== null}
								{String((objectFormat) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>object</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$object}
					>
						{#snippet children(gitObject)}
							{#if gitObject != null && gitObject[EntityMetaKey.Selector] != null}
								<GitObjectView
									selection={select(EntityType.GitObject, gitObject[EntityMetaKey.Selector])}
									prefetched={gitObject}
									layout={EntityLayout.Value}
									open={false}
								/>
							{/if}
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
						{#snippet Pending()}
							{@const targetObjectId = pendingEntity.targetObjectId}
							{#if targetObjectId !== undefined && targetObjectId !== null}
								<TruncatedValue value={String((targetObjectId) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const targetObjectId = resolvedEntity.targetObjectId}
							{#if targetObjectId !== undefined && targetObjectId !== null}
								<TruncatedValue value={String((targetObjectId) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							targetKind: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const targetKind = pendingEntity.targetKind}
					{#if targetKind !== undefined && targetKind !== null}
						<div>
							<dt>target kind</dt>
							<dd>
								{String((targetKind) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const targetKind = resolvedEntity.targetKind}
					{#if targetKind !== undefined && targetKind !== null}
						<div>
							<dt>target kind</dt>
							<dd>
								{String((targetKind) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							tagName: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const tagName = pendingEntity.tagName}
					{#if tagName !== undefined && tagName !== null}
						<div>
							<dt>tag name</dt>
							<dd>
								{String((tagName) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const tagName = resolvedEntity.tagName}
					{#if tagName !== undefined && tagName !== null}
						<div>
							<dt>tag name</dt>
							<dd>
								{String((tagName) ?? '')}
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
				{#snippet Pending()}
					{@const taggerTimestampMs = pendingEntity.taggerTimestampMs}
					{#if taggerTimestampMs !== undefined && taggerTimestampMs !== null}
						<div>
							<dt>tagger timestamp ms</dt>
							<dd>
								<Timestamp timestamp={Number(taggerTimestampMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const taggerTimestampMs = resolvedEntity.taggerTimestampMs}
					{#if taggerTimestampMs !== undefined && taggerTimestampMs !== null}
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
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const message = resolvedEntity.message}
				{#if message !== undefined && message !== null && message !== ''}
					<p data-text="long-text">{String((message) ?? '')}</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<GitSignaturesView
				selection={
						selection.$$signatures({
							count: true,
						})
					}
				title='signatures'
				emptyText='No signatures.'
				id='GitSignaturesView-signatures'
			/>
		{/if}
	{/snippet}
</EntityView>
