<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.PayjoinDirectory>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.PayjoinDirectory>>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const payjoinDirectory = $derived(selection({
		sources: [
			Source.PayjoinDirectory_Rest,
		],
		fields: {
			ohttpGatewayUrl: true,
			ohttpKeyConfig: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.directoryUrl) ?? '')].filter(Boolean).join(' ') || 'payjoin directory')
	const viewDomId = $derived('payjoin-directory-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadPayjoinSessionsView from '$/views/BlockheadPayjoinSessionsView.svelte'
</script>


<EntityView
	entityType={EntityType.PayjoinDirectory}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={payjoinDirectory}>
			{#snippet Pending()}
				{[String((pendingEntity.directoryUrl) ?? '')].filter(Boolean).join(' ') || title || 'payjoin directory'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.directoryUrl) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={payjoinDirectory}>
			{#snippet Pending()}
				{[String((pendingEntity.ohttpGatewayUrl) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.directoryUrl) ?? '')].filter(Boolean).join(' ') || title || 'payjoin directory'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.ohttpGatewayUrl) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.directoryUrl) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>directory URL</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									directoryUrl: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const directoryUrl = pendingEntity.directoryUrl}
							{#if directoryUrl !== undefined && directoryUrl !== null}
								<svelte:element
									this={'a'}
									href={String(directoryUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(directoryUrl)} />
								</svelte:element>
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const directoryUrl = resolvedEntity.directoryUrl}
							{#if directoryUrl !== undefined && directoryUrl !== null}
								<svelte:element
									this={'a'}
									href={String(directoryUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(directoryUrl)} />
								</svelte:element>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.PayjoinDirectory_Rest,
						],
						fields: {
							ohttpGatewayUrl: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const ohttpGatewayUrl = pendingEntity.ohttpGatewayUrl}
					{#if ohttpGatewayUrl !== undefined && ohttpGatewayUrl !== null}
						<div>
							<dt>ohttp gateway URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(ohttpGatewayUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(ohttpGatewayUrl)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const ohttpGatewayUrl = resolvedEntity.ohttpGatewayUrl}
					{#if ohttpGatewayUrl !== undefined && ohttpGatewayUrl !== null}
						<div>
							<dt>ohttp gateway URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(ohttpGatewayUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(ohttpGatewayUrl)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							maxPayloadBytes: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const maxPayloadBytes = pendingEntity.maxPayloadBytes}
					{#if maxPayloadBytes !== undefined && maxPayloadBytes !== null}
						<div>
							<dt>max payload bytes</dt>
							<dd>
								<NumberValue value={Number(maxPayloadBytes)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const maxPayloadBytes = resolvedEntity.maxPayloadBytes}
					{#if maxPayloadBytes !== undefined && maxPayloadBytes !== null}
						<div>
							<dt>max payload bytes</dt>
							<dd>
								<NumberValue value={Number(maxPayloadBytes)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.PayjoinDirectory_Rest,
						],
						fields: {
							ohttpKeyConfig: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const ohttpKeyConfig = pendingEntity.ohttpKeyConfig}
					{#if ohttpKeyConfig !== undefined && ohttpKeyConfig !== null}
						<div>
							<dt>ohttp key config</dt>
							<dd>
								<TruncatedValue value={String((ohttpKeyConfig) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const ohttpKeyConfig = resolvedEntity.ohttpKeyConfig}
					{#if ohttpKeyConfig !== undefined && ohttpKeyConfig !== null}
						<div>
							<dt>ohttp key config</dt>
							<dd>
								<TruncatedValue value={String((ohttpKeyConfig) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<BlockheadPayjoinSessionsView
				selection={
						selection.$$blockheadSessions({
							count: true,
						})
					}
				title='blockhead sessions'
				emptyText='No local payjoin sessions.'
				id='BlockheadPayjoinSessionsView-blockhead-sessions'
			/>
		{/if}
	{/snippet}
</EntityView>
