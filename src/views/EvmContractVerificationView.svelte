<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve('/(explore)/(networks)/network/[caip2Namespace=eip155Caip2Namespace]:[caip2Reference=eip155Caip2Reference]/(network)/(contracts)/contract/[address]', {
				...{ caip2Namespace: entityId.$network.caip2.namespace, caip2Reference: entityId.$network.caip2.reference },
			address: entityId.address,
			}),
		layout = EntityLayout.SummaryDetails,
		summaryUsesHeading = (
			layout === EntityLayout.SummaryDetails
		),
		open = $bindable(
			layout === EntityLayout.SummaryDetails,
		),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.EvmContractVerification>
			href?: string
			layout?: EntityLayout
			summaryUsesHeading?: boolean
			open?: boolean
			collapsible?: boolean
		},
		never
	> = $props()

	const verification = subscribe(EntityType.EvmContractVerification,
		entityId,
		({ sources: [
				Source.Sourcify_Rest,
			], fields: { ...(open && ({ match: true, creationMatch: true, runtimeMatch: true, verifiedAtMs: true, matchId: true, $compilation: true, $sourceBundle: true })) } }),
	)


	// (Derived)
	const verificationRow = $derived(
		verification.ready ? verification.current : undefined,
	)

	const verificationIdKey = $derived(
		stringify(entityId),
	)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import EvmContractCompilationView from '$/views/EvmContractCompilationView.svelte'
	import EvmContractSourceBundleView from '$/views/EvmContractSourceBundleView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
</script>


<EntityView
	entityType={EntityType.EvmContractVerification}
	{entityId}
	href={href}
	{layout}
	bind:open
	{collapsible}
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary
			resource={verification}
			placeholderText="Loading verification…"
		>
			{#snippet children(verification)}
				{verification.fields.match ?? 'Verified source'}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Attestation that published source and a compilation run match on-chain creation and/or runtime bytecode (Sourcify).
		</p>
		<p>
			Verification is off-chain metadata; the chain only stores bytecode and receipt logs.
		</p>
	{/snippet}

	{#snippet Content({
		open: contentOpen,
	})}
		{#if contentOpen}
			<dl data-column-item="center">
				{#if verificationRow?.fields.match}
					<div>
						<dt>Match</dt>
						<dd>
							<ResourceBoundary
								resource={verification}
								placeholderText="Loading verification record…"
							>
								{#snippet children(verification)}
									<code>{verification.fields.match}</code>
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>
				{/if}
				{#if verificationRow?.fields.creationMatch}
					<div>
						<dt>Creation match</dt>
						<dd>
							<ResourceBoundary
								resource={verification}
								placeholderText="Loading verification record…"
							>
								{#snippet children(verification)}
									<code>{verification.fields.creationMatch}</code>
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>
				{/if}
				{#if verificationRow?.fields.runtimeMatch}
					<div>
						<dt>Runtime match</dt>
						<dd>
							<ResourceBoundary
								resource={verification}
								placeholderText="Loading verification record…"
							>
								{#snippet children(verification)}
									<code>{verification.fields.runtimeMatch}</code>
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>
				{/if}
				{#if verificationRow?.fields.verifiedAtMs}
					<div>
						<dt>Verified at</dt>
						<dd>
							<ResourceBoundary
								resource={verification}
								placeholderText="Loading verification record…"
							>
								{#snippet children(verification)}
									<Timestamp timestamp={verification.fields.verifiedAtMs} />
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>
				{/if}
				{#if verificationRow?.fields.matchId}
					<div>
						<dt>Match id</dt>
						<dd>
							<ResourceBoundary
								resource={verification}
								placeholderText="Loading verification record…"
							>
								{#snippet children(verification)}
									{verification.fields.matchId}
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>
				{/if}
			</dl>
		{/if}
	{/snippet}

	{#snippet Details({ open })}
		<ResourceBoundary resource={verification}>
			{#snippet children(verification)}
				{#if verification.fields.$compilation}
					<section id={`${verificationIdKey}:compilation`}>
						<EvmContractCompilationView
							entityId={verification.fields.$compilation[EntityMetaKey.Id]}
							layout={EntityLayout.SummaryDetails}
							open={true}
						/>
					</section>
				{/if}

				{#if verification.fields.$sourceBundle}
					<section id={`${verificationIdKey}:source-bundle`}>
						<EvmContractSourceBundleView
							entityId={verification.fields.$sourceBundle[EntityMetaKey.Id]}
							layout={EntityLayout.SummaryDetails}
							open={true}
						/>
					</section>
				{/if}
			{/snippet}
		</ResourceBoundary>


	{/snippet}
</EntityView>
