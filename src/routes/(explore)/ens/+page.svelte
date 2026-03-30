<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import EnsNameView from '$/views/EnsNameView.svelte'
</script>


<Page>
	<EnsNameView
		entityId={{ name: 'list' }}
		href={resolve('/ens')}
		title={'ENS'}
	/>
</Page>
