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
			selection: EntityProxyResource<typeof schema, EntityType.GitPackfile>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.GitPackfile>>
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
	const gitPackfile = $derived(selection({
		fields: {
			objectFormat: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.packHash ?? prefetched.packHash) ?? '')].filter(Boolean).join(' ') || 'Git packfile')
	const viewDomId = $derived('git-packfile-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import GitRepositoryView from '$/views/GitRepositoryView.svelte'
</script>


<EntityView
	entityType={EntityType.GitPackfile}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={gitPackfile}>
			{#snippet Pending()}
				{@const packHash0 = selection.entitySelector.packHash ?? prefetched.packHash}
				{#if packHash0 !== undefined && packHash0 !== null}
					<TruncatedValue value={String((packHash0) ?? '')} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const packHash0 = resolvedEntity.packHash}
				{#if packHash0 !== undefined && packHash0 !== null}
					<TruncatedValue value={String((packHash0) ?? '')} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={gitPackfile}>
			{#snippet Pending()}
				{[String((prefetched.objectFormat) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.packHash ?? prefetched.packHash) ?? '')].filter(Boolean).join(' ') || title || 'Git packfile'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.objectFormat) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.packHash) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>pack hash</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									packHash: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const packHash = selection.entitySelector.packHash ?? prefetched.packHash}
							{#if packHash !== undefined && packHash !== null}
								<TruncatedValue value={String((packHash) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const packHash = resolvedEntity.packHash}
							{#if packHash !== undefined && packHash !== null}
								<TruncatedValue value={String((packHash) ?? '')} />
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
							{@const objectFormat = prefetched.objectFormat}
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							objectCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const objectCount = prefetched.objectCount}
					{#if objectCount !== undefined && objectCount !== null}
						<div>
							<dt>object count</dt>
							<dd>
								<NumberValue value={Number(objectCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const objectCount = resolvedEntity.objectCount}
					{#if objectCount !== undefined && objectCount !== null}
						<div>
							<dt>object count</dt>
							<dd>
								<NumberValue value={Number(objectCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							packSizeBytes: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const packSizeBytes = prefetched.packSizeBytes}
					{#if packSizeBytes !== undefined && packSizeBytes !== null}
						<div>
							<dt>pack size bytes</dt>
							<dd>
								<NumberValue value={Number(packSizeBytes)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const packSizeBytes = resolvedEntity.packSizeBytes}
					{#if packSizeBytes !== undefined && packSizeBytes !== null}
						<div>
							<dt>pack size bytes</dt>
							<dd>
								<NumberValue value={Number(packSizeBytes)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							indexHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const indexHash = prefetched.indexHash}
					{#if indexHash !== undefined && indexHash !== null}
						<div>
							<dt>index hash</dt>
							<dd>
								<TruncatedValue value={String((indexHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const indexHash = resolvedEntity.indexHash}
					{#if indexHash !== undefined && indexHash !== null}
						<div>
							<dt>index hash</dt>
							<dd>
								<TruncatedValue value={String((indexHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$repository}
			>
				{#snippet children(gitRepository)}
					{#if gitRepository != null && gitRepository[EntityMetaKey.Selector] != null}
						<div>
							<dt>repository</dt>
							<dd>
								<GitRepositoryView
									selection={select(EntityType.GitRepository, gitRepository[EntityMetaKey.Selector])}
									prefetched={gitRepository}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
