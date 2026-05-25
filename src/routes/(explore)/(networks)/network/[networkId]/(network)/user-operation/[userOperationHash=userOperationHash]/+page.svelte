<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'


	// State
	let { data }: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EvmUserOperationView from '$/views/EvmUserOperationView.svelte'
</script>


<Page>
	<EvmUserOperationView
		entityId={data.entityId}
	/>
</Page>
