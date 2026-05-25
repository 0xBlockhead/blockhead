<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'


	// State
	let { data }: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EvmErrorView from '$/views/EvmErrorView.svelte'
</script>


<Page>
	<EvmErrorView
		entityId={data.entityId}
	/>
</Page>
