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
			selection: EntityProxyResource<typeof schema, EntityType.ContractInterfaceMember>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.ContractInterfaceMember>>
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
	const contractInterfaceMember = $derived(selection({
		fields: {
			name: true,
			canonicalSignature: true,
			memberKind: true,
		},
	}))
	const titleFallback = $derived([String((prefetched.name) ?? ''), String((prefetched.canonicalSignature) ?? ''), String((selection.entitySelector.memberKey ?? prefetched.memberKey) ?? '')].filter(Boolean).join(' ') || 'contract interface member')
	const viewDomId = $derived('contract-interface-member-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.ContractInterfaceMember}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={contractInterfaceMember}>
			{#snippet Pending()}
				{[String((prefetched.name) ?? ''), String((prefetched.canonicalSignature) ?? ''), String((selection.entitySelector.memberKey ?? prefetched.memberKey) ?? '')].filter(Boolean).join(' ') || title || 'contract interface member'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.name) ?? ''), String((resolvedEntity.canonicalSignature) ?? ''), String((resolvedEntity.memberKey) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={contractInterfaceMember}>
			{#snippet Pending()}
				{[String((prefetched.memberKind) ?? '')].filter(Boolean).join(' ') || [String((prefetched.name) ?? ''), String((prefetched.canonicalSignature) ?? ''), String((selection.entitySelector.memberKey ?? prefetched.memberKey) ?? '')].filter(Boolean).join(' ') || title || 'contract interface member'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.memberKind) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.name) ?? ''), String((resolvedEntity.canonicalSignature) ?? ''), String((resolvedEntity.memberKey) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={contractInterfaceMember}>
			{#snippet Pending()}
				{@const interfaceId0 = selection.entitySelector.interfaceId ?? prefetched.interfaceId}
				{#if interfaceId0 !== undefined && interfaceId0 !== null}
					<span data-text="muted">
						{String((interfaceId0) ?? '')}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const interfaceId0 = resolvedEntity.interfaceId}
				{#if interfaceId0 !== undefined && interfaceId0 !== null}
					<span data-text="muted">
						{String((interfaceId0) ?? '')}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Interface ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									interfaceId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const interfaceId = selection.entitySelector.interfaceId ?? prefetched.interfaceId}
							{#if interfaceId !== undefined && interfaceId !== null}
								{String((interfaceId) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const interfaceId = resolvedEntity.interfaceId}
							{#if interfaceId !== undefined && interfaceId !== null}
								{String((interfaceId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Member key</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									memberKey: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const memberKey = selection.entitySelector.memberKey ?? prefetched.memberKey}
							{#if memberKey !== undefined && memberKey !== null}
								{String((memberKey) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const memberKey = resolvedEntity.memberKey}
							{#if memberKey !== undefined && memberKey !== null}
								{String((memberKey) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Member kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									memberKind: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const memberKind = prefetched.memberKind}
							{#if memberKind !== undefined && memberKind !== null}
								{String((memberKind) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const memberKind = resolvedEntity.memberKind}
							{#if memberKind !== undefined && memberKind !== null}
								{String((memberKind) ?? '')}
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
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							canonicalSignature: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const canonicalSignature = prefetched.canonicalSignature}
					{#if canonicalSignature !== undefined && canonicalSignature !== null}
						<div>
							<dt>Canonical signature</dt>
							<dd>
								<TruncatedValue value={String((canonicalSignature) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const canonicalSignature = resolvedEntity.canonicalSignature}
					{#if canonicalSignature !== undefined && canonicalSignature !== null}
						<div>
							<dt>Canonical signature</dt>
							<dd>
								<TruncatedValue value={String((canonicalSignature) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							selector: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const selector = prefetched.selector}
					{#if selector !== undefined && selector !== null}
						<div>
							<dt>Selector</dt>
							<dd>
								{String((selector) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const selector = resolvedEntity.selector}
					{#if selector !== undefined && selector !== null}
						<div>
							<dt>Selector</dt>
							<dd>
								{String((selector) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							stateMutability: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const stateMutability = prefetched.stateMutability}
					{#if stateMutability !== undefined && stateMutability !== null}
						<div>
							<dt>State mutability</dt>
							<dd>
								{String((stateMutability) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const stateMutability = resolvedEntity.stateMutability}
					{#if stateMutability !== undefined && stateMutability !== null}
						<div>
							<dt>State mutability</dt>
							<dd>
								{String((stateMutability) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
