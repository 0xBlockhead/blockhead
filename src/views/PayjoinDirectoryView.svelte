<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.PayjoinDirectory> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.PayjoinDirectory_Rest,
		],
	}))
	const payjoinDirectory = $derived(viewSelection({
		fields: {
			ohttpGatewayUrl: true,
			ohttpKeyConfig: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.directoryUrl ?? '') || 'payjoin directory')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadPayjoinSessionsView from '$/views/BlockheadPayjoinSessionsView.svelte'
</script>


<EntityView
	entityType={EntityType.PayjoinDirectory}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{(pendingEntity.directoryUrl ?? '') || 'payjoin directory'}
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={payjoinDirectory}>
			{#snippet children(entity)}
				{(entity.ohttpGatewayUrl ?? '') || pendingEntity.directoryUrl || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>directory URL</dt>
				<dd>
					<a
						href={String(pendingEntity.directoryUrl)}
						target="_blank"
						rel="noreferrer noopener"
					>
						<TruncatedValue value={String(pendingEntity.directoryUrl)} />
					</a>
				</dd>
			</div>

			<ResourceBoundary
				resource={payjoinDirectory}
			>
				{#snippet children(entity)}
					{@const ohttpGatewayUrl = entity.ohttpGatewayUrl}
					{#if ohttpGatewayUrl != null}
						<div>
							<dt>ohttp gateway URL</dt>
							<dd>
								<a
									href={String(ohttpGatewayUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(ohttpGatewayUrl)} />
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
							maxPayloadBytes: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const maxPayloadBytes = entity.maxPayloadBytes}
					{#if maxPayloadBytes != null}
						<div>
							<dt>max payload bytes</dt>
							<dd>
								<NumberValue
									value={maxPayloadBytes}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={payjoinDirectory}
			>
				{#snippet children(entity)}
					{@const ohttpKeyConfig = entity.ohttpKeyConfig}
					{#if ohttpKeyConfig != null}
						<div>
							<dt>ohttp key config</dt>
							<dd>
								<TruncatedValue value={ohttpKeyConfig} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const payjoinDirectoryBlockheadPayjoinSessionsViewBlockheadSessionsResource = selection.$$blockheadSessions}
		<ResourceBoundary
			resource={payjoinDirectoryBlockheadPayjoinSessionsViewBlockheadSessionsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BlockheadPayjoinSessionsView
						selection={payjoinDirectoryBlockheadPayjoinSessionsViewBlockheadSessionsResource}
						countResource={payjoinDirectoryBlockheadPayjoinSessionsViewBlockheadSessionsResource.count}
						title='blockhead sessions'
						id='blockhead-sessions'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
