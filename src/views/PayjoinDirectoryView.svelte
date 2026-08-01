<!-- Generated from APP.ts. -->

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
	const titleFallback = $derived(selection.entitySelector.directoryUrl || 'payjoin directory')


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
	{#snippet Value()}
		<ResourceBoundary resource={payjoinDirectory}>
			{#snippet children(entity)}
				{(entity.ohttpGatewayUrl ?? '') || selection.entitySelector.directoryUrl || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>directory URL</dt>
				<dd>
					<a
						href={selection.entitySelector.directoryUrl}
						target="_blank"
						rel="noreferrer noopener"
					>
						<TruncatedValue value={selection.entitySelector.directoryUrl} />
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
									href={ohttpGatewayUrl}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={ohttpGatewayUrl} />
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

	{#snippet Details()}
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
