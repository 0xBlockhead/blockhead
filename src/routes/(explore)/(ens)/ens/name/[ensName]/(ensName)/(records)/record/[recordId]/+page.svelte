<script lang="ts">
	// Types/constants
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import {
		getEnsTextRecordHref,
		getEnsTextRecordLabel,
	} from '$/constants/Ens.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'

	import Page from '$/components/Page.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'

	import { useEntity } from '$/collections/$queries.svelte.ts'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		params,
	} = $props()


	// State
	const ensName = useEntity(
		EntityType.EnsName,
		{ name: params.ensName } satisfies EntityId<typeof schema, EntityType.EnsName>,
		{
			$: [Source.Voltaire_JsonRpc],
			textRecords: {},
		},
	)
</script>


<Page>
	<ResourceBoundary
		resource={ensName}
	>
		{#snippet children(live)}
			{@const recordValue = live.textRecords?.[params.recordId]}
			<section data-card>
				<h2>
					<a
						data-link
						href={resolve('/(explore)/(ens)/ens/name/[ensName]', {
							ensName: params.ensName,
						})}
					>{params.ensName}</a>
					<span data-text="muted"> · text record</span>
				</h2>
				<dl>
					<div>
						<dt>Key</dt>
						<dd>{getEnsTextRecordLabel(params.recordId)}</dd>
					</div>
					<div>
						<dt>Raw key</dt>
						<dd data-text="font-monospace">{params.recordId}</dd>
					</div>
					<div>
						<dt>Value</dt>
						<dd>
							{#if recordValue !== undefined}
								{@const extHref = getEnsTextRecordHref(params.recordId, recordValue)}
								{#if extHref !== undefined && (extHref.startsWith('http://') || extHref.startsWith('https://') || extHref.startsWith('mailto:'))}
									<button
										type="button"
										data-button="unstyled"
										data-link
										onclick={() => {
											window.open(
												extHref,
												'_blank',
												'noopener,noreferrer',
											)
										}}
									>
										<TruncatedValue
											value={recordValue}
											format={TruncatedValueFormat.Visual}
										/>
									</button>
								{:else}
									<TruncatedValue
										value={recordValue}
										format={TruncatedValueFormat.Visual}
									/>
								{/if}
							{:else}
								<span data-text="muted">
									No value for this key on the Voltaire resolver row yet.
								</span>
							{/if}
						</dd>
					</div>
				</dl>
			</section>
		{/snippet}
	</ResourceBoundary>
</Page>
