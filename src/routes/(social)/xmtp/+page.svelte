<script lang="ts">
	// Components
	import Page from '$/components/Page.svelte'
	import XmtpView from '$/views/XmtpView.svelte'
</script>


<Page>
	<XmtpView
		selector={{
			scope: 'XmtpNetwork',
		}}
	/>
</Page>
