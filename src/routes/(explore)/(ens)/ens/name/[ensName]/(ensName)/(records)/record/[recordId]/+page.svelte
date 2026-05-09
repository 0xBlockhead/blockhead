<script lang="ts">
	// Types/constants
	import type { JsonValue } from '$/typescript/JsonValue.ts'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import {
		getEnsTextRecordHref,
		getEnsTextRecordLabel,
	} from '$/constants/Ens.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { stringify } from 'devalue'

	import { entityCollectionByEntityType } from '$/routes/+layout.svelte'


	let {
		params,
	} = $props()

	const recordKey = $derived(
		params.recordId,
	)

	const ensNameIdKey = $derived(
		stringify(
			{ name: params.ensName } satisfies EntityId<typeof schema, EntityType.EnsName>,
		),
	)

	const ensNameQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ row: entityCollectionByEntityType[EntityType.EnsName] })
				.where(({ row }) => (
					eq(
						row[EntityMetaKey.IdKey],
						ensNameIdKey,
					)
				))
				.select(({ row }) => ({ row }))
		),
		[() => ensNameIdKey],
	)

	// Components
	import Page from '$/components/Page.svelte'
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<Page>
	<QueryBoundary
		query={ensNameQuery}
	>
		{#snippet children(rows)}
			{@const recordValue = (
				((f) => (
					f?.textRecords === undefined || typeof f.textRecords !== 'object' || Array.isArray(f.textRecords) ?
						undefined
					: typeof (f.textRecords as Record<string, JsonValue>)[recordKey] === 'string' ?
						(f.textRecords as Record<string, JsonValue>)[recordKey] as string
					:
						undefined
				))(
					(
						rows
							?.map((item) => item.row)
							.find((row) => row[EntityMetaKey.Source] === Source.Voltaire_JsonRpc)
					)
						?.[EntityMetaKey.Fields] as Record<string, JsonValue> | undefined,
				)
			)}
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
						<dd>{getEnsTextRecordLabel(recordKey)}</dd>
					</div>
					<div>
						<dt>Raw key</dt>
						<dd data-text="font-monospace">{recordKey}</dd>
					</div>
					<div>
						<dt>Value</dt>
						<dd>
							{#if recordValue !== undefined}
								{@const extHref = getEnsTextRecordHref(recordKey, recordValue)}
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
	</QueryBoundary>
</Page>
