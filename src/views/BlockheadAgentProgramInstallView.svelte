<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.BlockheadAgentProgramInstall> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
		],
	}))
	const blockheadAgentProgramInstall = $derived(viewSelection({
		fields: {
			command: true,
			updatedAt: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.installId || 'blockhead agent program install')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadAgentProgramInstall_TimestampsView from '$/views/BlockheadAgentProgramInstall_TimestampsView.svelte'
	import BlockheadSourceView from '$/views/BlockheadSourceView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadAgentProgramInstall}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{selection.entitySelector.installId || 'blockhead agent program install'}
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadAgentProgramInstall}>
			{#snippet children(entity)}
				{(entity.command ?? '') || selection.entitySelector.installId || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadAgentProgramInstall}>
			{#snippet children(entity)}
				{@const updatedAt = entity.updatedAt}
				{#if updatedAt != null}
					<span data-text="muted">
						<Timestamp timestamp={updatedAt} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>install ID</dt>
				<dd>
					{selection.entitySelector.installId}
				</dd>
			</div>

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
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							installPath: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const installPath = entity.installPath}
					{#if installPath != null}
						<div>
							<dt>install path</dt>
							<dd>
								{installPath}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={blockheadAgentProgramInstall}
			>
				{#snippet children(entity)}
					{@const command = entity.command}
					{#if command != null}
						<div>
							<dt>command</dt>
							<dd>
								{command}
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
							argsHashAlgorithm: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const argsHashAlgorithm = entity.argsHashAlgorithm}
					{#if argsHashAlgorithm != null}
						<div>
							<dt>args hash algorithm</dt>
							<dd>
								{argsHashAlgorithm}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							argsHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const argsHash = entity.argsHash}
					{#if argsHash != null}
						<div>
							<dt>args hash</dt>
							<dd>
								<TruncatedValue value={argsHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							environmentScope: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const environmentScope = entity.environmentScope}
					{#if environmentScope != null}
						<div>
							<dt>environment scope</dt>
							<dd>
								{environmentScope}
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
				resource={blockheadAgentProgramInstall}
			>
				{#snippet children(entity)}
					{@const updatedAt = entity.updatedAt}
					{#if updatedAt != null}
						<div>
							<dt>Updated</dt>
							<dd>
								<Timestamp timestamp={updatedAt} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const timestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BlockheadAgentProgramInstall_TimestampsView
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
