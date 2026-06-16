<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'


	let { data }: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import Erc4337BundlerView from '$/views/Erc4337BundlerView.svelte'
</script>


<Page>
	<Erc4337BundlerView
		selector={data.selector}
	/>
</Page>
