<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { CoinInstanceType } from '$/schema/CoinInstance.ts'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let { data }: PageProps = $props()


	// (Derived)
	const coinInstanceSlug = $derived(
		data.entityId.type === CoinInstanceType.NativeCurrency ?
			'native'
		:
			data.entityId.$contract.address,
	)


	// Components
	import Page from '$/components/Page.svelte'
	import CoinInstanceView from '$/views/CoinInstanceView.svelte'
</script>


<Page>
	<CoinInstanceView
		entityId={data.entityId}
	/>
</Page>
