<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'


	let { data }: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
</script>


<Page>
	<EvmAccountView
		selector={data.selector}
	/>
</Page>
