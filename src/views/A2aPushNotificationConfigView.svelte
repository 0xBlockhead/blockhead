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
	}: Omit<EntitySelectionViewProps<EntityType.A2aPushNotificationConfig>, 'prefetched'> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [],
	}))
	const a2aPushNotificationConfig = $derived(viewSelection({
		fields: {
			status: true,
			url: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.configId || 'A2A push notification config')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import A2aTaskView from '$/views/A2aTaskView.svelte'
</script>


<EntityView
	entityType={EntityType.A2aPushNotificationConfig}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			(
				'taskId' in selection.entitySelector.$task ?
					resolve(
						'/(agents)/agents/a2a/task/[taskId=stringSegment]/(a2aTask)/push-notification/[configId=stringSegment]',
						{
							taskId: selection.entitySelector.$task.taskId,
							configId: selection.entitySelector.configId,
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
		<ResourceBoundary resource={a2aPushNotificationConfig}>
			{#snippet children(entity)}
				{(entity.status ?? '') || selection.entitySelector.configId || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={a2aPushNotificationConfig}>
			{#snippet children(entity)}
				{@const url = entity.url}
				{#if url != null}
					<span data-text="muted">
						<a
							href={url}
							target="_blank"
							rel="noreferrer noopener"
						>
							<TruncatedValue value={url} />
						</a>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>task</dt>
				<dd>
					<A2aTaskView
						selection={select(EntityType.A2aTask, selection.entitySelector.$task)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>config ID</dt>
				<dd>
					{selection.entitySelector.configId}
				</dd>
			</div>

			<ResourceBoundary
				resource={a2aPushNotificationConfig}
			>
				{#snippet children(entity)}
					{@const url = entity.url}
					{#if url != null}
						<div>
							<dt>URL</dt>
							<dd>
								<a
									href={url}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={url} />
								</a>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							authKind: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const authKind = entity.authKind}
					{#if authKind != null}
						<div>
							<dt>auth kind</dt>
							<dd>
								{authKind}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
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
								<Timestamp timestamp={createdAt} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							deletedAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const deletedAt = entity.deletedAt}
					{#if deletedAt != null}
						<div>
							<dt>deleted AT</dt>
							<dd>
								<Timestamp timestamp={deletedAt} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={a2aPushNotificationConfig}
			>
				{#snippet children(entity)}
					{@const status = entity.status}
					{#if status != null}
						<div>
							<dt>status</dt>
							<dd>
								{status}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
