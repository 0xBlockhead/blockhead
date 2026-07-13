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
			selection: EntityProxyResource<typeof schema, EntityType.GitRefUpdate>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.GitRefUpdate>>
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
	const gitRefUpdate = $derived(selection({
		fields: {
			updateKind: true,
			timestampMs: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.refName) ?? '')].filter(Boolean).join(' ') || 'Git ref update')
	const viewDomId = $derived('git-ref-update-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import GitRepositoryView from '$/views/GitRepositoryView.svelte'
	import GitSignatureView from '$/views/GitSignatureView.svelte'
</script>


<EntityView
	entityType={EntityType.GitRefUpdate}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={gitRefUpdate}>
			{#snippet Pending()}
				{[String((pendingEntity.refName) ?? '')].filter(Boolean).join(' ') || title || 'Git ref update'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.refName) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={gitRefUpdate}>
			{#snippet Pending()}
				{[String((pendingEntity.updateKind) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.refName) ?? '')].filter(Boolean).join(' ') || title || 'Git ref update'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.updateKind) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.refName) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={gitRefUpdate}>
			{#snippet Pending()}
				{@const timestampMs0 = pendingEntity.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(timestampMs0)} />
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const timestampMs0 = resolvedEntity.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(timestampMs0)} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>repository</dt>
				<dd>
					<GitRepositoryView
						selection={select(EntityType.GitRepository, selection.entitySelector.$repository, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>ref name</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									refName: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const refName = pendingEntity.refName}
							{#if refName !== undefined && refName !== null}
								{String((refName) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const refName = resolvedEntity.refName}
							{#if refName !== undefined && refName !== null}
								{String((refName) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>old object ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									oldObjectId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const oldObjectId = pendingEntity.oldObjectId}
							{#if oldObjectId !== undefined && oldObjectId !== null}
								<TruncatedValue value={String((oldObjectId) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const oldObjectId = resolvedEntity.oldObjectId}
							{#if oldObjectId !== undefined && oldObjectId !== null}
								<TruncatedValue value={String((oldObjectId) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>new object ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									newObjectId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const newObjectId = pendingEntity.newObjectId}
							{#if newObjectId !== undefined && newObjectId !== null}
								<TruncatedValue value={String((newObjectId) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const newObjectId = resolvedEntity.newObjectId}
							{#if newObjectId !== undefined && newObjectId !== null}
								<TruncatedValue value={String((newObjectId) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>update kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									updateKind: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const updateKind = pendingEntity.updateKind}
							{#if updateKind !== undefined && updateKind !== null}
								{String((updateKind) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const updateKind = resolvedEntity.updateKind}
							{#if updateKind !== undefined && updateKind !== null}
								{String((updateKind) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							timestampMs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const timestampMs = pendingEntity.timestampMs}
					{#if timestampMs !== undefined && timestampMs !== null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={Number(timestampMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const timestampMs = resolvedEntity.timestampMs}
					{#if timestampMs !== undefined && timestampMs !== null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={Number(timestampMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$signature}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(gitSignature)}
					{#if gitSignature != null && gitSignature[EntityMetaKey.Selector] != null}
						<div>
							<dt>signature</dt>
							<dd>
								<GitSignatureView
									selection={select(EntityType.GitSignature, gitSignature[EntityMetaKey.Selector])}
									prefetched={gitSignature}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							source: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const source = pendingEntity.source}
					{#if source !== undefined && source !== null}
						<div>
							<dt>Source</dt>
							<dd>
								{String((source) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const source = resolvedEntity.source}
					{#if source !== undefined && source !== null}
						<div>
							<dt>Source</dt>
							<dd>
								{String((source) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
