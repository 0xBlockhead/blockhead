<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'


	// Props
	let { data }: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EvmTopicView from '$/views/EvmTopicView.svelte'
</script>


<Page>
	<EvmTopicView
		entityId={data.entityId}
	/>
</Page>
