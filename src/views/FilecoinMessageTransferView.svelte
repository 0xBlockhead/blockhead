<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


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
	}: EntitySelectionViewProps<EntityType.FilecoinMessageTransfer> = $props()

	const filecoinMessageTransfer = $derived(selection({
		sources: selection.sources ?? [
			Source.Filfox_Rest,
		],
		fields: {
			transferType: true,
			valueAttoFil: true,
		},
	}))
	const titleFallback = $derived((prefetched.transferType ?? '') || 'filecoin message transfer')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import FilecoinMessageView from '$/views/FilecoinMessageView.svelte'
	import FilecoinActorView from '$/views/FilecoinActorView.svelte'
</script>


<EntityView
	entityType={EntityType.FilecoinMessageTransfer}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={filecoinMessageTransfer}>
			{#snippet children(entity)}
				{entity.transferType || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={filecoinMessageTransfer}>
			{#snippet children(entity)}
				<NumberValue
					value={entity.valueAttoFil}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={selection.$from}
		>
			{#snippet children(filecoinActor)}
				{#if filecoinActor != null}
					<span data-text="muted">
						<FilecoinActorView
							selection={select(EntityType.FilecoinActor, filecoinActor[EntityMetaKey.Selector])}
							layout={EntityLayout.Title}
						/>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>

		<ResourceBoundary
			resource={selection.$to}
		>
			{#snippet children(filecoinActor)}
				{#if filecoinActor != null}
					<span data-text="muted">
						<FilecoinActorView
							selection={select(EntityType.FilecoinActor, filecoinActor[EntityMetaKey.Selector])}
							layout={EntityLayout.Title}
						/>
					</span>
				{/if}
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
						<div>
							<dt>From</dt>
							<dd>
								<FilecoinActorView
									selection={select(EntityType.FilecoinActor, filecoinActor[EntityMetaKey.Selector])}
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
						<div>
							<dt>To</dt>
							<dd>
								<FilecoinActorView
									selection={select(EntityType.FilecoinActor, filecoinActor[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Value attoFIL</dt>
				<dd>
					<ResourceBoundary
						resource={filecoinMessageTransfer}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.valueAttoFil}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Transfer type</dt>
				<dd>
					<ResourceBoundary
						resource={filecoinMessageTransfer}
					>
						{#snippet children(entity)}
							{entity.transferType}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
