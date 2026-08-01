<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


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
	}: EntitySelectionViewProps<EntityType.PayjoinEndpoint> = $props()

	const payjoinEndpoint = $derived(selection({
		fields: {
			protocolVersion: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.endpointUrl || 'payjoin endpoint')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import PayjoinEndpoint_TimestampsView from '$/views/PayjoinEndpoint_TimestampsView.svelte'
	import BlockheadPayjoinSessionsView from '$/views/BlockheadPayjoinSessionsView.svelte'
	import PayjoinDirectoryView from '$/views/PayjoinDirectoryView.svelte'
</script>


<EntityView
	entityType={EntityType.PayjoinEndpoint}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary resource={payjoinEndpoint}>
			{#snippet children(entity)}
				{(entity.protocolVersion ?? '') || selection.entitySelector.endpointUrl || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={selection.$directory}
		>
			{#snippet children(payjoinDirectory)}
				{#if payjoinDirectory != null}
					<span data-text="muted">
						<PayjoinDirectoryView
							selection={select(EntityType.PayjoinDirectory, payjoinDirectory[EntityMetaKey.Selector])}
							prefetched={payjoinDirectory}
							layout={EntityLayout.Title}
						/>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>endpoint URL</dt>
				<dd>
					<a
						href={selection.entitySelector.endpointUrl}
						target="_blank"
						rel="noreferrer noopener"
					>
						<TruncatedValue value={selection.entitySelector.endpointUrl} />
					</a>
				</dd>
			</div>

			<ResourceBoundary
				resource={payjoinEndpoint}
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
				resource={selection.$directory}
			>
				{#snippet children(payjoinDirectory)}
					{#if payjoinDirectory != null}
						<div>
							<dt>directory</dt>
							<dd>
								<PayjoinDirectoryView
									selection={select(EntityType.PayjoinDirectory, payjoinDirectory[EntityMetaKey.Selector])}
									prefetched={payjoinDirectory}
									layout={EntityLayout.Value}
								/>
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
					<PayjoinEndpoint_TimestampsView
						selection={timestampsResource}
						countResource={timestampsResource.count}
						title='timestamps'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const blockheadSessionsResource = selection.$$blockheadSessions}
		<ResourceBoundary
			resource={blockheadSessionsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BlockheadPayjoinSessionsView
						selection={blockheadSessionsResource}
						countResource={blockheadSessionsResource.count}
						title='blockhead sessions'
						id='blockhead-sessions'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
