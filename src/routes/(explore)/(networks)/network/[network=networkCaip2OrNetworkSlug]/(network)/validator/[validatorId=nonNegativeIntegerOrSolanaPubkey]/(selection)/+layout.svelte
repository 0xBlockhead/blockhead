<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { LayoutProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		children,
		data,
		params,
	}: LayoutProps = $props()


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import BeaconValidatorView from '$/views/BeaconValidatorView.svelte'
	import SolanaValidatorView from '$/views/SolanaValidatorView.svelte'
</script>


{#key [params.network, params.validatorId].join(':')}
	<ParentPageCollapsible
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/validator/[validatorId=nonNegativeIntegerOrSolanaPubkey]', {
				network: params.network,
				validatorId: params.validatorId,
			})
		}
	>
		{#snippet Summary()}
			{@const DetailView = data.selectorMapping.entityType === EntityType.BeaconValidator ? BeaconValidatorView : SolanaValidatorView}

			<DetailView
				selection={select(data.selectorMapping.entityType, data.selectorMapping.selector)}
				href={
					resolve('/network/[network=networkCaip2OrNetworkSlug]/validator/[validatorId=nonNegativeIntegerOrSolanaPubkey]', {
						network: params.network,
						validatorId: params.validatorId,
					})
				}
				layout={EntityLayout.SummaryInline}
			/>
		{/snippet}

		{@render children()}
	</ParentPageCollapsible>
{/key}
