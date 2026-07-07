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
			selection: EntityProxyResource<typeof schema, EntityType.GitFetchObservation>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.GitFetchObservation>>
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
	const gitFetchObservation = $derived(selection({
		fields: {
			status: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.remoteName ?? prefetched.remoteName) ?? '')].filter(Boolean).join(' ') || 'Git fetch observation')
	const viewDomId = $derived('git-fetch-observation-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import GitRepositoryView from '$/views/GitRepositoryView.svelte'
</script>


<EntityView
	entityType={EntityType.GitFetchObservation}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={gitFetchObservation}>
			{#snippet Pending()}
				{[String((selection.entitySelector.remoteName ?? prefetched.remoteName) ?? '')].filter(Boolean).join(' ') || title || 'Git fetch observation'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.remoteName) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={gitFetchObservation}>
			{#snippet Pending()}
				{[String((prefetched.status) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.remoteName ?? prefetched.remoteName) ?? '')].filter(Boolean).join(' ') || title || 'Git fetch observation'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.status) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.remoteName) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={gitFetchObservation}>
			{#snippet Pending()}
				{@const timestampMs0 = selection.entitySelector.timestampMs ?? prefetched.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(timestampMs0)} />
					</span>
				{/if}
				{@const source1 = selection.entitySelector.source ?? prefetched.source}
				{#if source1 !== undefined && source1 !== null}
					<span data-text="muted">
						{String((source1) ?? '')}
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
				{@const source1 = resolvedEntity.source}
				{#if source1 !== undefined && source1 !== null}
					<span data-text="muted">
						{String((source1) ?? '')}
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
				<dt>remote name</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									remoteName: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const remoteName = selection.entitySelector.remoteName ?? prefetched.remoteName}
							{#if remoteName !== undefined && remoteName !== null}
								{String((remoteName) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const remoteName = resolvedEntity.remoteName}
							{#if remoteName !== undefined && remoteName !== null}
								{String((remoteName) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
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
							{@const timestampMs = selection.entitySelector.timestampMs ?? prefetched.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const timestampMs = resolvedEntity.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
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
							{@const source = selection.entitySelector.source ?? prefetched.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const source = resolvedEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>status</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									status: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const status = prefetched.status}
							{#if status !== undefined && status !== null}
								{String((status) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const status = resolvedEntity.status}
							{#if status !== undefined && status !== null}
								{String((status) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							protocolVersion: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const protocolVersion = prefetched.protocolVersion}
					{#if protocolVersion !== undefined && protocolVersion !== null}
						<div>
							<dt>protocol version</dt>
							<dd>
								{String((protocolVersion) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const protocolVersion = resolvedEntity.protocolVersion}
					{#if protocolVersion !== undefined && protocolVersion !== null}
						<div>
							<dt>protocol version</dt>
							<dd>
								{String((protocolVersion) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							advertisedRefs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const advertisedRefs = prefetched.advertisedRefs}
					{#if advertisedRefs !== undefined && advertisedRefs !== null}
						<div>
							<dt>advertised refs</dt>
							<dd>
								<NumberValue value={Number(advertisedRefs)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const advertisedRefs = resolvedEntity.advertisedRefs}
					{#if advertisedRefs !== undefined && advertisedRefs !== null}
						<div>
							<dt>advertised refs</dt>
							<dd>
								<NumberValue value={Number(advertisedRefs)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							wantedObjects: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const wantedObjects = prefetched.wantedObjects}
					{#if wantedObjects !== undefined && wantedObjects !== null}
						<div>
							<dt>wanted objects</dt>
							<dd>
								<NumberValue value={Number(wantedObjects)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const wantedObjects = resolvedEntity.wantedObjects}
					{#if wantedObjects !== undefined && wantedObjects !== null}
						<div>
							<dt>wanted objects</dt>
							<dd>
								<NumberValue value={Number(wantedObjects)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							receivedObjects: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const receivedObjects = prefetched.receivedObjects}
					{#if receivedObjects !== undefined && receivedObjects !== null}
						<div>
							<dt>received objects</dt>
							<dd>
								<NumberValue value={Number(receivedObjects)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const receivedObjects = resolvedEntity.receivedObjects}
					{#if receivedObjects !== undefined && receivedObjects !== null}
						<div>
							<dt>received objects</dt>
							<dd>
								<NumberValue value={Number(receivedObjects)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							packfileHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const packfileHash = prefetched.packfileHash}
					{#if packfileHash !== undefined && packfileHash !== null}
						<div>
							<dt>packfile hash</dt>
							<dd>
								<TruncatedValue value={String((packfileHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const packfileHash = resolvedEntity.packfileHash}
					{#if packfileHash !== undefined && packfileHash !== null}
						<div>
							<dt>packfile hash</dt>
							<dd>
								<TruncatedValue value={String((packfileHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							error: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const error = prefetched.error}
					{#if error !== undefined && error !== null}
						<div>
							<dt>error</dt>
							<dd>
								{String((error) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const error = resolvedEntity.error}
					{#if error !== undefined && error !== null}
						<div>
							<dt>error</dt>
							<dd>
								{String((error) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
