<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.AtprotoRepoCommit>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.AtprotoRepoCommit>>
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
	const atprotoRepoCommit = $derived(selection({}))
	const titleFallback = $derived([String((pendingEntity.rev) ?? ''), String((pendingEntity.commitCid) ?? '')].filter(Boolean).join(' ') || 'AT Protocol repo commit')
	const viewDomId = $derived('atproto-repo-commit-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AtprotoPostsView from '$/views/AtprotoPostsView.svelte'
</script>


<EntityView
	entityType={EntityType.AtprotoRepoCommit}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={atprotoRepoCommit}>
			{#snippet Pending()}
				{[String((pendingEntity.rev) ?? ''), String((pendingEntity.commitCid) ?? '')].filter(Boolean).join(' ') || title || 'AT Protocol repo commit'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.rev) ?? ''), String((resolvedEntity.commitCid) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={atprotoRepoCommit}>
			{#snippet Pending()}
				{[String((pendingEntity.repoDid) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.rev) ?? ''), String((pendingEntity.commitCid) ?? '')].filter(Boolean).join(' ') || title || 'AT Protocol repo commit'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.repoDid) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.rev) ?? ''), String((resolvedEntity.commitCid) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={atprotoRepoCommit}>
			{#snippet Pending()}
				{@const source0 = pendingEntity.source}
				{#if source0 !== undefined && source0 !== null}
					<span data-text="muted">
						{String((source0) ?? '')}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const source0 = resolvedEntity.source}
				{#if source0 !== undefined && source0 !== null}
					<span data-text="muted">
						{String((source0) ?? '')}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Repo DID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									repoDid: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const repoDid = pendingEntity.repoDid}
							{#if repoDid !== undefined && repoDid !== null}
								{String((repoDid) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const repoDid = resolvedEntity.repoDid}
							{#if repoDid !== undefined && repoDid !== null}
								{String((repoDid) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Rev</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									rev: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const rev = pendingEntity.rev}
							{#if rev !== undefined && rev !== null}
								{String((rev) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const rev = resolvedEntity.rev}
							{#if rev !== undefined && rev !== null}
								{String((rev) ?? '')}
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
							{@const source = pendingEntity.source}
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							commitCid: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const commitCid = pendingEntity.commitCid}
					{#if commitCid !== undefined && commitCid !== null}
						<div>
							<dt>Commit CID</dt>
							<dd>
								<TruncatedValue value={String((commitCid) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const commitCid = resolvedEntity.commitCid}
					{#if commitCid !== undefined && commitCid !== null}
						<div>
							<dt>Commit CID</dt>
							<dd>
								<TruncatedValue value={String((commitCid) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							previousRev: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const previousRev = pendingEntity.previousRev}
					{#if previousRev !== undefined && previousRev !== null}
						<div>
							<dt>Previous rev</dt>
							<dd>
								{String((previousRev) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const previousRev = resolvedEntity.previousRev}
					{#if previousRev !== undefined && previousRev !== null}
						<div>
							<dt>Previous rev</dt>
							<dd>
								{String((previousRev) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							previousDataCid: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const previousDataCid = pendingEntity.previousDataCid}
					{#if previousDataCid !== undefined && previousDataCid !== null}
						<div>
							<dt>Previous data CID</dt>
							<dd>
								<TruncatedValue value={String((previousDataCid) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const previousDataCid = resolvedEntity.previousDataCid}
					{#if previousDataCid !== undefined && previousDataCid !== null}
						<div>
							<dt>Previous data CID</dt>
							<dd>
								<TruncatedValue value={String((previousDataCid) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							dataCid: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const dataCid = pendingEntity.dataCid}
					{#if dataCid !== undefined && dataCid !== null}
						<div>
							<dt>Data CID</dt>
							<dd>
								<TruncatedValue value={String((dataCid) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const dataCid = resolvedEntity.dataCid}
					{#if dataCid !== undefined && dataCid !== null}
						<div>
							<dt>Data CID</dt>
							<dd>
								<TruncatedValue value={String((dataCid) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							sequence: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const sequence = pendingEntity.sequence}
					{#if sequence !== undefined && sequence !== null}
						<div>
							<dt>Sequence</dt>
							<dd>
								{String((sequence) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sequence = resolvedEntity.sequence}
					{#if sequence !== undefined && sequence !== null}
						<div>
							<dt>Sequence</dt>
							<dd>
								{String((sequence) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							pdsHost: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const pdsHost = pendingEntity.pdsHost}
					{#if pdsHost !== undefined && pdsHost !== null}
						<div>
							<dt>PDS host</dt>
							<dd>
								{String((pdsHost) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const pdsHost = resolvedEntity.pdsHost}
					{#if pdsHost !== undefined && pdsHost !== null}
						<div>
							<dt>PDS host</dt>
							<dd>
								{String((pdsHost) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							relayHost: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const relayHost = pendingEntity.relayHost}
					{#if relayHost !== undefined && relayHost !== null}
						<div>
							<dt>Relay host</dt>
							<dd>
								{String((relayHost) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const relayHost = resolvedEntity.relayHost}
					{#if relayHost !== undefined && relayHost !== null}
						<div>
							<dt>Relay host</dt>
							<dd>
								{String((relayHost) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							time: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const time = pendingEntity.time}
					{#if time !== undefined && time !== null}
						<div>
							<dt>Time</dt>
							<dd>
								<Timestamp timestamp={Number(time)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const time = resolvedEntity.time}
					{#if time !== undefined && time !== null}
						<div>
							<dt>Time</dt>
							<dd>
								<Timestamp timestamp={Number(time)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							tooBig: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const tooBig = pendingEntity.tooBig}
					{#if tooBig !== undefined && tooBig !== null}
						<div>
							<dt>Too big</dt>
							<dd>
								{tooBig ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const tooBig = resolvedEntity.tooBig}
					{#if tooBig !== undefined && tooBig !== null}
						<div>
							<dt>Too big</dt>
							<dd>
								{tooBig ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							rebase: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const rebase = pendingEntity.rebase}
					{#if rebase !== undefined && rebase !== null}
						<div>
							<dt>Rebase</dt>
							<dd>
								{rebase ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const rebase = resolvedEntity.rebase}
					{#if rebase !== undefined && rebase !== null}
						<div>
							<dt>Rebase</dt>
							<dd>
								{rebase ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							operationCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const operationCount = pendingEntity.operationCount}
					{#if operationCount !== undefined && operationCount !== null}
						<div>
							<dt>Operation count</dt>
							<dd>
								{String((operationCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const operationCount = resolvedEntity.operationCount}
					{#if operationCount !== undefined && operationCount !== null}
						<div>
							<dt>Operation count</dt>
							<dd>
								{String((operationCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							blobCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const blobCount = pendingEntity.blobCount}
					{#if blobCount !== undefined && blobCount !== null}
						<div>
							<dt>Blob count</dt>
							<dd>
								{String((blobCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const blobCount = resolvedEntity.blobCount}
					{#if blobCount !== undefined && blobCount !== null}
						<div>
							<dt>Blob count</dt>
							<dd>
								{String((blobCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							carByteLength: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const carByteLength = pendingEntity.carByteLength}
					{#if carByteLength !== undefined && carByteLength !== null}
						<div>
							<dt>CAR byte length</dt>
							<dd>
								{String((carByteLength) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const carByteLength = resolvedEntity.carByteLength}
					{#if carByteLength !== undefined && carByteLength !== null}
						<div>
							<dt>CAR byte length</dt>
							<dd>
								{String((carByteLength) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Operation paths</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									operationPaths: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const operationPaths = pendingEntity.operationPaths}
							{#if operationPaths !== undefined && operationPaths !== null}
								{operationPaths.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const operationPaths = resolvedEntity.operationPaths}
							{#if operationPaths !== undefined && operationPaths !== null}
								{operationPaths.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Created record CIDs</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									createdRecordCids: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const createdRecordCids = pendingEntity.createdRecordCids}
							{#if createdRecordCids !== undefined && createdRecordCids !== null}
								{createdRecordCids.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const createdRecordCids = resolvedEntity.createdRecordCids}
							{#if createdRecordCids !== undefined && createdRecordCids !== null}
								{createdRecordCids.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Updated record CIDs</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									updatedRecordCids: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const updatedRecordCids = pendingEntity.updatedRecordCids}
							{#if updatedRecordCids !== undefined && updatedRecordCids !== null}
								{updatedRecordCids.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const updatedRecordCids = resolvedEntity.updatedRecordCids}
							{#if updatedRecordCids !== undefined && updatedRecordCids !== null}
								{updatedRecordCids.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Deleted record paths</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									deletedRecordPaths: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const deletedRecordPaths = pendingEntity.deletedRecordPaths}
							{#if deletedRecordPaths !== undefined && deletedRecordPaths !== null}
								{deletedRecordPaths.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const deletedRecordPaths = resolvedEntity.deletedRecordPaths}
							{#if deletedRecordPaths !== undefined && deletedRecordPaths !== null}
								{deletedRecordPaths.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<AtprotoPostsView
				selection={
						selection.$$posts({
							count: true,
						})
					}
				title='Posts'
				href={resolve('/atproto/posts')}
				emptyText='No posts in this commit.'
				id='AtprotoPostsView-posts'
			/>
		{/if}
	{/snippet}
</EntityView>
