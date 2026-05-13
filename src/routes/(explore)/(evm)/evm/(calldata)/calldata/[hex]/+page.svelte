<script lang="ts">
	import type { PageProps } from './$types.ts'

	import { resolve } from '$app/paths'

	import Page from '$/components/Page.svelte'
	import EvmCalldataView from '$/views/EvmCalldataView.svelte'

	let { data }: PageProps = $props()
</script>


<Page>
	<EvmCalldataView
		entityId={data.entityId}
		href={resolve('/evm/calldata')}
	/>
</Page>
