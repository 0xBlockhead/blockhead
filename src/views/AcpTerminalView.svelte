<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
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
	}: EntitySelectionViewProps<EntityType.AcpTerminal> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.AcpLocal_JsonRpc,
		],
	}))
	const acpTerminal = $derived(viewSelection({
		fields: {
			command: true,
			cwd: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.terminalId ?? '') || 'ACP terminal')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import AcpTerminal_TimestampsView from '$/views/AcpTerminal_TimestampsView.svelte'
	import AcpSessionView from '$/views/AcpSessionView.svelte'
</script>


<EntityView
	entityType={EntityType.AcpTerminal}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{(pendingEntity.terminalId ?? '') || 'ACP terminal'}
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={acpTerminal}>
			{#snippet children(entity)}
				{(entity.command ?? '') || pendingEntity.terminalId || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={acpTerminal}>
			{#snippet children(entity)}
				{@const cwd0 = entity.cwd}
				{#if cwd0 != null}
					<span data-text="muted">
						{cwd0}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>session</dt>
				<dd>
					<AcpSessionView
						selection={select(EntityType.AcpSession, selection.entitySelector.$session)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>terminal ID</dt>
				<dd>
					{pendingEntity.terminalId}
				</dd>
			</div>

			<ResourceBoundary
				resource={acpTerminal}
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

			<ResourceBoundary
				resource={acpTerminal}
			>
				{#snippet children(entity)}
					{@const cwd = entity.cwd}
					{#if cwd != null}
						<div>
							<dt>cwd</dt>
							<dd>
								{cwd}
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
								<Timestamp timestamp={Number(createdAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							releasedAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const releasedAt = entity.releasedAt}
					{#if releasedAt != null}
						<div>
							<dt>released AT</dt>
							<dd>
								<Timestamp timestamp={Number(releasedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const acpTerminalAcpTerminalTimestampsViewTimestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={acpTerminalAcpTerminalTimestampsViewTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<AcpTerminal_TimestampsView
						selection={acpTerminalAcpTerminalTimestampsViewTimestampsResource}
						countResource={acpTerminalAcpTerminalTimestampsViewTimestampsResource.count}
						title='timestamps'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
