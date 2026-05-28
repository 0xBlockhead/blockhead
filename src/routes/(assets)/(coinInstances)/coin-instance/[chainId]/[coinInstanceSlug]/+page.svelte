<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { CoinInstanceType } from '$/schema/EvmCoinInstance.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	let { data }: PageProps = $props()


	const coinInstanceSlug = $derived(
		data.entityId.type === CoinInstanceType.NativeCurrency ?
			'native'
		:
			data.entityId.$contract.address,
	)


	// Components
	import Page from '$/components/Page.svelte'
	import EvmCoinInstanceView from '$/views/EvmCoinInstanceView.svelte'
</script>


<Page>
	<EvmCoinInstanceView
		entityId={data.entityId}
	/>
</Page>
