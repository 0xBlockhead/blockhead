<script lang="ts">
	import type { PageProps } from './$types.ts'

	import { resolve } from '$app/paths'

	import Page from '$/components/Page.svelte'
	import EvmErrorView from '$/views/EvmErrorView.svelte'

	let { data }: PageProps = $props()
</script>


<Page>
	<EvmErrorView
		entityId={data.entityId}
		href={resolve('/evm/errors')}
	/>
</Page>
