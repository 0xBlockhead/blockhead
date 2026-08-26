<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.GitFetchObservation>, 'prefetched'> = $props()

	const gitFetchObservation = $derived(selection({
		fields: {
			status: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.remoteName || 'Git fetch observation')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import GitRepositoryView from '$/views/GitRepositoryView.svelte'
</script>


<EntityView
	entityType={EntityType.GitFetchObservation}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			(
				'repositoryId' in selection.entitySelector.$repository ?
					resolve(
						'/git/repository/id/[repositoryId=stringSegment]/(gitRepository)/remote/[remoteName=stringSegment]/(gitRemote)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
						{
							repositoryId: selection.entitySelector.$repository.repositoryId,
							remoteName: selection.entitySelector.remoteName,
							timestampMs: String(selection.entitySelector.timestampMs),
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
	{#snippet Value()}
		<ResourceBoundary resource={gitFetchObservation}>
			{#snippet children(entity)}
				{entity.status || selection.entitySelector.remoteName || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<Timestamp timestamp={selection.entitySelector.timestampMs} />
		</span>

		<span data-text="muted">
			{selection.entitySelector.source}
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>repository</dt>
				<dd>
					<GitRepositoryView
						selection={select(EntityType.GitRepository, selection.entitySelector.$repository)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>remote name</dt>
				<dd>
					{selection.entitySelector.remoteName}
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>

			<div>
				<dt>status</dt>
				<dd>
					<ResourceBoundary
						resource={gitFetchObservation}
					>
						{#snippet children(entity)}
							{entity.status}
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
				{#snippet children(entity)}
					{@const protocolVersion = entity.protocolVersion}
					{#if protocolVersion != null}
						<div>
							<dt>protocol version</dt>
							<dd>
								{protocolVersion}
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
				{#snippet children(entity)}
					{@const advertisedRefs = entity.advertisedRefs}
					{#if advertisedRefs != null}
						<div>
							<dt>advertised refs</dt>
							<dd>
								<NumberValue
									value={advertisedRefs}
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
							wantedObjects: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const wantedObjects = entity.wantedObjects}
					{#if wantedObjects != null}
						<div>
							<dt>wanted objects</dt>
							<dd>
								<NumberValue
									value={wantedObjects}
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
							receivedObjects: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const receivedObjects = entity.receivedObjects}
					{#if receivedObjects != null}
						<div>
							<dt>received objects</dt>
							<dd>
								<NumberValue
									value={receivedObjects}
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
							packfileHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const packfileHash = entity.packfileHash}
					{#if packfileHash != null}
						<div>
							<dt>packfile hash</dt>
							<dd>
								<TruncatedValue value={packfileHash} />
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
				{#snippet children(entity)}
					{@const error = entity.error}
					{#if error != null}
						<div>
							<dt>error</dt>
							<dd>
								{error}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
