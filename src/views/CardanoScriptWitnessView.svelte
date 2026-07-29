<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


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
	}: EntitySelectionViewProps<EntityType.CardanoScriptWitness> = $props()

	const cardanoScriptWitness = $derived(selection({
		fields: {
			scriptKind: true,
			scriptHash: true,
		},
	}))
	const titleFallback = $derived([(prefetched.scriptKind ?? ''), 'Script #' + String(selection.entitySelector.witnessIndex)].filter(Boolean).join(' ') || 'Cardano script witness')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import CardanoTransactionView from '$/views/CardanoTransactionView.svelte'
</script>


<EntityView
	entityType={EntityType.CardanoScriptWitness}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={cardanoScriptWitness}>
			{#snippet children(entity)}
				{[entity.scriptKind, 'Script #' + String(selection.entitySelector.witnessIndex)].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={cardanoScriptWitness}>
			{#snippet children(entity)}
				{(entity.scriptHash ?? '') || [entity.scriptKind, 'Script #' + String(selection.entitySelector.witnessIndex)].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>transaction</dt>
				<dd>
					<CardanoTransactionView
						selection={select(EntityType.CardanoTransaction, selection.entitySelector.$transaction)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>witness index</dt>
				<dd>
					{selection.entitySelector.witnessIndex}
				</dd>
			</div>

			<div>
				<dt>script kind</dt>
				<dd>
					<ResourceBoundary
						resource={cardanoScriptWitness}
					>
						{#snippet children(entity)}
							{entity.scriptKind}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							language: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const language = entity.language}
					{#if language != null}
						<div>
							<dt>language</dt>
							<dd>
								{language}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={cardanoScriptWitness}
			>
				{#snippet children(entity)}
					{@const scriptHash = entity.scriptHash}
					{#if scriptHash != null}
						<div>
							<dt>script hash</dt>
							<dd>
								<TruncatedValue value={scriptHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
