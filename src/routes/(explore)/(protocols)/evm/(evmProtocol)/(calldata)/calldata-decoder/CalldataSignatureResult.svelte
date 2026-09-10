<script module lang="ts">
	export const CalldataSignatureKind = {
		Event: 'Event',
		Function: 'Function',
	} as const

	export type CalldataSignatureKind = typeof CalldataSignatureKind[keyof typeof CalldataSignatureKind]
</script>


<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'
	import { Source } from '$/sources/Source.ts'
	import type { DecodedCalldata } from '$/typescript/DecodedCalldata.ts'

	const truncateParamLength = 28


	// State
	import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'
	import type { Snippet } from 'svelte'

	let {
		Address,
		hex,
		kind,
		resource,
		retry,
		source,
		selectedSignatureIndex = $bindable(0),
	}: {
		Address?: Snippet<[address: string]>
		hex: `0x${string}`
		kind: CalldataSignatureKind
		resource: SvelteKitResource<{ values: readonly string[] }>
		retry: () => void
		source: Source
		selectedSignatureIndex?: number
	} = $props()


	// Functions
	import {
		abiFragmentFromSignature,
		decodeCalldataWithSignature,
		decodeEventDataWithSignature,
		formatDecodedParamValue,
	} from '$/lib/calldata-decode.ts'
	import { errorDisplayMessage } from '$/lib/errors.ts'

	const csvField = (value: string) => `"${value.replaceAll('"', '""')}"`
	const decodedParamsCsv = (params: DecodedCalldata['params']) => [
		['index', 'type', 'value'].map(csvField).join(','),
		...params.map((param, index) => [
			String(index),
			param.type,
			formatDecodedParamValue(param.type, param.value),
		].map(csvField).join(',')),
	].join('\r\n') + '\r\n'


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
</script>


<aside
	aria-label="Signature provenance"
	data-card="padding-2"
	data-column="gap-1"
>
	<p>
		<strong>Candidate lookup:</strong>
		<a href={resolve('/~/manage/source/[sourceId=stringSegment]', { sourceId: source })}>{source}</a>
		supplied these candidate signatures. They are catalog claims, not verified contract behavior.
	</p>

	<p>
		<strong>Interpretation:</strong>
		The selected candidate ABI and signature remain sourced. Decoding the supplied hex is performed locally and is deterministic for that exact candidate; it does not prove that a contract intended the call.
	</p>
</aside>

<a
	href={`data:text/plain;charset=utf-8,${encodeURIComponent(`${hex}\n`)}`}
	download={`evm-${kind === CalldataSignatureKind.Function ? 'function-calldata' : 'event-data'}-raw.txt`}
>
	Download raw hex
</a>

<a
	href={`data:application/json;charset=utf-8,${encodeURIComponent(`${JSON.stringify({
		artifactVersion: 1,
		kind: kind === CalldataSignatureKind.Function ? 'function-calldata' : 'event-data',
		input: hex,
	}, null, '\t')}\n`)}`}
	download={`evm-${kind === CalldataSignatureKind.Function ? 'function-calldata' : 'event-data'}-raw.json`}
>
	Download raw input JSON
</a>

<ResourceBoundary
	{resource}
	placeholderText={`Loading ${kind === CalldataSignatureKind.Function ? 'function' : 'event'} signature...`}
