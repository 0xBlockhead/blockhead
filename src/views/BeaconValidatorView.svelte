<script lang="ts">
	// Types/constants
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selection,
		href = resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]', {
			caip2: `${selection.entitySelector.$network.caip2.namespace}:${selection.entitySelector.$network.caip2.reference}`,
		}),
		layout = EntityLayout.Summary,
		title: titleProp,
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.BeaconValidator>
			href?: string
			layout?: EntityLayout
			title?: string
			open?: boolean
			collapsible?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'showTypeAnnotation'
		>
	> = $props()


	const validator = $derived(selection({
			sources: [
				Source.Beacon_Rest,
			],
		},
	))
	
	
	
	
	


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.BeaconValidator}
	entitySelector={selection.entitySelector}
	href={href}
		{layout}
	bind:open
	title={titleProp ?? `Validator #${selection.entitySelector.validatorIndex.toLocaleString()}`}
		{collapsible}
		{...EntityViewProps}
>
	{#snippet Value()}
		<span data-badge="small">
			#{String(selection.entitySelector.validatorIndex)}
		</span>
	{/snippet}

	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
			<span>Validator </span>
		<span data-badge="small">
			#{String(selection.entitySelector.validatorIndex)}
		</span>
		</span>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Each validator can propose or attest; this row comes from deduped recent beacon proposer duties near the chain head—not the full validator set.
		</p>
	{/snippet}

	{#snippet Content({})}
		<div data-column="gap-1">
			<dl data-column-item="center">
				{#if open}
					<ResourceBoundary
						placeholderText="Loading validator balance…"
						resource={validator.balanceGwei}
					>
						{#snippet children(balanceGwei)}
							{#if balanceGwei !== undefined}
								<div>
									<dt>Balance</dt>
									<dd>
										<NumberValue value={balanceGwei} />
										gwei
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						placeholderText="Loading effective balance…"
						resource={validator.effectiveBalanceGwei}
					>
						{#snippet children(effectiveBalanceGwei)}
							{#if effectiveBalanceGwei !== undefined}
								<div>
									<dt>Effective balance</dt>
									<dd>
										<NumberValue value={effectiveBalanceGwei} />
										gwei
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						placeholderText="Loading validator status…"
						resource={validator.status}
					>
						{#snippet children(status)}
							{#if status !== undefined}
								<div>
									<dt>Status</dt>
									<dd>{status}</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						placeholderText="Loading slashing status…"
						resource={validator.slashed}
					>
						{#snippet children(slashed)}
							{#if slashed !== undefined}
								<div>
									<dt>Slashed</dt>
									<dd>{slashed ? 'Yes' : 'No'}</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						placeholderText="Loading validator pubkey…"
						resource={validator.pubkey}
					>
						{#snippet children(pubkey)}
							{#if pubkey !== undefined}
								<div>
									<dt>Pubkey</dt>
									<dd>
										<TruncatedValue
											format={TruncatedValueFormat.Visual}
											value={pubkey}
										/>
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/if}
			</dl>
		</div>
	{/snippet}
</EntityView>
