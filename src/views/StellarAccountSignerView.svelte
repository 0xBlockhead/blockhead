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
			selection: EntityProxyResource<typeof schema, EntityType.StellarAccountSigner>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.StellarAccountSigner>>
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
	const stellarAccountSigner = $derived(selection({}))
	const titleFallback = $derived('stellar account signer')
	const viewDomId = $derived('stellar-account-signer-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import StellarAccountView from '$/views/StellarAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.StellarAccountSigner}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={stellarAccountSigner}>
			{#snippet Pending()}
				{title || 'stellar account signer'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>account</dt>
				<dd>
					<StellarAccountView
						selection={select(EntityType.StellarAccount, selection.entitySelector.$account, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>signer key</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									signerKey: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const signerKey = pendingEntity.signerKey}
							{#if signerKey !== undefined && signerKey !== null}
								{String((signerKey) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const signerKey = resolvedEntity.signerKey}
							{#if signerKey !== undefined && signerKey !== null}
								{String((signerKey) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>signer type</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									signerType: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const signerType = pendingEntity.signerType}
							{#if signerType !== undefined && signerType !== null}
								{String((signerType) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const signerType = resolvedEntity.signerType}
							{#if signerType !== undefined && signerType !== null}
								{String((signerType) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
