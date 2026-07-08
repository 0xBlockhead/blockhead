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
			selection: EntityProxyResource<typeof schema, EntityType.FedimintFederation>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.FedimintFederation>>
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
	const fedimintFederation = $derived(selection({
		fields: {
			name: true,
			consensusVersion: true,
		},
	}))
	const titleFallback = $derived([String((prefetched.name) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.federationId ?? prefetched.federationId) ?? '')].filter(Boolean).join(' ') || 'Fedimint federation')
	const viewDomId = $derived('fedimint-federation-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import FedimintFederation_TimestampsView from '$/views/FedimintFederation_TimestampsView.svelte'
	import FedimintGatewaysView from '$/views/FedimintGatewaysView.svelte'
</script>


<EntityView
	entityType={EntityType.FedimintFederation}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={fedimintFederation}>
			{#snippet Pending()}
				{[String((prefetched.name) ?? '')].filter(Boolean).join(' ') || title || [String((selection.entitySelector.federationId ?? prefetched.federationId) ?? '')].filter(Boolean).join(' ') || 'Fedimint federation'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.name) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={fedimintFederation}>
			{#snippet Pending()}
				{[String((prefetched.consensusVersion) ?? '')].filter(Boolean).join(' ') || [String((prefetched.name) ?? '')].filter(Boolean).join(' ') || title || [String((selection.entitySelector.federationId ?? prefetched.federationId) ?? '')].filter(Boolean).join(' ') || 'Fedimint federation'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.consensusVersion) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.name) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>federation ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									federationId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const federationId = selection.entitySelector.federationId ?? prefetched.federationId}
							{#if federationId !== undefined && federationId !== null}
								{String((federationId) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const federationId = resolvedEntity.federationId}
							{#if federationId !== undefined && federationId !== null}
								{String((federationId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							consensusVersion: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const consensusVersion = prefetched.consensusVersion}
					{#if consensusVersion !== undefined && consensusVersion !== null}
						<div>
							<dt>consensus version</dt>
							<dd>
								{String((consensusVersion) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const consensusVersion = resolvedEntity.consensusVersion}
					{#if consensusVersion !== undefined && consensusVersion !== null}
						<div>
							<dt>consensus version</dt>
							<dd>
								{String((consensusVersion) ?? '')}
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
							guardianCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const guardianCount = prefetched.guardianCount}
					{#if guardianCount !== undefined && guardianCount !== null}
						<div>
							<dt>guardian count</dt>
							<dd>
								<NumberValue value={Number(guardianCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const guardianCount = resolvedEntity.guardianCount}
					{#if guardianCount !== undefined && guardianCount !== null}
						<div>
							<dt>guardian count</dt>
							<dd>
								<NumberValue value={Number(guardianCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							guardianThreshold: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const guardianThreshold = prefetched.guardianThreshold}
					{#if guardianThreshold !== undefined && guardianThreshold !== null}
						<div>
							<dt>guardian threshold</dt>
							<dd>
								<NumberValue value={Number(guardianThreshold)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const guardianThreshold = resolvedEntity.guardianThreshold}
					{#if guardianThreshold !== undefined && guardianThreshold !== null}
						<div>
							<dt>guardian threshold</dt>
							<dd>
								<NumberValue value={Number(guardianThreshold)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							clientConfigJson: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const clientConfigJson = prefetched.clientConfigJson}
					{#if clientConfigJson !== undefined && clientConfigJson !== null}
						<div>
							<dt>client config JSON</dt>
							<dd>
								{String((clientConfigJson) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const clientConfigJson = resolvedEntity.clientConfigJson}
					{#if clientConfigJson !== undefined && clientConfigJson !== null}
						<div>
							<dt>client config JSON</dt>
							<dd>
								{String((clientConfigJson) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							moduleConfigJson: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const moduleConfigJson = prefetched.moduleConfigJson}
					{#if moduleConfigJson !== undefined && moduleConfigJson !== null}
						<div>
							<dt>module config JSON</dt>
							<dd>
								{String((moduleConfigJson) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const moduleConfigJson = resolvedEntity.moduleConfigJson}
					{#if moduleConfigJson !== undefined && moduleConfigJson !== null}
						<div>
							<dt>module config JSON</dt>
							<dd>
								{String((moduleConfigJson) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<FedimintFederation_TimestampsView
				selection={selection.$$timestamps}
				title='timestamps'
				emptyText='No observations yet.'
				id='FedimintFederation_TimestampsView-timestamps'
			/>

			<FedimintGatewaysView
				selection={selection.$$gateways}
				title='gateways'
				emptyText='No gateways found.'
				id='FedimintGatewaysView-gateways'
			/>
		{/if}
	{/snippet}
</EntityView>
