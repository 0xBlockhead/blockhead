<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
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
	}: Omit<EntitySelectionViewProps<EntityType.GitRefUpdate>, 'prefetched'> = $props()

	const gitRefUpdate = $derived(selection({
		fields: {
			updateKind: true,
			timestampMs: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.refName || 'Git ref update')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import GitRepositoryView from '$/views/GitRepositoryView.svelte'
	import GitSignatureView from '$/views/GitSignatureView.svelte'
</script>


<EntityView
	entityType={EntityType.GitRefUpdate}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			(
				selection.entitySelector.$repository.repositoryId !== undefined ?
					resolve(
						'/git/repository/id/[repositoryId=stringSegment]/(gitRepository)/ref-update/[refName=stringSegment]/[oldObjectId=zeroExHex]/[newObjectId=zeroExHex]',
						{
							repositoryId: selection.entitySelector.$repository.repositoryId,
							refName: selection.entitySelector.refName,
							oldObjectId: selection.entitySelector.oldObjectId,
							newObjectId: selection.entitySelector.newObjectId,
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
		<ResourceBoundary resource={gitRefUpdate}>
			{#snippet children(entity)}
				{entity.updateKind || selection.entitySelector.refName || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={gitRefUpdate}>
			{#snippet children(entity)}
				{@const timestampMs = entity.timestampMs}
				{#if timestampMs != null}
					<span data-text="muted">
						<Timestamp timestamp={timestampMs} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
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
				<dt>ref name</dt>
				<dd>
					{selection.entitySelector.refName}
				</dd>
			</div>

			<div>
				<dt>old object ID</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.oldObjectId} />
				</dd>
			</div>

			<div>
				<dt>new object ID</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.newObjectId} />
				</dd>
			</div>

			<div>
				<dt>update kind</dt>
				<dd>
					<ResourceBoundary
						resource={gitRefUpdate}
					>
						{#snippet children(entity)}
							{entity.updateKind}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={gitRefUpdate}
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
				resource={selection.$signature}
			>
				{#snippet children(gitSignature)}
					{#if gitSignature != null}
						<div>
							<dt>signature</dt>
							<dd>
								<GitSignatureView
									selection={select(EntityType.GitSignature, gitSignature[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
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
				{#snippet children(entity)}
					{@const source = entity.source}
					{#if source != null}
						<div>
							<dt>Source</dt>
							<dd>
								{source}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
