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
	}: Omit<EntitySelectionViewProps<EntityType.RadiclePatch>, 'prefetched'> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import RadicleRepositoryView from '$/views/RadicleRepositoryView.svelte'
	import GitCommitView from '$/views/GitCommitView.svelte'
</script>


<EntityView
	entityType={EntityType.RadiclePatch}
	entitySelector={selection.entitySelector}
	href={
		href === undefined ?
			resolve(
				'/radicle/repository/[rid=stringSegment]/(radicleRepository)/patch/[patchId=stringSegment]',
				{
					rid: selection.entitySelector.$repository.rid,
					patchId: selection.entitySelector.patchId,
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
				<dt>patch ID</dt>
				<dd>
					{selection.entitySelector.patchId}
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
							targetRef: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const targetRef = entity.targetRef}
					{#if targetRef != null}
						<div>
							<dt>target ref</dt>
							<dd>
								{targetRef}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							headObjectId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const headObjectId = entity.headObjectId}
					{#if headObjectId != null}
						<div>
							<dt>head object ID</dt>
							<dd>
								{headObjectId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							baseObjectId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const baseObjectId = entity.baseObjectId}
					{#if baseObjectId != null}
						<div>
							<dt>base object ID</dt>
							<dd>
								{baseObjectId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>state</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									state: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.state}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							createdAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const createdAt = entity.createdAt}
					{#if createdAt != null}
						<div>
							<dt>Created</dt>
							<dd>
								{createdAt}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							updatedAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const updatedAt = entity.updatedAt}
					{#if updatedAt != null}
						<div>
							<dt>Updated</dt>
							<dd>
								{updatedAt}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$headCommit}
			>
				{#snippet children(gitCommit)}
					{#if gitCommit != null}
						<div>
							<dt>head commit</dt>
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
				resource={selection.$baseCommit}
			>
				{#snippet children(gitCommit)}
					{#if gitCommit != null}
						<div>
							<dt>base commit</dt>
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
		</dl>
	{/snippet}
</EntityView>
