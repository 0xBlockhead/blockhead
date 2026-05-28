<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { caip2FromEvmChainId } from '$/lib/caip.ts'


	// State
	let { data }: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import Address from '$/views/Address.svelte'
</script>


<Page>
	<section data-card data-column>
		<header>
			<h1>Contract</h1>
		</header>

		<dl data-column-item="center">
			<div>
				<dt>Network</dt>
				<dd>{caip2FromEvmChainId(data.entityId.$network.chainId)}</dd>
			</div>

			<div>
				<dt>Address</dt>
				<dd>
					<Address
						network={data.entityId.$network}
						address={data.entityId.address}
					/>
				</dd>
			</div>
		</dl>
	</section>
</Page>
