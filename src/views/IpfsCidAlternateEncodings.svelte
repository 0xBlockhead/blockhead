<script lang="ts">
	// Types/constants
	import type { CID } from 'multiformats/cid'

	type ShowEncodings = 'all' | 'common' | 'no-formatting-variants'


	// State
	let {
		contentPath,
		target,
	}: {
		contentPath: string
		target: string
	} = $props()


	// Functions
	const filteredEncodings = (
		targetParam: string,
		cidValue: CID,
		show: ShowEncodings,
	) => (
		getAllIpfsCidEncodings(cidValue).filter(({ version, baseName }) => (
			(
				version === cidValue.version
				&& baseName === currentMultibaseNameForCidTarget(targetParam, cidValue)
			)
			|| (
				show === 'common' ?
					version === 0 || baseName === 'base32' || baseName === 'base36'
				: show === 'no-formatting-variants' ?
					!/(?:upper|pad)$/.test(baseName)
				:
					true
			)
		))
	)


	// State
	import { ipfsResourceHref } from '$/lib/ipfs.ts'

	import {
		checkIpfsCidIsValidSubdomain,
		currentMultibaseNameForCidTarget,
		getAllIpfsCidEncodings,
		parseIpfsCid,
	} from '$/lib/multiformats.ts'

	let showEncodings = $state<ShowEncodings>('common')


	const cid = $derived(parseIpfsCid(target))


	// Components
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
</script>


{#if cid}
	<section
		class="ipfs-cid-alternate-encodings"
		data-card
		data-column
	>
		<header data-row="wrap">
			<div data-row="wrap align-center gap-2">
				<h3>Same CID, different multibase literals</h3>
				<Tooltip contentProps={{ side: 'top' }}>
					{#snippet Content()}
						<p>
							A content id keeps the digest and codec constants; switching multibase tables only rewires punctuation.
						</p>
						<p>
							Each literal here is interchangeable for gateways; Swarm URIs remain a distinct ecosystem.
						</p>
					{/snippet}
					<abbr
						class="entity-heading-tip"
						aria-label="Why many strings match"
					>ⓘ</abbr>
				</Tooltip>
			</div>

			<label data-row="wrap">
				<span data-text="muted">Show</span>
				<select bind:value={showEncodings}>
					<option value="common">Common</option>
					<option value="no-formatting-variants">All bases</option>
					<option value="all">All bases + formatting variants</option>
				</select>
			</label>
		</header>

		<div
			class="ipfs-cid-encoding-ipfsCidAlternateEncodingses"
			data-column
		>
			{#each filteredEncodings(target, cid, showEncodings) as encoding (`${encoding.version}-${encoding.baseName}`)}
				{@const subdomainOk = checkIpfsCidIsValidSubdomain({
					baseName: encoding.baseName,
					cidString: encoding.cidString,
				})}
				<div
					class="ipfs-cid-encoding-row"
					data-column
				>
					<div>
						CIDv{String(encoding.version)}
						<small data-text="muted">
							{' '}({encoding.baseName})
						</small>
					</div>
					<div data-row="wrap">
						<button
							type="button"
							onclick={() => {
								window.location.assign(
									ipfsResourceHref({
										namespace: 'ipfs',
										target: encoding.cidString,
										contentPath,
									}),
								)
							}}
						>
							<TruncatedValue
								value={encoding.cidString}
								format={TruncatedValueFormat.Visual}
							/>
						</button>
						{#if subdomainOk !== undefined}
							<a
								href="https://docs.ipfs.tech/how-to/address-ipfs-on-web/#subdomain-gateway"
								target="_blank"
								rel="noreferrer noopener"
								data-text="muted"
							>
								{subdomainOk ? 'Subdomain gateway OK' : 'Subdomain gateway too long'}
							</a>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</section>
{/if}


<style>
	.ipfs-cid-alternate-encodings {
		gap: 1rem;
		padding: 1rem;
	}

	.ipfs-cid-encoding-ipfsCidAlternateEncodingses {
		gap: 1rem;
	}

	.ipfs-cid-encoding-row {
		gap: 0.375rem;
	}
</style>
