<script lang="ts">
	import type { PageProps } from './$types.ts'

	import { resolve } from '$app/paths'

	import Page from '$/components/Page.svelte'
	import EvmSelectorView from '$/views/EvmSelectorView.svelte'

	let { data }: PageProps = $props()
</script>


<Page>
	<EvmSelectorView
		entityId={data.entityId}
		href={resolve('/evm/selectors')}
	/>
</Page>