>
	{#snippet children(signatures)}
		{@const selectedCandidateIndex = signatures.values.length === 0 ? null : Math.min(selectedSignatureIndex, signatures.values.length - 1)}
		{@const selectedSignature = signatures.values[selectedCandidateIndex]}
		{@const decoded = selectedSignature == null ? null : kind === CalldataSignatureKind.Function ? decodeCalldataWithSignature(selectedSignature, ZeroExHex.assert(hex)) : decodeEventDataWithSignature(selectedSignature, ZeroExHex.assert(hex))}
		{@const lookupHex = kind === CalldataSignatureKind.Function ? hex.slice(0, 10) : hex.slice(0, 66)}
		{@const provenanceManifestJson = `${JSON.stringify({
			artifactVersion: 1,
			kind: kind === CalldataSignatureKind.Function ? 'function-calldata' : 'event-data',
			input: hex,
			sourceClaim: {
				source,
				lookupHex,
				role: 'hosted-signature-catalog',
				retrievalTimestampMs: null,
				finality: null,
				confidence: null,
				retention: null,
				outcome: signatures.values.length === 0 ? 'no-matching-claim' : signatures.values.length === 1 ? 'single-claim' : 'ambiguous-claims',
				candidateSignatures: signatures.values,
				selectedCandidateIndex,
				...(selectedSignature != null && {
					signature: selectedSignature,
					abi: abiFragmentFromSignature(
						selectedSignature,
						kind === CalldataSignatureKind.Function ? 'function' : 'event'
					),
				}),
			},
			deterministicResult: decoded == null ? null : {
				name: decoded.name,
				params: decoded.params.map((param, index) => ({
					index,
					type: param.type,
					value: formatDecodedParamValue(param.type, param.value),
				})),
			},
		}, null, '\t')}\n`}

		<section aria-label={`${source} claim status`} data-card="padding-2" data-column="gap-1">
			<h3>{source} claim status</h3>

			<dl data-definition-list="vertical">
				<div>
					<dt>Source role</dt>
					<dd>Hosted signature catalog</dd>
				</div>

				<div>
					<dt>Lookup coordinate</dt>
					<dd><code>{lookupHex}</code></dd>
				</div>

				<div>
					<dt>Candidate outcome</dt>
					<dd>
						{signatures.values.length === 0 ? 'No matching claim' : signatures.values.length === 1 ? 'One catalog claim' : `${signatures.values.length} ambiguous catalog claims`}
					</dd>
				</div>

				<div>
					<dt>Retrieval clock</dt>
					<dd>Not exposed by this source payload</dd>
				</div>

				<div>
					<dt>Finality</dt>
					<dd>Not applicable to a signature catalog claim</dd>
				</div>

				<div>
					<dt>Confidence and retention</dt>
					<dd>Not declared by the source</dd>
				</div>
			</dl>

			{#if signatures.values.length > 1}
				<p role="status">
					The lookup is ambiguous. Selecting a candidate chooses a deterministic interpretation; it does not resolve the source conflict.
				</p>
			{/if}
		</section>

		<a
			href={`data:application/json;charset=utf-8,${encodeURIComponent(provenanceManifestJson)}`}
			download={`evm-${kind === CalldataSignatureKind.Function ? 'function-calldata' : 'event-data'}-provenance.json`}
		>
			Download provenance manifest JSON
		</a>

		{#if selectedSignature == null}
			<p data-text="muted">No catalog signatures matched this {kind === CalldataSignatureKind.Function ? 'function selector' : 'event topic'}.</p>
		{:else}
			{@const abiFragment = abiFragmentFromSignature(
					selectedSignature,
					kind === CalldataSignatureKind.Function ? 'function' : 'event'
				)}
			{@const abiFragmentJson = abiFragment == null ? null : `${JSON.stringify([abiFragment], null, '\t')}\n`}
			{@const decodedJson = decoded == null ? null : `${JSON.stringify({
				artifactVersion: 1,
				kind: kind === CalldataSignatureKind.Function ? 'function-calldata' : 'event-data',
				input: hex,
				signature: selectedSignature,
				name: decoded.name,
				params: decoded.params.map((param, index) => ({
					index,
					type: param.type,
					value: formatDecodedParamValue(param.type, param.value),
				})),
			}, null, '\t')}\n`}
			{@const decodedTableCsv = decoded == null ? null : decodedParamsCsv(decoded.params)}
			<dl data-definition-list="vertical">
				<div>
					<dt>Signature</dt>
					<dd>
						{#if signatures.values.length > 1}
							<select
								bind:value={selectedSignatureIndex}
								aria-label={`Choose ${kind === CalldataSignatureKind.Function ? 'function' : 'event'} signature`}
							>
								{#each signatures.values as signature, index (signature)}
									<option value={index}>{signature}</option>
								{/each}
							</select>
						{:else}
							<code>{selectedSignature}</code>
						{/if}
					</dd>
				</div>

				{#if decoded != null}
					<div>
						<dt>Arguments</dt>
						<dd>
							<ol>
								{#each decoded.params as param, index (`${index}:${param.type}`)}
									<li>
										<span>{index}</span>
										{#if param.type === 'address' && typeof param.value === 'string' && Address}
											{@render Address(param.value)}
										{:else}
											{@const decodedValue = formatDecodedParamValue(param.type, param.value)}

											{#if decodedValue.length > truncateParamLength}
												<TruncatedValue
													value={decodedValue}
													startLength={10}
													endLength={8}
												/>
											{:else}
												<span class="calldata-result-arg-value">{decodedValue}</span>
											{/if}
										{/if}
									</li>
								{/each}
							</ol>
						</dd>
					</div>
				{/if}
			</dl>

			{#if abiFragmentJson != null}
				<a
					href={`data:application/json;charset=utf-8,${encodeURIComponent(abiFragmentJson)}`}
					download={`evm-${kind === CalldataSignatureKind.Function ? 'function' : 'event'}-candidate-abi.json`}
				>
					Download candidate ABI JSON
				</a>
			{/if}

			{#if decodedJson != null}
				<a
					href={`data:application/json;charset=utf-8,${encodeURIComponent(decodedJson)}`}
					download={`evm-${kind === CalldataSignatureKind.Function ? 'function-calldata' : 'event-data'}-decoded.json`}
				>
					Download decoded JSON
				</a>
			{/if}

			{#if decodedTableCsv != null}
				<a
					href={`data:text/csv;charset=utf-8,${encodeURIComponent(decodedTableCsv)}`}
					download={`evm-${kind === CalldataSignatureKind.Function ? 'function-calldata' : 'event-data'}-decoded.csv`}
				>
					Download decoded table CSV
				</a>
			{/if}

		{/if}
	{/snippet}

	{#snippet Failed(error)}
		<p
			data-resource-state="failed"
			role="alert"
		>
			Unable to load {kind === CalldataSignatureKind.Function ? 'function' : 'event'} signatures from the candidate lookup: {errorDisplayMessage(error)}
			<button type="button" onclick={retry}>Retry signature lookup</button>
		</p>
	{/snippet}
</ResourceBoundary>


<style>
	select {
		font-family: var(--fontFamily-monospace);
		max-width: 100%;
	}

	ol {
		margin: 0;
	}

	li span:first-child {
		font-family: var(--fontFamily-monospace);
		min-inline-size: 1.5em;
	}

	.calldata-result-arg-value {
		font-family: var(--fontFamily-monospace);
		word-break: break-all;
	}
</style>
