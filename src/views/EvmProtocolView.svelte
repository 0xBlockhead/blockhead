<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
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
			selection: EntityProxyResource<typeof schema, EntityType.EvmProtocol>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.EvmProtocol>>
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

	const evmProtocol = $derived(selection({
		sources: [
			Source.Constants_Internal,
		],
		fields: {
			protocolName: true,
			registryLabel: true,
			topology: true,
			...(open && {
				homeUrl: true,
				docsUrl: true,
				$$evmTopics: true,
				$$evmSelectors: true,
				$$evmErrors: true,
			}),
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).protocolName) ?? '')].filter(Boolean).join(' ') || 'EVM protocol')
	const viewDomId = $derived('evm-protocol-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import EvmSelectorsView from '$/views/EvmSelectorsView.svelte'
	import EvmTopicsView from '$/views/EvmTopicsView.svelte'
	import EvmErrorsView from '$/views/EvmErrorsView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmProtocol}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={href ?? resolve('/(explore)/(evm)/evm')}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).protocolName) ?? '')].filter(Boolean).join(' ') || title || 'EVM protocol'}
		{:else}
			<ResourceBoundary resource={evmProtocol}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).protocolName) ?? '')].filter(Boolean).join(' ') || title || 'EVM protocol'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.protocolName) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).registryLabel) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).protocolName) ?? '')].filter(Boolean).join(' ') || title || 'EVM protocol'}
		{:else}
			<ResourceBoundary resource={evmProtocol}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).registryLabel) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).protocolName) ?? '')].filter(Boolean).join(' ') || title || 'EVM protocol'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.registryLabel) ?? '')].filter(Boolean).join(' ') || [String((entity.protocolName) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Catalog surface for EVM signature, topic, and error registries.
		</p>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Topology</dt>
				<dd>
					<ResourceBoundary resource={evmProtocol}>
						{#snippet Pending()}
							{@const topology = prefetched.topology ?? selection.entitySelector.topology}
							{#if topology !== undefined && topology !== null}
								{String((topology) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const topology = entity.topology ?? selection.entitySelector.topology ?? prefetched.topology}
							{#if topology !== undefined && topology !== null}
								{String((topology) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Home URL</dt>
				<dd>
					<ResourceBoundary resource={evmProtocol}>
						{#snippet Pending()}
							{@const homeUrl = prefetched.homeUrl ?? selection.entitySelector.homeUrl}
							{#if homeUrl !== undefined && homeUrl !== null}
								{String((homeUrl) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const homeUrl = entity.homeUrl ?? selection.entitySelector.homeUrl ?? prefetched.homeUrl}
							{#if homeUrl !== undefined && homeUrl !== null}
								{String((homeUrl) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary resource={evmProtocol}>
				{#snippet Pending()}
					{@const docsUrl = prefetched.docsUrl ?? selection.entitySelector.docsUrl}
					{#if docsUrl !== undefined && docsUrl !== null}
						<div>
							<dt>Docs URL</dt>
							<dd>
								{String((docsUrl) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const docsUrl = entity.docsUrl ?? selection.entitySelector.docsUrl ?? prefetched.docsUrl}
					{#if docsUrl !== undefined && docsUrl !== null}
						<div>
							<dt>Docs URL</dt>
							<dd>
								{String((docsUrl) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<EvmSelectorsView
				selection={selection[EntityProxyField]<EntityType.EvmSelector>('$$evmSelectors')}
				title='EVM selectors'
				href={resolve('/(explore)/(evm)/evm/(selectors)/selectors')}
				emptyText='No EVM selectors in this source window.'
				id='EvmSelectorsView-$$evmSelectors'
			/>

			<EvmTopicsView
				selection={selection[EntityProxyField]<EntityType.EvmTopic>('$$evmTopics')}
				title='EVM topics'
				href={resolve('/(explore)/(evm)/evm/(topics)/topics')}
				emptyText='No EVM topics in this source window.'
				id='EvmTopicsView-$$evmTopics'
			/>

			<EvmErrorsView
				selection={selection[EntityProxyField]<EntityType.EvmError>('$$evmErrors')}
				title='EVM errors'
				href={resolve('/(explore)/(evm)/evm/(errors)/errors')}
				emptyText='No EVM errors in this source window.'
				id='EvmErrorsView-$$evmErrors'
			/>
		{/if}
	{/snippet}
</EntityView>
