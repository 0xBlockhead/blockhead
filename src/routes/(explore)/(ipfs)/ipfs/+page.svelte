<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import IpfsBrowseView from '$/views/IpfsBrowseView.svelte'
	import GlobalView from '$/views/GlobalView.svelte'
</script>


<Page>
	<GlobalView
		entityId={{}}
		title="IPFS"
		href={resolve('/ipfs')}
	>
		<section>
			<IpfsBrowseView />
		</section>
	</GlobalView>
</Page>
