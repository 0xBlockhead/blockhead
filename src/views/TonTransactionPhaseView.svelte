<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.TonTransactionPhase>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.TonTransactionPhase>>
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
	const tonTransactionPhase = $derived(selection({}))
	const titleFallback = $derived('TON transaction phase')
	const viewDomId = $derived('ton-transaction-phase-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TonTransactionView from '$/views/TonTransactionView.svelte'
</script>


<EntityView
	entityType={EntityType.TonTransactionPhase}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={tonTransactionPhase}>
			{#snippet Pending()}
				{title || 'TON transaction phase'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>transaction</dt>
				<dd>
					<TonTransactionView
						selection={select(EntityType.TonTransaction, selection.entitySelector.$transaction, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>phase kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									phaseKind: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const phaseKind = pendingEntity.phaseKind}
							{#if phaseKind !== undefined && phaseKind !== null}
								{String((phaseKind) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const phaseKind = resolvedEntity.phaseKind}
							{#if phaseKind !== undefined && phaseKind !== null}
								{String((phaseKind) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							success: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const success = pendingEntity.success}
					{#if success !== undefined && success !== null}
						<div>
							<dt>success</dt>
							<dd>
								{success ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const success = resolvedEntity.success}
					{#if success !== undefined && success !== null}
						<div>
							<dt>success</dt>
							<dd>
								{success ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							exitCode: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const exitCode = pendingEntity.exitCode}
					{#if exitCode !== undefined && exitCode !== null}
						<div>
							<dt>exit code</dt>
							<dd>
								{String((exitCode) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const exitCode = resolvedEntity.exitCode}
					{#if exitCode !== undefined && exitCode !== null}
						<div>
							<dt>exit code</dt>
							<dd>
								{String((exitCode) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							gasUsed: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const gasUsed = pendingEntity.gasUsed}
					{#if gasUsed !== undefined && gasUsed !== null}
						<div>
							<dt>gas used</dt>
							<dd>
								{String((gasUsed) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const gasUsed = resolvedEntity.gasUsed}
					{#if gasUsed !== undefined && gasUsed !== null}
						<div>
							<dt>gas used</dt>
							<dd>
								{String((gasUsed) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							gasFeesNano: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const gasFeesNano = pendingEntity.gasFeesNano}
					{#if gasFeesNano !== undefined && gasFeesNano !== null}
						<div>
							<dt>gas fees nano</dt>
							<dd>
								{String((gasFeesNano) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const gasFeesNano = resolvedEntity.gasFeesNano}
					{#if gasFeesNano !== undefined && gasFeesNano !== null}
						<div>
							<dt>gas fees nano</dt>
							<dd>
								{String((gasFeesNano) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							storageFeesNano: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const storageFeesNano = pendingEntity.storageFeesNano}
					{#if storageFeesNano !== undefined && storageFeesNano !== null}
						<div>
							<dt>storage fees nano</dt>
							<dd>
								{String((storageFeesNano) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const storageFeesNano = resolvedEntity.storageFeesNano}
					{#if storageFeesNano !== undefined && storageFeesNano !== null}
						<div>
							<dt>storage fees nano</dt>
							<dd>
								{String((storageFeesNano) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							actionResultCode: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const actionResultCode = pendingEntity.actionResultCode}
					{#if actionResultCode !== undefined && actionResultCode !== null}
						<div>
							<dt>action result code</dt>
							<dd>
								{String((actionResultCode) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const actionResultCode = resolvedEntity.actionResultCode}
					{#if actionResultCode !== undefined && actionResultCode !== null}
						<div>
							<dt>action result code</dt>
							<dd>
								{String((actionResultCode) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							skippedReason: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const skippedReason = pendingEntity.skippedReason}
					{#if skippedReason !== undefined && skippedReason !== null}
						<div>
							<dt>skipped reason</dt>
							<dd>
								{String((skippedReason) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const skippedReason = resolvedEntity.skippedReason}
					{#if skippedReason !== undefined && skippedReason !== null}
						<div>
							<dt>skipped reason</dt>
							<dd>
								{String((skippedReason) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
