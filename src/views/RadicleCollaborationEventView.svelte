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
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.RadicleCollaborationEvent>, 'prefetched'> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import RadicleRepositoryView from '$/views/RadicleRepositoryView.svelte'
	import GitCommitView from '$/views/GitCommitView.svelte'
	import GitObjectView from '$/views/GitObjectView.svelte'
</script>


<EntityView
	entityType={EntityType.RadicleCollaborationEvent}
	entitySelector={selection.entitySelector}
	href={
		href === undefined ?
			resolve(
				'/radicle/repository/[rid=stringSegment]/(radicleRepository)/event/[eventId=stringSegment]',
				{
					rid: selection.entitySelector.$repository.rid,
					eventId: selection.entitySelector.eventId,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>repository</dt>
				<dd>
					<RadicleRepositoryView
						selection={select(EntityType.RadicleRepository, selection.entitySelector.$repository)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>event ID</dt>
				<dd>
					{selection.entitySelector.eventId}
				</dd>
			</div>

			<div>
				<dt>event kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									eventKind: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.eventKind}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							authorDid: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const authorDid = entity.authorDid}
					{#if authorDid != null}
						<div>
							<dt>author DID</dt>
							<dd>
								{authorDid}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							payloadHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const payloadHash = entity.payloadHash}
					{#if payloadHash != null}
						<div>
							<dt>payload hash</dt>
							<dd>
								<TruncatedValue value={payloadHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							payloadObjectId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const payloadObjectId = entity.payloadObjectId}
					{#if payloadObjectId != null}
						<div>
							<dt>payload object ID</dt>
							<dd>
								{payloadObjectId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							timestampMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const timestampMs = entity.timestampMs}
					{#if timestampMs != null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={timestampMs} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$gitCommit}
			>
				{#snippet children(gitCommit)}
					{#if gitCommit != null}
						<div>
							<dt>Git commit</dt>
							<dd>
								<GitCommitView
									selection={select(EntityType.GitCommit, gitCommit[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$payloadObject}
			>
				{#snippet children(gitObject)}
					{#if gitObject != null}
						<div>
							<dt>payload object</dt>
							<dd>
								<GitObjectView
									selection={select(EntityType.GitObject, gitObject[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>verification status</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									verificationStatus: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.verificationStatus}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
