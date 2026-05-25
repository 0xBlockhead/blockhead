<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'


	// Props
	let { data }: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EvmSelectorView from '$/views/EvmSelectorView.svelte'
</script>


<Page>
	<EvmSelectorView
		entityId={data.entityId}
	/>
</Page>
