<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.MoveModule_Timestamp>, 'prefetched'> = $props()

	const module = $derived(selection.entitySelector.$module)
	const moveModuleTimestamp = $derived(selection({
		fields: {
			ledgerVersion: true,
			packageVersion: true,
		},
	}))


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
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.timestampMs)}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/move/module/[address=stringSegment]/[moduleName=stringSegment]/(moveModule)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					network: (
						module.$network.caip2 !== undefined ?
							caip2StringFromValue(module.$network.caip2)
						:
							module.$network.slug
					),
					address: module.address,
					moduleName: module.moduleName,
					timestampMs: String(selection.entitySelector.timestampMs),
					source: selection.entitySelector.source,
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
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={moveModuleTimestamp}>
			{#snippet children(entity)}
				{[String(entity.ledgerVersion ?? ''), String(entity.packageVersion ?? '')].filter(Boolean).join(' ') || String(selection.entitySelector.timestampMs)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			{selection.entitySelector.source}
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>module</dt>
				<dd>
					<MoveModuleView
						selection={select(EntityType.MoveModule, selection.entitySelector.$module)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={moveModuleTimestamp}
			>
				{#snippet children(entity)}
					{@const ledgerVersion = entity.ledgerVersion}
					{#if ledgerVersion != null}
						<div>
							<dt>ledger version</dt>
							<dd>
								<NumberValue
									value={ledgerVersion}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={moveModuleTimestamp}
			>
				{#snippet children(entity)}
					{@const packageVersion = entity.packageVersion}
					{#if packageVersion != null}
						<div>
							<dt>package version</dt>
							<dd>
								<NumberValue
									value={packageVersion}
								/>
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
				{#snippet children(entity)}
					{@const packageDigest = entity.packageDigest}
					{#if packageDigest != null}
						<div>
							<dt>package digest</dt>
							<dd>
								<TruncatedValue value={packageDigest} />
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
				{#snippet children(entity)}
					{@const bytecode = entity.bytecode}
					{#if bytecode != null}
						<div>
							<dt>bytecode</dt>
							<dd>
								{bytecode}
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
				{#snippet children(entity)}
					{@const sourceDigest = entity.sourceDigest}
					{#if sourceDigest != null}
						<div>
							<dt>source digest</dt>
							<dd>
								<TruncatedValue value={sourceDigest} />
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
				{@const sourceCode = entity.sourceCode}
				{#if sourceCode != null && sourceCode !== ''}
					<code>{sourceCode}</code>
				{:else}
					<p data-text="muted">No source code available.</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details()}
		{@const functionsResource = selection.$$functions}
		<ResourceBoundary
			resource={functionsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<MoveFunctionsView
						selection={functionsResource}
						countResource={functionsResource.count}
						title='functions'
						id='functions'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const structsResource = selection.$$structs}
		<ResourceBoundary
			resource={structsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<MoveStructsView
						selection={structsResource}
						countResource={structsResource.count}
						title='structs'
						id='structs'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
