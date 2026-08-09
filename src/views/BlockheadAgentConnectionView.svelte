<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.BlockheadAgentConnection>, 'prefetched'> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
		],
	}))
	const blockheadAgentConnection = $derived(viewSelection({
		fields: {
			connectionKind: true,
			enabled: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.connectionId || 'blockhead agent connection')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadAgentConnection_TimestampsView from '$/views/BlockheadAgentConnection_TimestampsView.svelte'
	import BlockheadAgentProfileView from '$/views/BlockheadAgentProfileView.svelte'
	import BlockheadSourceView from '$/views/BlockheadSourceView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadAgentConnection}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/~/agent/connection/[connectionId=stringSegment]',
				{
					connectionId: selection.entitySelector.connectionId,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary resource={blockheadAgentConnection}>
			{#snippet children(entity)}
				{(entity.connectionKind ?? '') || selection.entitySelector.connectionId || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadAgentConnection}>
			{#snippet children(entity)}
				{@const enabled = entity.enabled}
				{#if enabled != null}
					<span data-text="muted">
						{enabled ? 'Yes' : 'No'}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>connection ID</dt>
				<dd>
					{selection.entitySelector.connectionId}
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$profile}
			>
				{#snippet children(blockheadAgentProfile)}
					{#if blockheadAgentProfile != null}
						<div>
							<dt>profile</dt>
							<dd>
								<BlockheadAgentProfileView
									selection={select(EntityType.BlockheadAgentProfile, blockheadAgentProfile[EntityMetaKey.Selector])}
									prefetched={blockheadAgentProfile}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$source}
			>
				{#snippet children(blockheadSource)}
					{#if blockheadSource != null}
						<div>
							<dt>Source</dt>
							<dd>
								<BlockheadSourceView
									selection={select(EntityType.BlockheadSource, blockheadSource[EntityMetaKey.Selector])}
									prefetched={blockheadSource}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={blockheadAgentConnection}
			>
				{#snippet children(entity)}
					{@const connectionKind = entity.connectionKind}
					{#if connectionKind != null}
						<div>
							<dt>connection kind</dt>
							<dd>
								{connectionKind}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							endpointUrl: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const endpointUrl = entity.endpointUrl}
					{#if endpointUrl != null}
						<div>
							<dt>endpoint URL</dt>
							<dd>
								<a
									href={endpointUrl}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={endpointUrl} />
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
				resource={blockheadAgentConnection}
			>
				{#snippet children(entity)}
					{@const enabled = entity.enabled}
					{#if enabled != null}
						<div>
							<dt>enabled</dt>
							<dd>
								{enabled ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const timestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BlockheadAgentConnection_TimestampsView
						selection={timestampsResource}
						countResource={timestampsResource.count}
						title='timestamps'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
