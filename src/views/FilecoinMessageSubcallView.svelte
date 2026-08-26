<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
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
	}: EntitySelectionViewProps<EntityType.FilecoinMessageSubcall> = $props()

	const message = $derived(selection.entitySelector.$message)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Filfox_Rest,
			Source.Lotus_JsonRpc,
		],
	}))
	const filecoinMessageSubcall = $derived(viewSelection({
		fields: {
			method: true,
			valueAttoFil: true,
		},
	}))
	const titleFallback = $derived((prefetched.method ?? '') || 'filecoin message subcall')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import FilecoinMessageView from '$/views/FilecoinMessageView.svelte'
	import FilecoinActorView from '$/views/FilecoinActorView.svelte'
</script>


<EntityView
	entityType={EntityType.FilecoinMessageSubcall}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/message/filecoin/[cid=stringSegment]/(filecoinMessage)/subcall/[index=nonNegativeInteger]',
				{
					network: (
						'caip2' in message.$network ?
							caip2StringFromValue(message.$network.caip2)
						:
							message.$network.slug
					),
					cid: message.cid,
					index: String(selection.entitySelector.index),
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
		<ResourceBoundary resource={filecoinMessageSubcall}>
			{#snippet children(entity)}
				{entity.method || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary
			resource={selection.$from}
		>
			{#snippet children(filecoinActor)}
				{#if filecoinActor != null}
					{@const filecoinActorInitial = untrack(() => filecoinActor)}
					<FilecoinActorView
						selection={select(EntityType.FilecoinActor, (filecoinActor ?? filecoinActorInitial)[EntityMetaKey.Selector])}
						href={null}
						layout={EntityLayout.Value}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>

		<ResourceBoundary
			resource={selection.$to}
		>
			{#snippet children(filecoinActor)}
				{#if filecoinActor != null}
					{@const filecoinActorInitial = untrack(() => filecoinActor)}
					<FilecoinActorView
						selection={select(EntityType.FilecoinActor, (filecoinActor ?? filecoinActorInitial)[EntityMetaKey.Selector])}
						href={null}
						layout={EntityLayout.Value}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={filecoinMessageSubcall}>
			{#snippet children(entity)}
				<span data-text="muted">
					<NumberValue
						value={entity.valueAttoFil}
					/>
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Message</dt>
				<dd>
					<FilecoinMessageView
						selection={select(EntityType.FilecoinMessage, selection.entitySelector.$message)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Index</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.index}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$from}
			>
				{#snippet children(filecoinActor)}
					{#if filecoinActor != null}
						{@const filecoinActorInitial = untrack(() => filecoinActor)}
						<div>
							<dt>From</dt>
							<dd>
								<FilecoinActorView
									selection={select(EntityType.FilecoinActor, (filecoinActor ?? filecoinActorInitial)[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$to}
			>
				{#snippet children(filecoinActor)}
					{#if filecoinActor != null}
						{@const filecoinActorInitial = untrack(() => filecoinActor)}
						<div>
							<dt>To</dt>
							<dd>
								<FilecoinActorView
									selection={select(EntityType.FilecoinActor, (filecoinActor ?? filecoinActorInitial)[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Method</dt>
				<dd>
					<ResourceBoundary
						resource={filecoinMessageSubcall}
					>
						{#snippet children(entity)}
							{entity.method}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							methodNumber: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const methodNumber = entity.methodNumber}
					{#if methodNumber != null}
						<div>
							<dt>Method number</dt>
							<dd>
								<NumberValue
									value={methodNumber}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Value attoFIL</dt>
				<dd>
					<ResourceBoundary
						resource={filecoinMessageSubcall}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.valueAttoFil}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							params: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const params = entity.params}
					{#if params != null}
						<div>
							<dt>Params</dt>
							<dd>
								{params}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							exitCode: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const exitCode = entity.exitCode}
					{#if exitCode != null}
						<div>
							<dt>Exit code</dt>
							<dd>
								<NumberValue
									value={exitCode}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							returnData: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const returnData = entity.returnData}
					{#if returnData != null}
						<div>
							<dt>Return data</dt>
							<dd>
								{returnData}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							gasUsed: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const gasUsed = entity.gasUsed}
					{#if gasUsed != null}
						<div>
							<dt>Gas used</dt>
							<dd>
								<NumberValue
									value={gasUsed}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
