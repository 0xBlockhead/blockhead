<script lang="ts">
	import type { PageProps } from './$types.ts'

	import { resolve } from '$app/paths'

	import { CoinInstanceType } from '$/schema/CoinInstance.ts'
	import Page from '$/components/Page.svelte'
	import CoinInstanceView from '$/views/CoinInstanceView.svelte'

	let { data }: PageProps = $props()

	const coinInstanceSlug = $derived(
		data.entityId.type === CoinInstanceType.NativeCurrency ?
			'native'
		:
			data.entityId.$contract.address,
	)
</script>


<Page>
	<CoinInstanceView
		entityId={data.entityId}
		href={resolve(
			'/(assets)/(coinInstances)/coin-instance/[chainId]/[coinInstanceSlug]',
			{
				chainId: String(data.entityId.$network.chainId),
				coinInstanceSlug,
			},
		)}
	/>
</Page>
