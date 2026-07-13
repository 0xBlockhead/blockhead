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


	// Context
	import { select } from '$/routes/+layout.svelte'


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
			selection: EntityProxyResource<typeof schema, EntityType.MoveModule_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.MoveModule_Timestamp>>
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
	const moveModuleTimestamp = $derived(selection({
		fields: {
			ledgerVersion: true,
			packageVersion: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || 'move module timestamp')
	const viewDomId = $derived('move-module-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import MoveFunctionsView from '$/views/MoveFunctionsView.svelte'
	import MoveStructsView from '$/views/MoveStructsView.svelte'
	import MoveModuleView from '$/views/MoveModuleView.svelte'
</script>


<EntityView
	entityType={EntityType.MoveModule_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={moveModuleTimestamp}>
			{#snippet Pending()}
				{@const timestampMs0 = pendingEntity.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<Timestamp timestamp={Number(timestampMs0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const timestampMs0 = resolvedEntity.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<Timestamp timestamp={Number(timestampMs0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={moveModuleTimestamp}>
			{#snippet Pending()}
				{[String((pendingEntity.ledgerVersion) ?? ''), String((pendingEntity.packageVersion) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || title || 'move module timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.ledgerVersion) ?? ''), String((resolvedEntity.packageVersion) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={moveModuleTimestamp}>
			{#snippet Pending()}
				{@const source0 = pendingEntity.source}
				{#if source0 !== undefined && source0 !== null}
					<span data-text="muted">
						{String((source0) ?? '')}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const source0 = resolvedEntity.source}
				{#if source0 !== undefined && source0 !== null}
					<span data-text="muted">
						{String((source0) ?? '')}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>module</dt>
				<dd>
					<MoveModuleView
						selection={select(EntityType.MoveModule, selection.entitySelector.$module, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									timestampMs: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const timestampMs = pendingEntity.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const timestampMs = resolvedEntity.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									source: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const source = pendingEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const source = resolvedEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							ledgerVersion: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const ledgerVersion = pendingEntity.ledgerVersion}
					{#if ledgerVersion !== undefined && ledgerVersion !== null}
						<div>
							<dt>ledger version</dt>
							<dd>
								<NumberValue value={Number(ledgerVersion)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const ledgerVersion = resolvedEntity.ledgerVersion}
					{#if ledgerVersion !== undefined && ledgerVersion !== null}
						<div>
							<dt>ledger version</dt>
							<dd>
								<NumberValue value={Number(ledgerVersion)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							packageVersion: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const packageVersion = pendingEntity.packageVersion}
					{#if packageVersion !== undefined && packageVersion !== null}
						<div>
							<dt>package version</dt>
							<dd>
								<NumberValue value={Number(packageVersion)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const packageVersion = resolvedEntity.packageVersion}
					{#if packageVersion !== undefined && packageVersion !== null}
						<div>
							<dt>package version</dt>
							<dd>
								<NumberValue value={Number(packageVersion)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							packageDigest: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const packageDigest = pendingEntity.packageDigest}
					{#if packageDigest !== undefined && packageDigest !== null}
						<div>
							<dt>package digest</dt>
							<dd>
								<TruncatedValue value={String((packageDigest) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const packageDigest = resolvedEntity.packageDigest}
					{#if packageDigest !== undefined && packageDigest !== null}
						<div>
							<dt>package digest</dt>
							<dd>
								<TruncatedValue value={String((packageDigest) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							bytecode: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const bytecode = pendingEntity.bytecode}
					{#if bytecode !== undefined && bytecode !== null}
						<div>
							<dt>bytecode</dt>
							<dd>
								{String((bytecode) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const bytecode = resolvedEntity.bytecode}
					{#if bytecode !== undefined && bytecode !== null}
						<div>
							<dt>bytecode</dt>
							<dd>
								{String((bytecode) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							sourceDigest: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const sourceDigest = pendingEntity.sourceDigest}
					{#if sourceDigest !== undefined && sourceDigest !== null}
						<div>
							<dt>source digest</dt>
							<dd>
								<TruncatedValue value={String((sourceDigest) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sourceDigest = resolvedEntity.sourceDigest}
					{#if sourceDigest !== undefined && sourceDigest !== null}
						<div>
							<dt>source digest</dt>
							<dd>
								<TruncatedValue value={String((sourceDigest) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<ResourceBoundary
			resource={
				selection({
					fields: {
						sourceCode: true,
					},
				})
			}
		>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const sourceCode = resolvedEntity.sourceCode}
				{#if sourceCode !== undefined && sourceCode !== null && sourceCode !== ''}
					<code>{String((sourceCode) ?? '')}</code>
				{:else}
					<p data-text="muted">No source code available.</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<MoveFunctionsView
				selection={
						selection.$$functions({
							count: true,
						})
					}
				title='functions'
				emptyText='No functions found.'
				id='MoveFunctionsView-functions'
			/>

			<MoveStructsView
				selection={
						selection.$$structs({
							count: true,
						})
					}
				title='structs'
				emptyText='No structs found.'
				id='MoveStructsView-structs'
			/>
		{/if}
	{/snippet}
</EntityView>
