<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import XmtpView from '$/views/XmtpView.svelte'
</script>


<Page>
	<XmtpView
		entityId={{
			scope: 'XmtpNetwork',
		}}
		href={resolve('/xmtp')}
	/>
</Page>
