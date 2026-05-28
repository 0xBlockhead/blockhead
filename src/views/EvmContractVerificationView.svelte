<script lang="ts">
	// Types/constants
	import { caip2RouteParamsFromEvmChainId } from '$/lib/caip.ts'


	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve(
			'/(explore)/network/[caip2Namespace]:[caip2Reference]/(network)/(contracts)/contract/[address]/verification/[verificationId]',
			{
				...caip2RouteParamsFromEvmChainId(entityId.$network.chainId),
				address: entityId.$contract.address,
				verificationId: entityId.verificationId,
			},
		),
		layout = EntityLayout.SummaryDetails,
		summaryUsesHeading = (
			layout === EntityLayout.SummaryDetails
			|| layout === EntityLayout.Details
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
		},
		never
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const verification = useEntity(
		EntityType.EvmContractVerification,
		entityId,
		{
			$: [
				Source.Sourcify_Rest,
			],
			...(open && {
				match: {},
				creationMatch: {},
				runtimeMatch: {},
				verifiedAtMs: {},
				matchId: {},
				$compilation: {},
				$sourceBundle: {},
			}),
		},
	)


	const verificationIdKey = $derived(
		stringify(entityId),
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
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
		Source verification
	{/snippet}

	{#snippet Title()}
		{@render Value()}
	{/snippet}

	{#snippet Heading()}
		<ResourceBoundary
			resource={verification}
			placeholderText="Loading verification…"
		>
			{#snippet children(verification)}
				{verification.match ?? 'Verified'}
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
				{#if verification.match}
					<div>
						<dt>Match</dt>
						<dd>
							<ResourceBoundary
								resource={verification}
								placeholderText="Loading verification record…"
							>
								{#snippet children(verification)}
									<code>{verification.match}</code>
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>
				{/if}
				{#if verification.creationMatch}
					<div>
						<dt>Creation match</dt>
						<dd>
							<ResourceBoundary
								resource={verification}
								placeholderText="Loading verification record…"
							>
								{#snippet children(verification)}
									<code>{verification.creationMatch}</code>
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>
				{/if}
				{#if verification.runtimeMatch}
					<div>
						<dt>Runtime match</dt>
						<dd>
							<ResourceBoundary
								resource={verification}
								placeholderText="Loading verification record…"
							>
								{#snippet children(verification)}
									<code>{verification.runtimeMatch}</code>
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>
				{/if}
				{#if verification.verifiedAtMs}
					<div>
						<dt>Verified at</dt>
						<dd>
							<ResourceBoundary
								resource={verification}
								placeholderText="Loading verification record…"
							>
								{#snippet children(verification)}
									<Timestamp timestamp={verification.verifiedAtMs} />
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>
				{/if}
				{#if verification.matchId}
					<div>
						<dt>Match id</dt>
						<dd>
							<ResourceBoundary
								resource={verification}
								placeholderText="Loading verification record…"
							>
								{#snippet children(verification)}
									{verification.matchId}
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>
				{/if}
			</dl>
		{/if}
	{/snippet}

	{#snippet Details({ open: _detailsOpen })}
		<ResourceBoundary resource={verification}>
			{#snippet children(verification)}
				{#if verification.$compilation}
					<section id={`${verificationIdKey}:compilation`}>
						<EvmContractCompilationView
							entityId={verification.$compilation[EntityMetaKey.Id]}
							layout={EntityLayout.SummaryDetails}
							open={true}
						/>
					</section>
				{/if}

				{#if verification.$sourceBundle}
					<section id={`${verificationIdKey}:source-bundle`}>
						<EvmContractSourceBundleView
							entityId={verification.$sourceBundle[EntityMetaKey.Id]}
							layout={EntityLayout.SummaryDetails}
							open={true}
						/>
					</section>
				{/if}
			{/snippet}
		</ResourceBoundary>


	{/snippet}
</EntityView>
