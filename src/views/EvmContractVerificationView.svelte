<script lang="ts">
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


	// Props
	let {
		children: _children,
		entityId,
		href,
		layout = EntityLayout.SummaryDetails,
		summaryUsesHeading = (
			layout === EntityLayout.SummaryDetails
			|| layout === EntityLayout.Details
		),
		open = $bindable(
			layout === EntityLayout.SummaryDetails,
		),
		collapsible = true,
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.EvmContractVerification>
			href: string
			layout?: EntityLayout
			summaryUsesHeading?: boolean
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'open'
			| 'title'
			| 'Details'
			| 'Heading'
		>
	> = $props()

	const verificationIdKey = $derived(
		stringify(entityId),
	)


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
				verifiedAt: {},
				matchId: {},
				$compilation: {},
				$sourceBundle: {},
			}),
		},
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import EvmContractCompilationView from '$/views/EvmContractCompilationView.svelte'
	import EvmContractSourceBundleView from '$/views/EvmContractSourceBundleView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
</script>


<EntityView
	entityType={EntityType.EvmContractVerification}
	{entityId}
	{href}
	{layout}
	{summaryUsesHeading}
	bind:open
	{collapsible}
	{...entityViewRest}
>
	{#snippet Title()}
		Source verification
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
			<ResourceBoundary
				resource={verification}
				placeholderText="Loading verification record…"
			>
				{#snippet children(verification)}
					<dl data-column-item="center">
						{#if verification.match}
							<div>
								<dt>Match</dt>
								<dd><code>{verification.match}</code></dd>
							</div>
						{/if}
						{#if verification.creationMatch}
							<div>
								<dt>Creation match</dt>
								<dd><code>{verification.creationMatch}</code></dd>
							</div>
						{/if}
						{#if verification.runtimeMatch}
							<div>
								<dt>Runtime match</dt>
								<dd><code>{verification.runtimeMatch}</code></dd>
							</div>
						{/if}
						{#if verification.verifiedAt}
							<div>
								<dt>Verified at</dt>
								<dd>{verification.verifiedAt}</dd>
							</div>
						{/if}
						{#if verification.matchId}
							<div>
								<dt>Match id</dt>
								<dd>{verification.matchId}</dd>
							</div>
						{/if}
					</dl>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Details()}
		<EntityDetails
			entityType={EntityType.EvmContractVerification}
			{entityId}
		/>

		<ResourceBoundary resource={verification}>
			{#snippet children(verification)}
				<div
					class="entity-view-detail-carousels"
					data-column="gap-3"
				>
					{#if verification.$compilation}
						<section id={`${verificationIdKey}:compilation`}>
							<EvmContractCompilationView
								entityId={verification.$compilation[EntityMetaKey.Id]}
								href={resolve(
									'/(explore)/(networks)/network/[networkId]/(network)/(contracts)/contract/[address]',
									{
										networkId: String(entityId.$network.chainId),
										address: entityId.address,
									},
								)}
								layout={EntityLayout.SummaryDetails}
								open={true}
							/>
						</section>
					{/if}

					{#if verification.$sourceBundle}
						<section id={`${verificationIdKey}:source-bundle`}>
							<EvmContractSourceBundleView
								entityId={verification.$sourceBundle[EntityMetaKey.Id]}
								href={resolve(
									'/(explore)/(networks)/network/[networkId]/(network)/(contracts)/contract/[address]',
									{
										networkId: String(entityId.$network.chainId),
										address: entityId.address,
									},
								)}
								layout={EntityLayout.SummaryDetails}
								open={true}
							/>
						</section>
					{/if}
				</div>
			{/snippet}
		</ResourceBoundary>

		{#if _children}
			<section id={`${verificationIdKey}:page-content`}>
				{@render _children()}
			</section>
		{/if}
	{/snippet}
</EntityView>
