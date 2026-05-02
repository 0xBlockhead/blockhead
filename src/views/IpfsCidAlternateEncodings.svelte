<script lang="ts">
	// Types/constants
	type ShowEncodings = 'all' | 'common' | 'no-formatting-variants'


	// Components
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'


	// Functions
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


	// (Derived)
	const cid = $derived(parseIpfsCid(target))

	const encodingRows = $derived(
		cid === undefined ?
			[]
		:	(
				getAllIpfsCidEncodings(cid).filter(({ version, baseName }) => (
					(
						version === cid.version
						&& baseName === currentMultibaseNameForCidTarget(target, cid)
					)
					|| (
						showEncodings === 'common' ?
							version === 0 || baseName === 'base32' || baseName === 'base36'
						: showEncodings === 'no-formatting-variants' ?
							!/(?:upper|pad)$/.test(baseName)
						:
							true
					)
				))
			),
	)
</script>


{#if cid !== undefined}
	<section
		class="ipfs-cid-alternate-encodings"
		data-card
		data-column
	>
		<header data-row="wrap">
			<h3>Alternate encodings</h3>

			<label data-row="wrap">
				<span data-text="muted">Show</span>
				<select
					bind:value={showEncodings}
				>
					<option value="common">Common</option>
					<option value="no-formatting-variants">All bases</option>
					<option value="all">All bases + formatting variants</option>
				</select>
			</label>
		</header>

		<dl data-definition-list="vertical">
			{#each encodingRows as row (`${row.version}-${row.baseName}`)}
				{@const subdomainOk = checkIpfsCidIsValidSubdomain({
					baseName: row.baseName,
					cidString: row.cidString,
				})}
				<div>
					<dt>
						CIDv{String(row.version)}
						<small data-text="muted">
							({row.baseName})
						</small>
					</dt>
					<dd data-row="wrap">
						<button
							type="button"
							onclick={() => {
								window.location.assign(
									ipfsResourceHref({
										namespace: 'ipfs',
										target: row.cidString,
										contentPath,
									}),
								)
							}}
						>
							<TruncatedValue
								value={row.cidString}
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
