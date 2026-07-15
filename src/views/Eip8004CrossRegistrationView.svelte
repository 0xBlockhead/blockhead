<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { UrlString } from '$/schema/UrlString.ts'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'
	import { Source } from '$/sources/Source.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.Eip8004CrossRegistration>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.Eip8004CrossRegistration>>
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
	const eip8004CrossRegistration = $derived(selection({
		sources: [
			Source.Eip8004Scan_Rest,
		],
	}))
	const titleFallback = $derived([String((pendingEntity.targetKind) ?? '')].filter(Boolean).join(' ') || 'EIP-8004 cross registration')
	const viewDomId = $derived('eip8004cross-registration-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import Eip8004AgentRegistrationFileView from '$/views/Eip8004AgentRegistrationFileView.svelte'
</script>


<EntityView
	entityType={EntityType.Eip8004CrossRegistration}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={eip8004CrossRegistration}>
			{#snippet Pending()}
				{[String((pendingEntity.targetKind) ?? '')].filter(Boolean).join(' ') || title || 'EIP-8004 cross registration'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.targetKind) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={eip8004CrossRegistration}>
			{#snippet Pending()}
				{[String((pendingEntity.targetSelectorHash) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.targetKind) ?? '')].filter(Boolean).join(' ') || title || 'EIP-8004 cross registration'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.targetSelectorHash) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.targetKind) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={eip8004CrossRegistration}>
			{#snippet Pending()}
				{@const targetSelectorHashAlgorithm0 = pendingEntity.targetSelectorHashAlgorithm}
				{#if targetSelectorHashAlgorithm0 !== undefined && targetSelectorHashAlgorithm0 !== null}
					<span data-text="muted">
						<TruncatedValue value={String((targetSelectorHashAlgorithm0) ?? '')} />
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const targetSelectorHashAlgorithm0 = resolvedEntity.targetSelectorHashAlgorithm}
				{#if targetSelectorHashAlgorithm0 !== undefined && targetSelectorHashAlgorithm0 !== null}
					<span data-text="muted">
						<TruncatedValue value={String((targetSelectorHashAlgorithm0) ?? '')} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Registration file</dt>
				<dd>
					<Eip8004AgentRegistrationFileView
						selection={select(EntityType.Eip8004AgentRegistrationFile, selection.entitySelector.$registrationFile, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Target kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									targetKind: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const targetKind = pendingEntity.targetKind}
							{#if targetKind !== undefined && targetKind !== null}
								{String((targetKind) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const targetKind = resolvedEntity.targetKind}
							{#if targetKind !== undefined && targetKind !== null}
								{String((targetKind) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Target selector hash algorithm</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									targetSelectorHashAlgorithm: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const targetSelectorHashAlgorithm = pendingEntity.targetSelectorHashAlgorithm}
							{#if targetSelectorHashAlgorithm !== undefined && targetSelectorHashAlgorithm !== null}
								<TruncatedValue value={String((targetSelectorHashAlgorithm) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const targetSelectorHashAlgorithm = resolvedEntity.targetSelectorHashAlgorithm}
							{#if targetSelectorHashAlgorithm !== undefined && targetSelectorHashAlgorithm !== null}
								<TruncatedValue value={String((targetSelectorHashAlgorithm) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Target selector hash</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									targetSelectorHash: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const targetSelectorHash = pendingEntity.targetSelectorHash}
							{#if targetSelectorHash !== undefined && targetSelectorHash !== null}
								<TruncatedValue value={String((targetSelectorHash) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const targetSelectorHash = resolvedEntity.targetSelectorHash}
							{#if targetSelectorHash !== undefined && targetSelectorHash !== null}
								<TruncatedValue value={String((targetSelectorHash) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							evidenceUri: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const evidenceUri = pendingEntity.evidenceUri}
					{#if evidenceUri !== undefined && evidenceUri !== null}
						<div>
							<dt>Evidence URI</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(evidenceUri)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(evidenceUri)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const evidenceUri = resolvedEntity.evidenceUri}
					{#if evidenceUri !== undefined && evidenceUri !== null}
						<div>
							<dt>Evidence URI</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(evidenceUri)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(evidenceUri)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
