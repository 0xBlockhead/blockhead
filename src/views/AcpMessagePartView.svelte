<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.AcpMessagePart> = $props()

	const message = $derived(selection.entitySelector.$message)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.AcpLocal_JsonRpc,
		],
	}))
	const acpMessagePart = $derived(viewSelection({
		fields: {
			partKind: true,
			mimeType: true,
		},
	}))
	const titleFallback = $derived((prefetched.partKind ?? '') || 'ACP message part')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AcpMessageView from '$/views/AcpMessageView.svelte'
	import AiArtifactView from '$/views/AiArtifactView.svelte'
</script>


<EntityView
	entityType={EntityType.AcpMessagePart}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(agents)/agents/acp/session/[sessionId=stringSegment]/(acpSession)/message/[messageId=stringSegment]/(acpMessage)/part/[partIndex=nonNegativeInteger]',
				{
					sessionId: message.$session.sessionId,
					messageId: message.messageId,
					partIndex: String(selection.entitySelector.partIndex),
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={acpMessagePart}>
			{#snippet children(entity)}
				{entity.partKind || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<NumberValue
			value={selection.entitySelector.partIndex}
		/>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={acpMessagePart}>
			{#snippet children(entity)}
				{@const mimeType = entity.mimeType}
				{#if mimeType != null}
					<span data-text="muted">
						{mimeType}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>message</dt>
				<dd>
					<AcpMessageView
						selection={select(EntityType.AcpMessage, selection.entitySelector.$message)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>part index</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.partIndex}
					/>
				</dd>
			</div>

			<div>
				<dt>part kind</dt>
				<dd>
					<ResourceBoundary
						resource={acpMessagePart}
					>
						{#snippet children(entity)}
							{entity.partKind}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={acpMessagePart}
			>
				{#snippet children(entity)}
					{@const mimeType = entity.mimeType}
					{#if mimeType != null}
						<div>
							<dt>mime type</dt>
							<dd>
								{mimeType}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							uri: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const uri = entity.uri}
					{#if uri != null}
						<div>
							<dt>URI</dt>
							<dd>
								<a
									href={uri}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={uri} />
								</a>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$artifact}
			>
				{#snippet children(aiArtifact)}
					{#if aiArtifact != null}
						{@const aiArtifactInitial = untrack(() => aiArtifact)}
						<div>
							<dt>artifact</dt>
							<dd>
								<AiArtifactView
									selection={select(EntityType.AiArtifact, (aiArtifact ?? aiArtifactInitial)[EntityMetaKey.Selector])}
									prefetched={aiArtifact ?? aiArtifactInitial}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
