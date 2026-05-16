<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'


	// Props
	let {
		children,
		entityId,
		title = 'Transaction',
		href,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.EvmTransaction>
			title?: string
			href: string
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
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const tx = useEntity(
		EntityType.EvmTransaction,
		entityId,
		{
			$: [
				Source.Blockscout_Rest,
				Source.Voltaire_JsonRpc,
			],
			value: {},
			nonce: {},
			transactionIndex: {},
			gas: {},
			gasPrice: {},
			type: {},
			status: {},
			gasUsed: {},
			effectiveGasPrice: {},
		},
	)
</script>


<EntityView
	entityType={EntityType.EvmTransaction}
	{entityId}
	{title}
	{href}
	idDragPlainText={entityId.txHash}
	{open}
	{...entityViewRest}
>
	{#snippet Heading()}

		<span
			data-text="font-monospace"
			data-tx-hash={entityId.txHash}
		>
			<TruncatedValue
				value={entityId.txHash}
				format={TruncatedValueFormat.Abbr}
			/>
		</span>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<ResourceBoundary
			resource={tx}
			placeholderText="Loading transaction…"
		>
			{#snippet children(t)}
				<dl>
					{#if t.value !== undefined}
						<div>
							<dt>Value</dt>
							<dd>
								<NumberValue value={t.value} />
							</dd>
						</div>
					{/if}
					{#if t.status !== undefined}
						<div>
							<dt>Status</dt>
							<dd>{String(t.status)}</dd>
						</div>
					{/if}
					{#if t.gasUsed !== undefined}
						<div>
							<dt>Gas used</dt>
							<dd>
								<NumberValue value={t.gasUsed} />
							</dd>
						</div>
					{/if}
					{#if open}
						{#if t.nonce !== undefined}
							<div>
								<dt>Nonce</dt>
								<dd>{String(t.nonce)}</dd>
							</div>
						{/if}
					{/if}
					{#if open}
						{#if t.transactionIndex !== undefined}
							<div>
								<dt>Index</dt>
								<dd>{String(t.transactionIndex)}</dd>
							</div>
						{/if}
					{/if}
					{#if open}
						{#if t.gas !== undefined}
							<div>
								<dt>Gas</dt>
								<dd>
									<NumberValue value={t.gas} />
								</dd>
							</div>
						{/if}
					{/if}
					{#if open}
						{#if t.gasPrice !== undefined}
							<div>
								<dt>Gas price</dt>
								<dd>
									<NumberValue value={t.gasPrice} />
								</dd>
							</div>
						{/if}
					{/if}
					{#if open}
						{#if t.type !== undefined}
							<div>
								<dt>Type</dt>
								<dd>{String(t.type)}</dd>
							</div>
						{/if}
					{/if}
					{#if open}
						{#if t.effectiveGasPrice !== undefined}
							<div>
								<dt>Effective gas price</dt>
								<dd>
									<NumberValue value={t.effectiveGasPrice} />
								</dd>
							</div>
						{/if}
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.EvmTransaction}
			{entityId}
		/>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
