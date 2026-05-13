<script lang="ts">
	// Types/constants
	type ShowEncodings = 'all' | 'common' | 'no-formatting-variants'

	import type { CID } from 'multiformats/cid'

	import { ipfsResourceHref } from '$/lib/ipfs.ts'
	import {
		checkIpfsCidIsValidSubdomain,
		currentMultibaseNameForCidTarget,
		getAllIpfsCidEncodings,
		parseIpfsCid,
	} from '$/lib/multiformats.ts'


	// Props
	let {
		contentPath,
		target,
	}: {
		contentPath: string
		target: string
	} = $props()


	// State
	let showEncodings = $state<ShowEncodings>('common')

	const cid = $derived(parseIpfsCid(target))


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


	// Components
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


{#if cid}
	<section
		class="ipfs-cid-alternate-encodings"
		data-card
		data-column
	>
		<header data-row="wrap">
			<h3>Alternate encodings</h3>

			<label data-row="wrap">
				<span data-text="muted">Show</span>
				<select bind:value={showEncodings}>
					<option value="common">Common</option>
					<option value="no-formatting-variants">All bases</option>
					<option value="all">All bases + formatting variants</option>
				</select>
			</label>
		</header>

		<dl>
			{#each filteredEncodings(target, cid, showEncodings) as encoding (`${encoding.version}-${encoding.baseName}`)}
				{@const subdomainOk = checkIpfsCidIsValidSubdomain({
					baseName: encoding.baseName,
					cidString: encoding.cidString,
				})}
				<div>
					<dt>
						CIDv{String(encoding.version)}
						<small data-text="muted">
							({encoding.baseName})
						</small>
					</dt>
					<dd data-row="wrap">
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
					</dd>
				</div>
			{/each}
		</dl>
	</section>
{/if}


<style>
	.ipfs-cid-alternate-encodings {
		gap: 1rem;
		padding: 1rem;
	}
</style>
