<script lang="ts">
	// Types/constants
	import { inspectPsbt, type PsbtInspection } from '$/lib/psbtInspect.ts'


	// State
	let input = $state(
		''
	)
	let inspection = $state<PsbtInspection | null>(
		null
	)
	let error = $state(
		''
	)


	// Functions
	const decodeInput = (
		value: string
	) => {
		const normalized = value.trim().replace(/\s/g, '')
		if (!normalized)
			throw new Error('Enter a base64 or hex PSBT.')

		if (/^(0x)?[0-9a-f]+$/i.test(normalized)) {
			const hex = normalized.replace(/^0x/i, '')
			if (hex.length % 2 !== 0)
				throw new Error('Hex PSBT text must contain complete bytes.')

			return Uint8Array.from(hex.match(/.{2}/g)?.map((byte) => Number.parseInt(byte, 16)) ?? [])
		}

		try {
			const binary = globalThis.atob(normalized)
			return Uint8Array.from(binary, (character) => character.charCodeAt(0))
		} catch {
			throw new Error('PSBT text must be base64 or hexadecimal.')
		}
	}

	const inspect = () => {
		inspection = null
		error = ''
		try {
			inspection = inspectPsbt(decodeInput(input))
		} catch (cause) {
			error = cause instanceof Error ? cause.message : 'Unable to parse PSBT.'
		}
	}

	const sats = (
		value: bigint
	) => value.toLocaleString('en-US')
</script>


<svelte:head>
	<title>PSBT inspector • Bitcoin • Blockhead</title>
</svelte:head>


<main class="psbt-inspector">
	<h1>PSBT inspector</h1>

	<p>Inspect a Bitcoin Partially Signed Bitcoin Transaction locally in your browser.</p>

	<form onsubmit={(event) => { event.preventDefault(); inspect() }}>
		<label for="psbt-input">Base64 or hex PSBT</label>
		<textarea id="psbt-input" bind:value={input} rows="8" spellcheck="false"></textarea>
		<button type="submit">Inspect PSBT</button>
	</form>

	{#if error}
		<p role="alert">Could not parse PSBT: {error}</p>
	{:else if inspection}
		<dl aria-label="PSBT inspection">
			<dt>PSBT version</dt>
			<dd>{inspection.psbtVersion}</dd>
			{#if inspection.txVersion != null}
				<dt>Transaction version</dt>
				<dd>{inspection.txVersion}</dd>
			{/if}
			{#if inspection.locktime != null}
				<dt>Locktime</dt>
				<dd>{inspection.locktime}</dd>
			{/if}
			<dt>Input count</dt>
			<dd>{inspection.inputCount}</dd>
			<dt>Output count</dt>
			<dd>{inspection.outputCount}</dd>
			<dt>Finalized input count</dt>
			<dd>{inspection.finalizedInputCount}</dd>
		</dl>

		<section aria-label="PSBT inputs">
			<h2>Inputs</h2>

			<ol>
				{#each inspection.inputs as inputRow (inputRow.index)}
					<li>
						<h3>Input {inputRow.index + 1}</h3>

						<dl>
							<dt>Finalized</dt>
							<dd>{inputRow.isFinalized ? 'yes' : 'no'}</dd>
							{#if inputRow.valueSats != null}
								<dt>Value sats</dt>
								<dd>{sats(inputRow.valueSats)}</dd>
							{/if}
							{#if inputRow.hasNonWitnessUtxo}
								<dt>Non-witness UTXO</dt>
								<dd>present</dd>
							{/if}
							{#if inputRow.hasWitnessUtxo}
								<dt>Witness UTXO</dt>
								<dd>present</dd>
							{/if}
							{#if inputRow.hasPartialSig}
								<dt>Partial signature</dt>
								<dd>present</dd>
							{/if}
							{#if inputRow.hasRedeemScript}
								<dt>Redeem script</dt>
								<dd>present</dd>
							{/if}
							{#if inputRow.hasWitnessScript}
								<dt>Witness script</dt>
								<dd>present</dd>
							{/if}
							{#if inputRow.hasBip32Derivation}
								<dt>BIP32 derivation</dt>
								<dd>present</dd>
							{/if}
							{#if inputRow.sighashType != null}
								<dt>Sighash type</dt>
								<dd>{inputRow.sighashType}</dd>
							{/if}
						</dl>
					</li>
				{/each}
			</ol>
		</section>

		<section aria-label="PSBT outputs">
			<h2>Outputs</h2>

			<ol>
				{#each inspection.outputs as outputRow (outputRow.index)}
					<li>
						<h3>Output {outputRow.index + 1}</h3>

						<dl>
							{#if outputRow.valueSats != null}
								<dt>Value sats</dt>
								<dd>{sats(outputRow.valueSats)}</dd>
							{/if}
							{#if outputRow.hasRedeemScript}
								<dt>Redeem script</dt>
								<dd>present</dd>
							{/if}
							{#if outputRow.hasWitnessScript}
								<dt>Witness script</dt>
								<dd>present</dd>
							{/if}
							{#if outputRow.hasBip32Derivation}
								<dt>BIP32 derivation</dt>
								<dd>present</dd>
							{/if}
						</dl>
					</li>
				{/each}
			</ol>
		</section>
	{/if}

	<p class="notice">Read-only: parsing happens locally. Nothing is signed, saved, broadcast, or sent over the network.</p>
</main>


<style>
	.psbt-inspector {
		max-width: 50rem;
		margin: 2rem auto;
		padding: 0 1rem;
	}

	form {
		display: grid;
		gap: 0.75rem;
		margin-top: 1.5rem;
	}

	textarea {
		font: inherit;
		padding: 0.75rem;
		resize: vertical;
	}

	button {
		justify-self: start;
		padding: 0.6rem 1rem;
	}

	dl {
		display: grid;
		grid-template-columns: minmax(12rem, 1fr) auto;
		gap: 0.5rem 1rem;
		margin-top: 1.5rem;
	}

	dt {
		font-weight: 600;
	}

	dd {
		margin: 0;
	}

	ol {
		display: grid;
		gap: 1.25rem;
		padding-left: 1.25rem;
	}

	li dl {
		margin-top: 0.5rem;
	}

	[role='alert'] {
		color: #a11;
	}

	.notice {
		margin-top: 2rem;
		font-size: 0.9rem;
	}
</style>
