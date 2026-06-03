<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'


	let { data }: PageProps = $props()


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import Page from '$/components/Page.svelte'
	import EvmNetworkAccountView from '$/views/EvmNetworkAccountView.svelte'
</script>


<Page>
	<section data-card data-column>
		<header>
			<h1>Contract</h1>
		</header>

		<dl data-column-item="center">
			<div>
				<dt>Network</dt>
				<dd>{`${data.entityId.$network.caip2.namespace}:${data.entityId.$network.caip2.reference}`}</dd>
			</div>

			<div>
				<dt>Address</dt>
				<dd>
					<EvmNetworkAccountView
						entityId={{
							$network: data.entityId.$network,
							$actor: { address: data.entityId.address },
						}}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	</section>
</Page>
