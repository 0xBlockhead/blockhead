<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityProxyField, type EntityProxyData, type EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { UrlString } from '$/schema/UrlString.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.AcpMessagePart>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.AcpMessagePart>>
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
	const acpMessagePart = $derived(selection({
		sources: [
			Source.AcpLocal_JsonRpc,
		],
		fields: {
			partKind: true,
			mimeType: true,
		},
	}))
	const titleFallback = $derived([String((prefetched.partKind) ?? '')].filter(Boolean).join(' ') || 'ACP message part')
	const viewDomId = $derived('acp-message-part-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AcpMessageView from '$/views/AcpMessageView.svelte'
	import AiArtifactView from '$/views/AiArtifactView.svelte'
</script>


<EntityView
	entityType={EntityType.AcpMessagePart}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={acpMessagePart}>
			{#snippet Pending()}
				{[String((prefetched.partKind) ?? '')].filter(Boolean).join(' ') || title || 'ACP message part'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.partKind) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={acpMessagePart}>
			{#snippet Pending()}
				{@const partIndex0 = selection.entitySelector.partIndex ?? prefetched.partIndex}
				{#if partIndex0 !== undefined && partIndex0 !== null}
					<NumberValue value={Number(partIndex0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const partIndex0 = resolvedEntity.partIndex}
				{#if partIndex0 !== undefined && partIndex0 !== null}
					<NumberValue value={Number(partIndex0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={acpMessagePart}>
			{#snippet Pending()}
				{@const mimeType0 = prefetched.mimeType}
				{#if mimeType0 !== undefined && mimeType0 !== null}
					<span data-text="muted">
						{String((mimeType0) ?? '')}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const mimeType0 = resolvedEntity.mimeType}
				{#if mimeType0 !== undefined && mimeType0 !== null}
					<span data-text="muted">
						{String((mimeType0) ?? '')}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>message</dt>
				<dd>
					<AcpMessageView
						selection={select(EntityType.AcpMessage, selection.entitySelector.$message, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>part index</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									partIndex: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const partIndex = selection.entitySelector.partIndex ?? prefetched.partIndex}
							{#if partIndex !== undefined && partIndex !== null}
								<NumberValue value={Number(partIndex)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const partIndex = resolvedEntity.partIndex}
							{#if partIndex !== undefined && partIndex !== null}
								<NumberValue value={Number(partIndex)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>part kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									partKind: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const partKind = prefetched.partKind}
							{#if partKind !== undefined && partKind !== null}
								{String((partKind) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const partKind = resolvedEntity.partKind}
							{#if partKind !== undefined && partKind !== null}
								{String((partKind) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							mimeType: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const mimeType = prefetched.mimeType}
					{#if mimeType !== undefined && mimeType !== null}
						<div>
							<dt>mime type</dt>
							<dd>
								{String((mimeType) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const mimeType = resolvedEntity.mimeType}
					{#if mimeType !== undefined && mimeType !== null}
						<div>
							<dt>mime type</dt>
							<dd>
								{String((mimeType) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							uri: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const uri = prefetched.uri}
					{#if uri !== undefined && uri !== null}
						<div>
							<dt>URI</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(uri)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(uri)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const uri = resolvedEntity.uri}
					{#if uri !== undefined && uri !== null}
						<div>
							<dt>URI</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(uri)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(uri)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.AiArtifact, false>('$artifact')}
			>
				{#snippet children(aiArtifact)}
					{#if aiArtifact != null && aiArtifact[EntityMetaKey.Selector] != null}
						<div>
							<dt>artifact</dt>
							<dd>
								<AiArtifactView
									selection={select(EntityType.AiArtifact, aiArtifact[EntityMetaKey.Selector])}
									prefetched={aiArtifact}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
