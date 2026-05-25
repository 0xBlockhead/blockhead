<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	let { data }: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import Erc4337BundlerView from '$/views/Erc4337BundlerView.svelte'
</script>


<Page>
	<Erc4337BundlerView
		entityId={data.entityId}
	/>
</Page>
