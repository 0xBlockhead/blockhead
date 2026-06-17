<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


	// Context
	import { proxy } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selector,
		href = resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(contracts)/contract/[address]', {
			caip2: ,
			address: selector.$contract.address,
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
			selector: EntitySelector<typeof schema, EntityType.EvmContractVerification>
			href?: string
			layout?: EntityLayout
			summaryUsesHeading?: boolean
			open?: boolean
			collapsible?: boolean
		},
		never
	> = $props()

	const verification = $derived(proxy(EntityType.EvmContractVerification, selector, {
		sources: [Source.Sourcify_Rest],
	}))
	const match = $derived(verification.match)
	
	
	
	
	
	
	const verificationSelectorKey = $derived(
		stringify(selector),
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
	entitySelector={selector}
	href={href}
	{layout}
	bind:open
	{collapsible}
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary
			resource={match}
			placeholderText="Loading verification…"
		>
			{#snippet children(match)}
				{match ?? 'Verified source'}
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
				<ResourceBoundary
					resource={match}
					placeholderText="Loading verification record…"
				>
					{#snippet children(match)}
						{#if match}
							<div>
								<dt>Match</dt>
								<dd><code>{match}</code></dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>

				<ResourceBoundary
					resource={verification.creationMatch}
					placeholderText="Loading verification record…"
				>
					{#snippet children(creationMatch)}
						{#if creationMatch}
							<div>
								<dt>Creation match</dt>
								<dd><code>{creationMatch}</code></dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>

				<ResourceBoundary
					resource={verification.runtimeMatch}
					placeholderText="Loading verification record…"
				>
					{#snippet children(runtimeMatch)}
						{#if runtimeMatch}
							<div>
								<dt>Runtime match</dt>
								<dd><code>{runtimeMatch}</code></dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>

				<ResourceBoundary
					resource={verification.verifiedAtMs}
					placeholderText="Loading verification record…"
				>
					{#snippet children(verifiedAtMs)}
						{#if verifiedAtMs}
							<div>
								<dt>Verified at</dt>
								<dd>
									<Timestamp timestamp={verifiedAtMs} />
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>

				<ResourceBoundary
					resource={verification.matchId}
					placeholderText="Loading verification record…"
				>
					{#snippet children(matchId)}
						{#if matchId}
							<div>
								<dt>Match id</dt>
								<dd>{matchId}</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			</dl>
		{/if}
	{/snippet}

	{#snippet Details({ open })}
		<ResourceBoundary resource={verification.$compilation}>
			{#snippet children(compilation)}
				{#if compilation}
					<section id={`${verificationSelectorKey}:compilation`}>
						<EvmContractCompilationView
							selector={compilation.entitySelector}
							layout={EntityLayout.SummaryDetails}
							open={true}
						/>
					</section>
				{/if}
			{/snippet}
		</ResourceBoundary>

		<ResourceBoundary resource={verification.$sourceBundle}>
			{#snippet children(sourceBundle)}
				{#if sourceBundle}
					<section id={`${verificationSelectorKey}:source-bundle`}>
						<EvmContractSourceBundleView
							selector={sourceBundle.entitySelector}
							layout={EntityLayout.SummaryDetails}
							open={true}
						/>
					</section>
				{/if}
			{/snippet}
		</ResourceBoundary>


	{/snippet}
</EntityView>
