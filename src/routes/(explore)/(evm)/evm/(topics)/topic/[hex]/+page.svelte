<script lang="ts">
	import type { PageProps } from './$types.ts'

	import { resolve } from '$app/paths'

	import Page from '$/components/Page.svelte'
	import EvmTopicView from '$/views/EvmTopicView.svelte'

	let { data }: PageProps = $props()
</script>


<Page>
	<EvmTopicView
		entityId={data.entityId}
		href={resolve('/evm/topics')}
	/>
</Page>
