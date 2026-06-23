<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// State
	let { children } = $props()


	// Functions
	import { select } from '$/routes/+layout.svelte'


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
			selection={
				select(
					EntityType.XmtpNetwork,
					{
						scope: 'XmtpNetwork',
					}
				)
			}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
