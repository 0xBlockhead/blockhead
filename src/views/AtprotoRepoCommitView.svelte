<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.AtprotoRepoCommit> = $props()

	const atprotoRepoCommit = $derived(selection({
		fields: {
			rev: true,
			commitCid: true,
		},
	}))
	const titleFallback = $derived([(prefetched.rev ?? ''), (prefetched.commitCid ?? '')].filter(Boolean).join(' ') || 'AT Protocol repo commit')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AtprotoPostsView from '$/views/AtprotoPostsView.svelte'
</script>


<EntityView
	entityType={EntityType.AtprotoRepoCommit}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			(
				'rev' in selection.entitySelector ?
					resolve(
						'/(social)/(atproto)/atproto/(globalAtprotoNetwork)/repo/[repoDid=stringSegment]/commit/rev/[rev=stringSegment]/[source=stringSegment]',
						{
							repoDid: selection.entitySelector.repoDid,
							rev: selection.entitySelector.rev,
							source: selection.entitySelector.source,
						}
					)
				:
					'commitCid' in selection.entitySelector ?
						resolve(
							'/(social)/(atproto)/atproto/(globalAtprotoNetwork)/repo/[repoDid=stringSegment]/commit/cid/[commitCid=stringSegment]/[source=stringSegment]',
							{
								repoDid: selection.entitySelector.repoDid,
								commitCid: selection.entitySelector.commitCid,
								source: selection.entitySelector.source,
							}
						)
					:
						undefined
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={atprotoRepoCommit}>
			{#snippet children(entity)}
				{[entity.rev, entity.commitCid].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		{selection.entitySelector.repoDid || [(prefetched.rev ?? ''), (prefetched.commitCid ?? '')].filter(Boolean).join(' ') || titleFallback}
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			{selection.entitySelector.source}
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Repo DID</dt>
				<dd>
					{selection.entitySelector.repoDid}
				</dd>
			</div>

			<div>
				<dt>Rev</dt>
				<dd>
					<ResourceBoundary
						resource={atprotoRepoCommit}
					>
						{#snippet children(entity)}
							{entity.rev}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>

			<div>
				<dt>Commit CID</dt>
				<dd>
					<ResourceBoundary
						resource={atprotoRepoCommit}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.commitCid} />
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
							previousRev: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const previousRev = entity.previousRev}
					{#if previousRev != null}
						<div>
							<dt>Previous rev</dt>
							<dd>
								{previousRev}
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
				{#snippet children(entity)}
					{@const previousDataCid = entity.previousDataCid}
					{#if previousDataCid != null}
						<div>
							<dt>Previous data CID</dt>
							<dd>
								<TruncatedValue value={previousDataCid} />
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
				{#snippet children(entity)}
					{@const dataCid = entity.dataCid}
					{#if dataCid != null}
						<div>
							<dt>Data CID</dt>
							<dd>
								<TruncatedValue value={dataCid} />
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
				{#snippet children(entity)}
					{@const sequence = entity.sequence}
					{#if sequence != null}
						<div>
							<dt>Sequence</dt>
							<dd>
								{sequence}
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
				{#snippet children(entity)}
					{@const pdsHost = entity.pdsHost}
					{#if pdsHost != null}
						<div>
							<dt>PDS host</dt>
							<dd>
								{pdsHost}
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
				{#snippet children(entity)}
					{@const relayHost = entity.relayHost}
					{#if relayHost != null}
						<div>
							<dt>Relay host</dt>
							<dd>
								{relayHost}
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
				{#snippet children(entity)}
					{@const time = entity.time}
					{#if time != null}
						<div>
							<dt>Time</dt>
							<dd>
								<Timestamp timestamp={time} />
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
				{#snippet children(entity)}
					{@const tooBig = entity.tooBig}
					{#if tooBig != null}
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
				{#snippet children(entity)}
					{@const rebase = entity.rebase}
					{#if rebase != null}
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
				{#snippet children(entity)}
					{@const operationCount = entity.operationCount}
					{#if operationCount != null}
						<div>
							<dt>Operation count</dt>
							<dd>
								{operationCount}
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
				{#snippet children(entity)}
					{@const blobCount = entity.blobCount}
					{#if blobCount != null}
						<div>
							<dt>Blob count</dt>
							<dd>
								{blobCount}
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
				{#snippet children(entity)}
					{@const carByteLength = entity.carByteLength}
					{#if carByteLength != null}
						<div>
							<dt>CAR byte length</dt>
							<dd>
								{carByteLength}
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
						{#snippet children(entity)}
							{entity.operationPaths.values.join(', ')}
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
						{#snippet children(entity)}
							{entity.createdRecordCids.values.join(', ')}
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
						{#snippet children(entity)}
							{entity.updatedRecordCids.values.join(', ')}
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
						{#snippet children(entity)}
							{entity.deletedRecordPaths.values.join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const postsResource = selection.$$posts}
		<ResourceBoundary
			resource={postsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<AtprotoPostsView
						selection={postsResource}
						countResource={postsResource.count}
						title='Posts'
						id='posts'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
