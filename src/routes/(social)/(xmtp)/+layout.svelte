<script lang="ts">
	import { EntityType } from '$/schema/EntityType.ts'
	import { select } from '$/routes/+layout.svelte'
	// Types/constants
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// State
	let { children } = $props()


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import XmtpView from '$/views/XmtpView.svelte'
</script>


<ParentPageCollapsible
	href={resolve('/xmtp')}
	id={stringify({
		scope: 'XmtpNetwork',
	})}
>
	{#snippet Summary({ open: _open })}
		<XmtpView
			selection={select(EntityType.XmtpNetwork, {
				scope: 'XmtpNetwork',
			})}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
