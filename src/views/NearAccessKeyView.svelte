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
			selection: EntityProxyResource<typeof schema, EntityType.NearAccessKey>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.NearAccessKey>>
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
	const nearAccessKey = $derived(selection({
		sources: [
			Source.NearRpc_JsonRpc,
		],
		fields: {
			permission: true,
			nonce: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.publicKey ?? prefetched.publicKey) ?? '')].filter(Boolean).join(' ') || 'near access key')
	const viewDomId = $derived('near-access-key-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NearAccountView from '$/views/NearAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.NearAccessKey}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={nearAccessKey}>
			{#snippet Pending()}
				{@const publicKey0 = selection.entitySelector.publicKey ?? prefetched.publicKey}
				{#if publicKey0 !== undefined && publicKey0 !== null}
					<TruncatedValue value={String((publicKey0) ?? '')} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const publicKey0 = resolvedEntity.publicKey}
				{#if publicKey0 !== undefined && publicKey0 !== null}
					<TruncatedValue value={String((publicKey0) ?? '')} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={nearAccessKey}>
			{#snippet Pending()}
				{[String((prefetched.permission) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.publicKey ?? prefetched.publicKey) ?? '')].filter(Boolean).join(' ') || title || 'near access key'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.permission) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.publicKey) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={nearAccessKey}>
			{#snippet Pending()}
				{@const nonce0 = prefetched.nonce}
				{#if nonce0 !== undefined && nonce0 !== null}
					<span data-text="muted">
						<NumberValue value={Number(nonce0)} />
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const nonce0 = resolvedEntity.nonce}
				{#if nonce0 !== undefined && nonce0 !== null}
					<span data-text="muted">
						<NumberValue value={Number(nonce0)} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Account</dt>
				<dd>
					<NearAccountView
						selection={select(EntityType.NearAccount, selection.entitySelector.$account)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Public key</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									publicKey: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const publicKey = selection.entitySelector.publicKey ?? prefetched.publicKey}
							{#if publicKey !== undefined && publicKey !== null}
								<TruncatedValue value={String((publicKey) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const publicKey = resolvedEntity.publicKey}
							{#if publicKey !== undefined && publicKey !== null}
								<TruncatedValue value={String((publicKey) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.NearRpc_JsonRpc,
						],
						fields: {
							nonce: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const nonce = prefetched.nonce}
					{#if nonce !== undefined && nonce !== null}
						<div>
							<dt>Nonce</dt>
							<dd>
								<NumberValue value={Number(nonce)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const nonce = resolvedEntity.nonce}
					{#if nonce !== undefined && nonce !== null}
						<div>
							<dt>Nonce</dt>
							<dd>
								<NumberValue value={Number(nonce)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.NearRpc_JsonRpc,
						],
						fields: {
							permission: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const permission = prefetched.permission}
					{#if permission !== undefined && permission !== null}
						<div>
							<dt>Permission</dt>
							<dd>
								{String((permission) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const permission = resolvedEntity.permission}
					{#if permission !== undefined && permission !== null}
						<div>
							<dt>Permission</dt>
							<dd>
								{String((permission) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
