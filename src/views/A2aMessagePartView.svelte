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
	}: Omit<EntitySelectionViewProps<EntityType.A2aMessagePart>, 'prefetched'> = $props()

	const message = $derived(selection.entitySelector.$message)
	const artifact = $derived(selection.entitySelector.$artifact)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [],
	}))
	const a2aMessagePart = $derived(viewSelection({
		fields: {
			partKind: true,
			mimeType: true,
		},
	}))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import A2aMessageView from '$/views/A2aMessageView.svelte'
	import A2aArtifactView from '$/views/A2aArtifactView.svelte'
	import AiArtifactView from '$/views/AiArtifactView.svelte'
</script>


<EntityView
	entityType={EntityType.A2aMessagePart}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.partIndex)}
	href={
		href === undefined ?
			(
				'$artifact' in selection.entitySelector
				&& 'taskId' in artifact.$task ?
					resolve(
						'/(agents)/agents/a2a/task/[taskId=stringSegment]/(a2aTask)/artifact/[artifactId=stringSegment]/(a2aArtifact)/part/[partIndex=nonNegativeInteger]',
						{
							taskId: artifact.$task.taskId,
							artifactId: artifact.artifactId,
							partIndex: String(selection.entitySelector.partIndex),
						}
					)
				:
					'$message' in selection.entitySelector
					&& 'taskId' in message.$task ?
						resolve(
							'/(agents)/agents/a2a/task/[taskId=stringSegment]/(a2aTask)/message/[messageId=stringSegment]/(a2aMessage)/part/[partIndex=nonNegativeInteger]',
							{
								taskId: message.$task.taskId,
								messageId: message.messageId,
								partIndex: String(selection.entitySelector.partIndex),
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
		<ResourceBoundary resource={a2aMessagePart}>
			{#snippet children(entity)}
				{entity.partKind || String(selection.entitySelector.partIndex)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={a2aMessagePart}>
			{#snippet children(entity)}
				{@const mimeType = entity.mimeType}
				{#if mimeType != null}
					<span data-text="muted">
						{mimeType}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$message}
			>
				{#snippet children(a2aMessage)}
					{#if a2aMessage != null}
						<div>
							<dt>message</dt>
							<dd>
								<A2aMessageView
									selection={select(EntityType.A2aMessage, a2aMessage[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$artifact}
			>
				{#snippet children(a2aArtifact)}
					{#if a2aArtifact != null}
						{@const a2aArtifactInitial = untrack(() => a2aArtifact)}
						<div>
							<dt>artifact</dt>
							<dd>
								<A2aArtifactView
									selection={select(EntityType.A2aArtifact, (a2aArtifact ?? a2aArtifactInitial)[EntityMetaKey.Selector])}
									prefetched={a2aArtifact ?? a2aArtifactInitial}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>part index</dt>
				<dd>
					{selection.entitySelector.partIndex}
				</dd>
			</div>

			<div>
				<dt>part kind</dt>
				<dd>
					<ResourceBoundary
						resource={a2aMessagePart}
					>
						{#snippet children(entity)}
							{entity.partKind}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							text: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const text = entity.text}
					{#if text != null}
						<div>
							<dt>text</dt>
							<dd>
								{text}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							uri: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const uri = entity.uri}
					{#if uri != null}
						<div>
							<dt>URI</dt>
							<dd>
								<a
									href={uri}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={uri} />
								</a>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={a2aMessagePart}
			>
				{#snippet children(entity)}
					{@const mimeType = entity.mimeType}
					{#if mimeType != null}
						<div>
							<dt>mime type</dt>
							<dd>
								{mimeType}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$aiArtifact}
			>
				{#snippet children(aiArtifact)}
					{#if aiArtifact != null}
						{@const aiArtifactInitial = untrack(() => aiArtifact)}
						<div>
							<dt>AI artifact</dt>
							<dd>
								<AiArtifactView
									selection={select(EntityType.AiArtifact, (aiArtifact ?? aiArtifactInitial)[EntityMetaKey.Selector])}
									prefetched={aiArtifact ?? aiArtifactInitial}
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
