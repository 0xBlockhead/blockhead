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
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'
	import { Source } from '$/sources/Source.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.AcpPromptTurn>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.AcpPromptTurn>>
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
	const acpPromptTurn = $derived(selection({
		sources: [
			Source.AcpLocal_JsonRpc,
		],
		fields: {
			stopReason: true,
			startedAt: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.turnId ?? prefetched.turnId) ?? '')].filter(Boolean).join(' ') || 'ACP prompt turn')
	const viewDomId = $derived('acp-prompt-turn-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AcpSessionView from '$/views/AcpSessionView.svelte'
</script>


<EntityView
	entityType={EntityType.AcpPromptTurn}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={acpPromptTurn}>
			{#snippet Pending()}
				{[String((selection.entitySelector.turnId ?? prefetched.turnId) ?? '')].filter(Boolean).join(' ') || title || 'ACP prompt turn'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.turnId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={acpPromptTurn}>
			{#snippet Pending()}
				{[String((prefetched.stopReason) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.turnId ?? prefetched.turnId) ?? '')].filter(Boolean).join(' ') || title || 'ACP prompt turn'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.stopReason) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.turnId) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={acpPromptTurn}>
			{#snippet Pending()}
				{@const startedAt0 = prefetched.startedAt}
				{#if startedAt0 !== undefined && startedAt0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(startedAt0)} />
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const startedAt0 = resolvedEntity.startedAt}
				{#if startedAt0 !== undefined && startedAt0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(startedAt0)} />
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
						layout={EntityLayout.Title}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>turn ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									turnId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const turnId = selection.entitySelector.turnId ?? prefetched.turnId}
							{#if turnId !== undefined && turnId !== null}
								{String((turnId) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const turnId = resolvedEntity.turnId}
							{#if turnId !== undefined && turnId !== null}
								{String((turnId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							stopReason: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const stopReason = prefetched.stopReason}
					{#if stopReason !== undefined && stopReason !== null}
						<div>
							<dt>stop reason</dt>
							<dd>
								{String((stopReason) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const stopReason = resolvedEntity.stopReason}
					{#if stopReason !== undefined && stopReason !== null}
						<div>
							<dt>stop reason</dt>
							<dd>
								{String((stopReason) ?? '')}
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
						fields: {
							startedAt: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const startedAt = prefetched.startedAt}
					{#if startedAt !== undefined && startedAt !== null}
						<div>
							<dt>started AT</dt>
							<dd>
								<Timestamp timestamp={Number(startedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const startedAt = resolvedEntity.startedAt}
					{#if startedAt !== undefined && startedAt !== null}
						<div>
							<dt>started AT</dt>
							<dd>
								<Timestamp timestamp={Number(startedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							completedAt: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const completedAt = prefetched.completedAt}
					{#if completedAt !== undefined && completedAt !== null}
						<div>
							<dt>completed AT</dt>
							<dd>
								<Timestamp timestamp={Number(completedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const completedAt = resolvedEntity.completedAt}
					{#if completedAt !== undefined && completedAt !== null}
						<div>
							<dt>completed AT</dt>
							<dd>
								<Timestamp timestamp={Number(completedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							cancelledAt: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const cancelledAt = prefetched.cancelledAt}
					{#if cancelledAt !== undefined && cancelledAt !== null}
						<div>
							<dt>cancelled AT</dt>
							<dd>
								<Timestamp timestamp={Number(cancelledAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const cancelledAt = resolvedEntity.cancelledAt}
					{#if cancelledAt !== undefined && cancelledAt !== null}
						<div>
							<dt>cancelled AT</dt>
							<dd>
								<Timestamp timestamp={Number(cancelledAt)} />
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
						fields: {
							userPromptHashAlgorithm: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const userPromptHashAlgorithm = prefetched.userPromptHashAlgorithm}
					{#if userPromptHashAlgorithm !== undefined && userPromptHashAlgorithm !== null}
						<div>
							<dt>user prompt hash algorithm</dt>
							<dd>
								<TruncatedValue value={String((userPromptHashAlgorithm) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const userPromptHashAlgorithm = resolvedEntity.userPromptHashAlgorithm}
					{#if userPromptHashAlgorithm !== undefined && userPromptHashAlgorithm !== null}
						<div>
							<dt>user prompt hash algorithm</dt>
							<dd>
								<TruncatedValue value={String((userPromptHashAlgorithm) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							userPromptHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const userPromptHash = prefetched.userPromptHash}
					{#if userPromptHash !== undefined && userPromptHash !== null}
						<div>
							<dt>user prompt hash</dt>
							<dd>
								<TruncatedValue value={String((userPromptHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const userPromptHash = resolvedEntity.userPromptHash}
					{#if userPromptHash !== undefined && userPromptHash !== null}
						<div>
							<dt>user prompt hash</dt>
							<dd>
								<TruncatedValue value={String((userPromptHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
