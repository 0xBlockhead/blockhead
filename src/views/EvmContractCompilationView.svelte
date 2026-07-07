<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.EvmContractCompilation>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.EvmContractCompilation>>
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
		fields: {
			name: true,
			fullyQualifiedName: true,
			compiler: true,
			compilerVersion: true,
			language: true,
		},
	}))
	const titleFallback = $derived([String((prefetched.name) ?? ''), String((prefetched.fullyQualifiedName) ?? ''), String((prefetched.compiler) ?? '')].filter(Boolean).join(' ') || 'EVM contract compilation')
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
		<ResourceBoundary resource={evmContractCompilation}>
			{#snippet Pending()}
				{[String((prefetched.name) ?? ''), String((prefetched.fullyQualifiedName) ?? ''), String((prefetched.compiler) ?? '')].filter(Boolean).join(' ') || title || 'EVM contract compilation'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.name) ?? ''), String((resolvedEntity.fullyQualifiedName) ?? ''), String((resolvedEntity.compiler) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={evmContractCompilation}>
			{#snippet Pending()}
				{[String((prefetched.compilerVersion) ?? ''), String((prefetched.language) ?? '')].filter(Boolean).join(' ') || [String((prefetched.name) ?? ''), String((prefetched.fullyQualifiedName) ?? ''), String((prefetched.compiler) ?? '')].filter(Boolean).join(' ') || title || 'EVM contract compilation'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.compilerVersion) ?? ''), String((resolvedEntity.language) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.name) ?? ''), String((resolvedEntity.fullyQualifiedName) ?? ''), String((resolvedEntity.compiler) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={evmContractCompilation}>
			{#snippet Pending()}
				<span data-text="muted">
					<EvmContractView
						selection={select(EntityType.EvmContract, selection.entitySelector.$contract)}
						href={
							(selection.entitySelector.$contract.$network !== undefined && selection.entitySelector.$contract.$network.caip2 !== undefined && selection.entitySelector.$contract.$network.caip2.namespace !== undefined && selection.entitySelector.$contract.$network !== undefined && selection.entitySelector.$contract.$network.caip2 !== undefined && selection.entitySelector.$contract.$network.caip2.reference !== undefined && selection.entitySelector.$contract.address !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(contracts)/contract/[address=evmAddress]', {
								caip2: `${String(selection.entitySelector.$contract.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$contract.$network.caip2.reference ?? '')}`,
								address: String(selection.entitySelector.$contract.address ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</span>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<span data-text="muted">
					<EvmContractView
						selection={select(EntityType.EvmContract, selection.entitySelector.$contract)}
						href={
							(selection.entitySelector.$contract.$network !== undefined && selection.entitySelector.$contract.$network.caip2 !== undefined && selection.entitySelector.$contract.$network.caip2.namespace !== undefined && selection.entitySelector.$contract.$network !== undefined && selection.entitySelector.$contract.$network.caip2 !== undefined && selection.entitySelector.$contract.$network.caip2.reference !== undefined && selection.entitySelector.$contract.address !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(contracts)/contract/[address=evmAddress]', {
								caip2: `${String(selection.entitySelector.$contract.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$contract.$network.caip2.reference ?? '')}`,
								address: String(selection.entitySelector.$contract.address ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							language: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const language = prefetched.language}
					{#if language !== undefined && language !== null}
						<div>
							<dt>Language</dt>
							<dd>
								{String((language) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							compiler: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const compiler = prefetched.compiler}
					{#if compiler !== undefined && compiler !== null}
						<div>
							<dt>Compiler</dt>
							<dd>
								{String((compiler) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							compilerVersion: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const compilerVersion = prefetched.compilerVersion}
					{#if compilerVersion !== undefined && compilerVersion !== null}
						<div>
							<dt>Compiler version</dt>
							<dd>
								{String((compilerVersion) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							name: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const name = prefetched.name}
					{#if name !== undefined && name !== null}
						<div>
							<dt>Name</dt>
							<dd>
								{String((name) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							fullyQualifiedName: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const fullyQualifiedName = prefetched.fullyQualifiedName}
					{#if fullyQualifiedName !== undefined && fullyQualifiedName !== null}
						<div>
							<dt>Fully qualified name</dt>
							<dd>
								{String((fullyQualifiedName) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
							(selection.entitySelector.$contract.$network !== undefined && selection.entitySelector.$contract.$network.caip2 !== undefined && selection.entitySelector.$contract.$network.caip2.namespace !== undefined && selection.entitySelector.$contract.$network !== undefined && selection.entitySelector.$contract.$network.caip2 !== undefined && selection.entitySelector.$contract.$network.caip2.reference !== undefined && selection.entitySelector.$contract.address !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(contracts)/contract/[address=evmAddress]', {
								caip2: `${String(selection.entitySelector.$contract.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$contract.$network.caip2.reference ?? '')}`,
								address: String(selection.entitySelector.$contract.address ?? ''),
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
