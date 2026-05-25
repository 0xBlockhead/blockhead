<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'


	// Props
	let { data }: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import ActorView from '$/views/ActorView.svelte'
</script>


<Page>
	<ActorView
		entityId={data.entityId}
	/>
</Page>
