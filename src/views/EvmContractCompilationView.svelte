<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.EvmContractCompilation>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.EvmContractCompilation>>
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
	const evmContractCompilation = $derived(selection({
		sources: selection.sources,
		fields: {
			name: true,
			fullyQualifiedName: true,
			compiler: true,
			compilerVersion: true,
			language: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.name) ?? ''), String((pendingEntity.fullyQualifiedName) ?? ''), String((pendingEntity.compiler) ?? '')].filter(Boolean).join(' ') || 'EVM contract compilation')
	const viewDomId = $derived('evm-contract-compilation-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmContractCompilation}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.name) ?? ''), String((pendingEntity.fullyQualifiedName) ?? ''), String((pendingEntity.compiler) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={evmContractCompilation}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.name) ?? ''), String((resolvedEntity.fullyQualifiedName) ?? ''), String((resolvedEntity.compiler) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.compilerVersion) ?? ''), String((pendingEntity.language) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.name) ?? ''), String((pendingEntity.fullyQualifiedName) ?? ''), String((pendingEntity.compiler) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={evmContractCompilation}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.compilerVersion) ?? ''), String((resolvedEntity.language) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.name) ?? ''), String((resolvedEntity.fullyQualifiedName) ?? ''), String((resolvedEntity.compiler) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			<span data-text="muted">
				<EvmContractView
					selection={select(EntityType.EvmContract, selection.entitySelector.$contract)}
					href={
						(selection.entitySelector.$contract.address !== undefined && selection.entitySelector.$contract.$network !== undefined && selection.entitySelector.$contract.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/contract/[address=evmAddress]', {
							address: String(selection.entitySelector.$contract.address ?? ''),
							network: String(caip2StringFromValue(selection.entitySelector.$contract.$network.caip2) ?? ''),
						}) : selection.entitySelector.$contract.address !== undefined && selection.entitySelector.$contract.$network !== undefined && selection.entitySelector.$contract.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/contract/[address=evmAddress]', {
							address: String(selection.entitySelector.$contract.address ?? ''),
							network: String(selection.entitySelector.$contract.$network.slug ?? ''),
						}) : undefined)
					}
					layout={EntityLayout.Title}
					open={false}
				/>
			</span>
		{:else}
			<ResourceBoundary resource={evmContractCompilation}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					<span data-text="muted">
						<EvmContractView
							selection={select(EntityType.EvmContract, selection.entitySelector.$contract)}
							href={
								(selection.entitySelector.$contract.address !== undefined && selection.entitySelector.$contract.$network !== undefined && selection.entitySelector.$contract.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/contract/[address=evmAddress]', {
									address: String(selection.entitySelector.$contract.address ?? ''),
									network: String(caip2StringFromValue(selection.entitySelector.$contract.$network.caip2) ?? ''),
								}) : selection.entitySelector.$contract.address !== undefined && selection.entitySelector.$contract.$network !== undefined && selection.entitySelector.$contract.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/contract/[address=evmAddress]', {
									address: String(selection.entitySelector.$contract.address ?? ''),
									network: String(selection.entitySelector.$contract.$network.slug ?? ''),
								}) : undefined)
							}
							layout={EntityLayout.Title}
							open={false}
						/>
					</span>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							language: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const language = resolvedEntity.language}
					{#if language !== undefined && language !== null}
						<div>
							<dt>Language</dt>
							<dd>
								{String((language) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							compiler: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const compiler = resolvedEntity.compiler}
					{#if compiler !== undefined && compiler !== null}
						<div>
							<dt>Compiler</dt>
							<dd>
								{String((compiler) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							compilerVersion: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const compilerVersion = resolvedEntity.compilerVersion}
					{#if compilerVersion !== undefined && compilerVersion !== null}
						<div>
							<dt>Compiler version</dt>
							<dd>
								{String((compilerVersion) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							name: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const name = resolvedEntity.name}
					{#if name !== undefined && name !== null}
						<div>
							<dt>Name</dt>
							<dd>
								{String((name) ?? '')}
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
						sources: selection.sources,
						fields: {
							fullyQualifiedName: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const fullyQualifiedName = resolvedEntity.fullyQualifiedName}
					{#if fullyQualifiedName !== undefined && fullyQualifiedName !== null}
						<div>
							<dt>Fully qualified name</dt>
							<dd>
								{String((fullyQualifiedName) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Contract</dt>
				<dd>
					<EvmContractView
						selection={select(EntityType.EvmContract, selection.entitySelector.$contract, {})}
						href={
							(selection.entitySelector.$contract.address !== undefined && selection.entitySelector.$contract.$network !== undefined && selection.entitySelector.$contract.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/contract/[address=evmAddress]', {
								address: String(selection.entitySelector.$contract.address ?? ''),
								network: String(caip2StringFromValue(selection.entitySelector.$contract.$network.caip2) ?? ''),
							}) : selection.entitySelector.$contract.address !== undefined && selection.entitySelector.$contract.$network !== undefined && selection.entitySelector.$contract.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/contract/[address=evmAddress]', {
								address: String(selection.entitySelector.$contract.address ?? ''),
								network: String(selection.entitySelector.$contract.$network.slug ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>

		<ResourceBoundary
			resource={
				selection({
					sources: selection.sources,
					fields: {
						compilerSettingsJson: true,
					},
				})
			}
		>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const compilerSettingsJson = resolvedEntity.compilerSettingsJson}
				{#if compilerSettingsJson !== undefined && compilerSettingsJson !== null && compilerSettingsJson !== ''}
					<code>{String((compilerSettingsJson) ?? '')}</code>
				{:else}
					<p data-text="muted">No compiler settings JSON available.</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
